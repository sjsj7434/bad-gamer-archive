import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Accounts } from './accounts.entity';
import { AccountsDTO } from './accounts.dto';
import { randomBytes } from 'crypto';
import puppeteer from 'puppeteer';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';

const LOGIN_FAIL_LIMIT: number = 5; //로그인 최대 실패
const SIGN_IN_SESSION: Map<string, string> = new Map(); //로그인 세션

@Injectable()
export class AccountsService {
	constructor(
		@InjectRepository(Accounts) private accountsRepository: Repository<Accounts>,
		@Inject(CACHE_MANAGER) private cacheManager: Cache
	) { }

	/**
	 * 유저의 스토브 소개란에 적을 인증 코드(32글자)를 생성한다
	 */
	async publishUserToken(): Promise<object>{
		const verificationCode = randomBytes(16).toString("hex");
		
		//인증번호는 node-cache를 사용하는 방법을 고려 중...
		// const value = await this.cacheManager.get("verificationCode");
		// console.log("cacheManager verificationCode => ", value)
		// await this.cacheManager.set("verificationCode", verificationCode, (60 * 1000 * 3)); //3 minutes TTL(Time to live)
		// await this.cacheManager.del("verificationCode");
		// await this.cacheManager.reset();

		return {"data": verificationCode};
	}

	/**
	 * 유저의 스토브 소개란에 적힌 인증 코드를 가져온다
	 */
	async getStoveUserToken(stoveCode: string): Promise<object>{
		const browser = await puppeteer.launch({
			headless: true,
			waitForInitialPage: true,
		});
		const page = await browser.newPage();
		// await page.setViewport({width: 1920, height: 1080}); //화면 크기 설정, headless: false 여야 확인 가능
		await page.goto(`https://timeline.onstove.com/${stoveCode}`, {waitUntil: "networkidle2"});
		console.log(`https://timeline.onstove.com/${stoveCode}`)

		const targetElement = await page.$("#navContent > div > div.layout-column-r > section:nth-child(1) > div.section-body > p"); //소개

		const stoveVerificationCode = await page.evaluate((data) => {
			return data.textContent;
		}, targetElement);
		
		await browser.close(); //창 종료

		return {"data": stoveVerificationCode};
	}

	/**
	 * 유저의 스토브 ID로 로스트아크 캐릭터 이름 목록을 가져온다
	 * 서버이름에 포함된 @를 이용해 반환 값을 split하여 사용
	 */
	async getStoveUserCharacters(stoveCode: string): Promise<object>{
		const result: object = {
			characterName: "",
			serverName: ""
		};
		const browser = await puppeteer.launch({
			headless: true,
			waitForInitialPage: true,
		});
		const page = await browser.newPage();
		// await page.setViewport({width: 1920, height: 1080}); //화면 크기 설정, headless: false 여야 확인 가능
		await page.goto(`https://lostark.game.onstove.com/Board/GetExpandInfo?memberNo=${stoveCode}`, {timeout: 10000, waitUntil: "networkidle2"});

		const pageTarget = page.target(); //save this to know that this was the opener
		await page.click("body > div.profile-library > div.profile-link > a.button.button--black"); //click on a link
		const newTarget = await browser.waitForTarget(target => target.opener() === pageTarget); //check that you opened this page, rather than just checking the url
		const newPage = await newTarget.page(); //get the page object
		await newPage.waitForSelector("body"); //wait for page to be loaded

		// const serverInfo = await newPage.$$eval("#expand-character-list > strong", (servers) => {
		// 	const serverList: Array<string> = [];
		// 	for(const element of servers){
		// 		serverList.push(element.textContent);
		// 	}
		// 	return serverList;
		// });

		const characterNames = await newPage.$$eval("#expand-character-list > ul > li > span > button > span", (characters) => {
			const characterList: Array<string> = [];
			for(const element of characters){
				characterList.push(element.textContent);
			}
			return characterList;
		});

		await browser.close(); //창 종료

		return characterNames;
	}

	/**
	 * ID로 1개의 계정을 찾는다
	 */
	findWithID(accountID: string): Promise<Accounts | null> {
		return this.accountsRepository.findOne({
			where: {
				id: accountID,
			},
		});
	}

	/**
	 * Nickname으로 1개의 계정을 찾는다
	 */
	findWithNickname(nickname: string): Promise<Accounts | null> {
		return this.accountsRepository.findOne({
			where: {
				nickname: nickname,
			},
		});
	}

	/**
	 * Controller에서 넘겨준 정보를 사용하여 계정을 전부 찾는다
	 */
	findAll(): Promise<Accounts[]> {
		return this.accountsRepository.find({
			// where: whereCondition,
			// take, skip / it is for the pagination
			// order
		});
	}

	/**
	 * 중복되는 정보가 있는지 확인 후 계정을 생성한다
	 */
	async createAccount(dto: AccountsDTO): Promise<number> {
		const idCheck: object|null = await this.findWithID(dto.id);
		const nicknameCheck: object | null = await this.findWithNickname(dto.nickname);

		if (idCheck !== null && nicknameCheck !== null) {
			return 0; //이미 ID & Nickname 존재
		}
		else if (idCheck !== null) {
			return 1; //이미 ID 존재
		}
		else if (nicknameCheck !== null) {
			return 2; //이미 Nickname 존재
		}
		else{
			const saltRounds: number = 10;
			const password: string = dto.password;
			const encryptSalt: string = await bcrypt.genSalt(saltRounds);
			const hash = await bcrypt.hash(password, encryptSalt);
			const isMatch = await bcrypt.compare(password, hash);

			if (isMatch === false){
				return 3; //비밀번호 암호화 도중 오류 발생
			}
			else {
				dto.password = hash;

				await this.accountsRepository.save(dto);

				return 4; //정상 처리
			}
		}
	}

