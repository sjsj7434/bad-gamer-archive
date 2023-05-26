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
const LOGIN_COOKIE_TTL = 1000 * 60 * 60; //로그인 쿠키 유지 기간 : 1 Hour
const TOKEN_CACHE_TTL = 1000 * 60 * 3; //인증 토큰 캐시 유지 기간 : 3 Minutes

@Injectable()
export class AccountsService {
	constructor(
		@InjectRepository(Accounts) private accountsRepository: Repository<Accounts>,
		@Inject(CACHE_MANAGER) private cacheManager: Cache
	) { }

	/**
	 * 유저의 스토브 소개란에 적을 인증 코드(32글자)를 생성한다
	 */
	async publishUserToken(request: Request): Promise<object>{
		const verificationCode = randomBytes(16).toString("hex");
		await this.cacheManager.set(request.cookies["sessionCode"] + "token", verificationCode, TOKEN_CACHE_TTL);

		return {"data": verificationCode};
	}

	/**
	 * 유저의 스토브 소개란에 적힌 인증 코드를 가져와 비교한다
	 */
	async compareStoveUserToken(request: Request, stoveCode: string): Promise<string>{
		const browser = await puppeteer.launch({
			headless: true,
			waitForInitialPage: false,
		});
		const page = await browser.newPage();
		// await page.setViewport({width: 1920, height: 1080}); //화면 크기 설정, headless: false 여야 확인 가능
		await page.goto(`https://timeline.onstove.com/${stoveCode}`, {waitUntil: "networkidle2"});
		const targetElement = await page.$("#navContent > div > div.layout-column-r > section:nth-child(1) > div.section-body > p"); //소개
		const stoveVerificationCode = await page.evaluate((data) => {
			return data.textContent;
		}, targetElement);
		browser.close(); //창 종료
		
		const publishedToken = await this.cacheManager.get(request.cookies["sessionCode"] + "token");
		
		if (publishedToken === undefined) {
			return "empty";
		}
		else if (publishedToken === stoveVerificationCode) {
			this.cacheManager.del(request.cookies["sessionCode"] + "token");

			return "good";
		}
		else{
			return "bad";
		}
	}

	/**
	 * 유저의 스토브 ID로 로스트아크 대표 캐릭터 이름을 가져온다
	 */
	async getStoveUserCharacters_api(stoveCode: string): Promise<string>{
		const browser = await puppeteer.launch({
			headless: true,
			waitForInitialPage: false,
		});
		const page = await browser.newPage();
		// await page.setViewport({width: 1920, height: 1080}); //화면 크기 설정, headless: false 여야 확인 가능
		await page.goto(`https://lostark.game.onstove.com/Board/GetExpandInfo?memberNo=${stoveCode}`, {timeout: 10000, waitUntil: "networkidle2"});

		const pageTarget = page.target(); //save this to know that this was the opener
		await page.click("body > div.profile-library > div.profile-link > a.button.button--black"); //click on a link
		const newTarget = await browser.waitForTarget(target => target.opener() === pageTarget); //check that you opened this page, rather than just checking the url
		const newPage = await newTarget.page(); //get the page object
		await newPage.waitForSelector("body"); //wait for page to be loaded
		
		const targetElement = await newPage.$("#lostark-wrapper > div > main > div > div.profile-character-info > span.profile-character-info__name");

		const characterName = await newPage.evaluate((data) => {
			return data.getAttribute("title");
		}, targetElement);
		
		console.log("i found => ", characterName);

		browser.close(); //창 종료

		return characterName;
	}

	/**
	 * 유저의 스토브 ID로 로스트아크 캐릭터 이름 목록을 가져온다
	 * 서버이름에 포함된 @를 이용해 반환 값을 split하여 사용
	 */
	async getStoveUserCharacters_scrap(stoveCode: string): Promise<object>{
		const result: object = {
			characterName: "",
			serverName: ""
		};
		const browser = await puppeteer.launch({
			headless: true,
			waitForInitialPage: false,
		});
		const page = await browser.newPage();
		// await page.setViewport({width: 1920, height: 1080}); //화면 크기 설정, headless: false 여야 확인 가능
		await page.goto(`https://lostark.game.onstove.com/Board/GetExpandInfo?memberNo=${stoveCode}`, {timeout: 10000, waitUntil: "networkidle2"});

		const pageTarget = page.target(); //save this to know that this was the opener
		await page.click("body > div.profile-library > div.profile-link > a.button.button--black"); //click on a link
		const newTarget = await browser.waitForTarget(target => target.opener() === pageTarget); //check that you opened this page, rather than just checking the url
		const newPage = await newTarget.page(); //get the page object
		await newPage.waitForSelector("body"); //wait for page to be loaded
		
		const targetElement = await newPage.$("#expand-character-list"); //소개

		const characterNames = await newPage.evaluate((data) => {
			const serverNameElements = data.querySelectorAll("strong");
			const serverCharacterElements = data.querySelectorAll("ul");
			const characterNameElements = data.querySelectorAll("ul > li > span > button > span");
			const serverNames: Array<string> = [];
			const serverCharacterCounts: Array<number> = [];
			const characterNames: Array<string> = [];

			console.log(serverNameElements);
			console.log(serverCharacterElements);
			console.log(characterNameElements);
			
			for(const element of serverNameElements){
				serverNames.push(element.textContent);
			}
			for(const element of serverCharacterElements){
				serverCharacterCounts.push(element.querySelectorAll("li").length);
			}

			let serverIndex = 0;
			let characterIndex = 0;
			for(const element of characterNameElements){
				if(characterIndex >= serverCharacterCounts[serverIndex]){
					characterIndex = 0;
					serverIndex++;
				}
				characterNames.push(serverNames[serverIndex] + " => " + element.textContent);
				characterIndex++;
			}

			return characterNames;
		}, targetElement);
		
		console.log(characterNames)

		browser.close(); //창 종료

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
	async checkSignInStatus(request: Request, response: Response): Promise<{ status: string, id: string, nickname: string, lostarkMainCharacter: string }> {
		if (request.cookies["sessionCode"] === undefined) {
			console.log(SIGN_IN_SESSION)
			return {
				status: "no_cookie",
				id: "",
				nickname: "",
				lostarkMainCharacter: "",
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
					nickname: "",
					lostarkMainCharacter: "",
				}
			}
			else if (userData.isBanned === true) {
				this.setSignOut(request, response);

				return {
					status: "banned",
					id: "",
					nickname: "",
					lostarkMainCharacter: "",
				}
			}
			else if (userData.isLost === true) {
				this.setSignOut(request, response);

				return {
					status: "lost",
					id: "",
					nickname: "",
					lostarkMainCharacter: "",
				}
			}
			else{
				response.cookie("sessionCode", request.cookies["sessionCode"], { maxAge: LOGIN_COOKIE_TTL, httpOnly: true, secure: true }); //expire 갱신

				return {
					status: "using",
					id: userData.id,
					nickname: userData.nickname,
					lostarkMainCharacter: userData.lostarkMainCharacter,
				}
			}
		}
		else { //잘못된 쿠키 값
			response.clearCookie("sessionCode"); //쿠키 값 삭제 처리
			return {
				status: "wrong_cookie",
				id: "",
				nickname: "",
				lostarkMainCharacter: "",
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
	 * ID에 맞는 계정을 수정한다
	 * find > 정보 수정 > save 처리
	 */
	async updateLostarkMainCharacter(request: Request, dto: AccountsDTO) {
		const account = await this.accountsRepository.findOne({
			where: {
				id: SIGN_IN_SESSION.get(request.cookies["sessionCode"]),
			}
		});

		account.lostarkMainCharacter = dto.lostarkMainCharacter;

		await this.accountsRepository.save(account);
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

		response.cookie("sessionCode", sessionCode, { maxAge: LOGIN_COOKIE_TTL, httpOnly: true, secure: true });
	}

	/**
	 * 로그아웃 Cookie 설정
	 */
	setSignOut(request: Request, response: Response) {
		console.log("[!] setSignOut => " + request.cookies["sessionCode"]);
		if (SIGN_IN_SESSION.has(request.cookies["sessionCode"]) === true) { //초기화
			SIGN_IN_SESSION.delete(request.cookies["sessionCode"]);
		}

		if (request.cookies["sessionCode"] !== undefined) { //초기화
			response.clearCookie("sessionCode");
		}
	}
}