	/**
	 * ID에 맞는 계정을 수정한다
	 * find > 정보 수정 > save 처리
	 */
	async updateAccount(dto: AccountsDTO) {
		const account = await this.accountsRepository.findOne({
			where: {
				id: dto.id,
			}
		});

		account.id = dto.id;

		await this.accountsRepository.save(account);
	}

	/**
	 * code에 맞는 계정을 삭제(논리 삭제)
	 * find > 정보 수정 > softDelete 처리
	 */
	async deleteAccount(dto: AccountsDTO) {
		await this.accountsRepository.softDelete({
			code: dto.code
		});
	}

	/**
	 * 중복 로그인 방지, 이미 해당 계정으로 로그인한 사람이 있는지 확인
	 */
	async checkSignInStatus(request: Request, response: Response): Promise<{ status: string, id: string }> {
		if (request.cookies["sessionCode"] === undefined) {
			return {
				status: "no_cookie",
				id: "",
			}
		}
		else if (SIGN_IN_SESSION.has(request.cookies["sessionCode"]) === true) { //해당 계정 세션이 이미 존재
			const userData: Accounts = await this.accountsRepository.findOne({
				where: {
					id: SIGN_IN_SESSION.get(request.cookies["sessionCode"]),
				},
			});

			if (userData.isLocked === true) {
				this.setSignOut(request, response);

				return {
					status: "locked",
					id: "",
				}
			}
			else if (userData.isBanned === true) {
				this.setSignOut(request, response);

				return {
					status: "banned",
					id: "",
				}
			}
			else if (userData.isLost === true) {
				this.setSignOut(request, response);

				return {
					status: "lost",
					id: "",
				}
			}
			else{
				response.cookie("sessionCode", request.cookies["sessionCode"], { maxAge: (1000 * 60 * 2), httpOnly: true, secure: true }); //expire 갱신

				return {
					status: "using",
					id: SIGN_IN_SESSION.get(request.cookies["sessionCode"]),
				}
			}
		}
		else { //잘못된 쿠키 값
			response.clearCookie("sessionCode"); //쿠키 값 삭제 처리
			return {
				status: "wrong_cookie",
				id: "",
			}
		}
	}

	/**
	 * 로그인
	 */
	async signInAccount(dto: AccountsDTO, cookieCheck: string, request: Request, response: Response): Promise<string> {
		const account = await this.accountsRepository.findOne({
			where: {
				id: dto.id,
			}
		});

		if (account === null) {
			// no account
			return "fail";
		}
		else if (account.isLocked === true) {
			// login isLocked
			return "locked";
		}
		else if (account.isBanned === true) {
			// login isBanned
			return "fail";
		}
		else if (account.isLost === true) {
			// login isLost
			return "fail";
		}
		else {
			const isMatch: boolean = await bcrypt.compare(dto.password, account.password);

			if (isMatch === false) { //로그인 실패
				account.loginFailCount++; //로그인 실패 횟수 + 1

				if (account.loginFailCount >= LOGIN_FAIL_LIMIT) { //실패 제한에 걸리면 계정 잠금 처리
					account.isLocked = true;
				}

				account.loginFailIP = request.ip; //로그인 실패한 IP

				await this.accountsRepository.save(account);

				return "fail";
			}
			else { //로그인 성공
				for (const sessionData of SIGN_IN_SESSION) {
					if (dto.id === sessionData[1]) { //같은 ID로 이미 세션이 존재하면
						console.log("[!] delete session");
						SIGN_IN_SESSION.delete(sessionData[0]); //해당 세션을 삭제
						break;
					}
				}

				if (cookieCheck === "no_cookie" || cookieCheck === "using") {
					account.loginFailCount = 0;
					account.lastLogin = new Date();
					account.loginSuccessIP = request.ip; //로그인 성공한 IP

					await this.accountsRepository.save(account);

					this.setSignInCookie(dto, request, response);

					return "success";
				}
				else if (cookieCheck === "wrong_cookie") { //잘못된 쿠키 값, 쿠키 값 삭제 처리
					return "wrong_cookie";
				}
			}
		}
	}

	/**
	 * 로그인 시 Cookie 설정
	 */
	setSignInCookie(dto: AccountsDTO, request: Request, response: Response) {
		const saltRounds: number = 15;
		const sessionCode: string = bcrypt.genSaltSync(saltRounds);

		if (SIGN_IN_SESSION.has(request.cookies["sessionCode"]) === true) { //초기화
			SIGN_IN_SESSION.delete(request.cookies["sessionCode"]);
		}

		if (request.cookies["sessionCode"] !== undefined) { //초기화
			response.clearCookie("sessionCode");
		}

		SIGN_IN_SESSION.set(sessionCode, dto.id);

		response.cookie("sessionCode", sessionCode, { maxAge: (1000 * 60 * 2), httpOnly: true, secure: true });
	}

	/**
	 * 로그아웃 Cookie 설정
	 */
	setSignOut(request: Request, response: Response) {
		console.log("[!] setSignOut")
		if (SIGN_IN_SESSION.has(request.cookies["sessionCode"]) === true) { //초기화
			SIGN_IN_SESSION.delete(request.cookies["sessionCode"]);
		}

		if (request.cookies["sessionCode"] !== undefined) { //초기화
			response.clearCookie("sessionCode");
		}
	}
}