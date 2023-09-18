import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Accounts } from './accounts.entity';
import { CreateAccountsDTO, DeleteAccountsDTO, UpdateAccountsDTO } from './accounts.dto';
import { randomBytes } from 'crypto';
import puppeteer from 'puppeteer';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';

const LOGIN_FAIL_LIMIT: number = 5; //로그인 최대 실패
const SIGN_IN_SESSION: Map<string, string> = new Map(); //로그인 세션
const LOGIN_COOKIE_TTL = 1000 * 60 * 60 * 2; //로그인 쿠키 유지 기간 : 2 Hours
const STOVE_CODE_TTL = 1000 * 60 * 3; //스토브 인증 코드 캐시 유지 기간 : 3 Minutes
const EMAIL_CODE_TTL = 1000 * 60 * 60; //이메일 인증 코드 캐시 유지 기간 : 1 Hour

@Injectable()
export class AccountsService {
	constructor(
		@InjectRepository(Accounts) private accountsRepository: Repository<Accounts>,
		@Inject(CACHE_MANAGER) private cacheManager: Cache
	) { }

	/**
	 * 스토브 소개란에 적을 인증 코드(32글자)를 생성한다
	 */
	async createStoveVerificationCode(request: Request): Promise<string>{
		const stoveVerificationCode = randomBytes(16).toString("hex");
		await this.cacheManager.set("STOVE_" + request.cookies["sessionCode"], stoveVerificationCode, STOVE_CODE_TTL);

		return stoveVerificationCode;
	}

	/**
	 * 스토브 소개란에 적힌 인증 코드를 가져와 비교한다
	 */
	async compareStoveVerificationCode(request: Request, stoveCode: string): Promise<boolean>{
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
		
		const publishedToken = await this.cacheManager.get("STOVE_" + request.cookies["sessionCode"]);
		
		if (publishedToken === stoveVerificationCode) {
			this.cacheManager.del("STOVE_" + request.cookies["sessionCode"]);

			return true;
		}
		else{
			return false;
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
		
		browser.close(); //창 종료

		return characterName;
	}

	/**
	 * 유저의 스토브 ID로 로스트아크 캐릭터 이름 목록을 가져온다
	 * 서버이름에 포함된 @를 이용해 반환 값을 split하여 사용
	 */
	async getStoveUserCharacters_scrap(stoveCode: string): Promise<Array<{ ServerName: string, CharacterName: string, ItemMaxLevel: string, CharacterClassName: string }>>{
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

		const [serverNames, serverCharacterCounts, characterNames] = await newPage.evaluate((data): [Array<string>, Array<number>, Array<string>] => {
			const serverNameElements: NodeListOf<HTMLElement> = data.querySelectorAll("strong");
			const serverCharacterElements: NodeListOf<HTMLElement> = data.querySelectorAll("ul");
			const characterNameElements: NodeListOf<HTMLElement> = data.querySelectorAll("ul > li > span > button > span");
			const serverNamesBrowser: Array<string> = [];
			const serverCharacterCountsBrowser: Array<number> = [];
			const characterNamesBrowser: Array<string> = [];

			// 여기 console.log는 브라우저에서 출력되는 코드
			// console.log('serverNameElements', serverNameElements);
			// console.log('serverCharacterElements', serverCharacterElements);
			// console.log('characterNameElements', characterNameElements);
			// {ServerName: string, CharacterName: string}
			
			for(const element of serverNameElements){
				serverNamesBrowser.push(element.textContent);
			}
			for(const element of serverCharacterElements){
				serverCharacterCountsBrowser.push(element.querySelectorAll("li").length);
			}

			let serverIndex = 0;
			let characterIndex = 0;
			for(const element of characterNameElements){
				if(characterIndex >= serverCharacterCountsBrowser[serverIndex]){
					characterIndex = 0;
					serverIndex++;
				}
				characterNamesBrowser.push(serverNamesBrowser[serverIndex] + "|" + element.textContent + "|" + "9999.99" + "|" + "수육국밥");
				characterIndex++;
			}

			return [serverNamesBrowser, serverCharacterCountsBrowser, characterNamesBrowser];
		}, targetElement);

		const characterArray: Array<{ ServerName: string, CharacterName: string, ItemMaxLevel: string, CharacterClassName: string }> = [];

		characterNames.map((characterInfo) => {
			const [server, character, level, className] = characterInfo.split("|");

			return characterArray.push(
				{
					ServerName: server.replace("@", ""),
					CharacterName: character,
					ItemMaxLevel: level,
					CharacterClassName: className,
				}
			);
		});
		// console.log('serverNames', serverNames)
		// console.log('');
		// console.log('serverCharacterCounts', serverCharacterCounts)
		// console.log('');
		// console.log('characterNames', characterNames)
		// console.log('');

		browser.close(); //창 종료

		return characterArray;
	}

	/**
	 * 유저가 선택한 캐릭터의 이름으로 데이터를 가져온다
	 */
	async getCharacterInfo_scrap(characterName: string): Promise<object>{
		const browser = await puppeteer.launch({
			headless: true,
			waitForInitialPage: false,
		});
		const page = await browser.newPage();
		// await page.setViewport({width: 1080, height: 800}); //화면 크기 설정, headless: false 여야 확인 가능
		await page.goto(`https://lostark.game.onstove.com/Profile/Character/${encodeURIComponent(characterName)}`, {timeout: 10000, waitUntil: "networkidle2"});

		const targetElement = await page.$("#lostark-wrapper > div > main > div > div.profile-ingame > div.profile-info"); //소개

		const characterInfo = await page.evaluate((data): any => {
			const characterName: HTMLElement = document.querySelector("#lostark-wrapper > div > main > div > div.profile-character-info > span.profile-character-info__name");
			const characterImage: HTMLElement = document.querySelector("#profile-equipment > div.profile-equipment__character > img");
			const expeditionLevel: HTMLElement = data.querySelector("div.level-info > div.level-info__expedition > span:nth-child(2)");
			const combatLevel: HTMLElement = data.querySelector("div.level-info > div.level-info__item > span:nth-child(2)");
			const maxItemLevel: HTMLElement = data.querySelector("div.level-info2 > div.level-info2__item > span:nth-child(2)");
			const title: HTMLElement = data.querySelector("div.game-info > div.game-info__title > span:nth-child(2)");
			const guildName: HTMLElement = data.querySelector("div.game-info > div.game-info__guild > span:nth-child(2)");
			const pvpGrade: HTMLElement = data.querySelector("div.game-info > div.level-info__pvp > span:nth-child(2)");
			const stringholdLevel: HTMLElement = data.querySelector("div.game-info > div.game-info__wisdom > span:nth-child(2)");
			const stringholdName: HTMLElement = data.querySelector("div.game-info > div.game-info__wisdom > span:nth-child(3)");
			const collectibles: NodeListOf<HTMLElement> = document.querySelectorAll("#tab1 > div.lui-tab__menu > a");
			const cardEffects: NodeListOf<HTMLElement> = document.querySelectorAll("#cardSetList > li");
			const lifeSkills: NodeListOf<HTMLElement> = document.querySelectorAll("#profile-skill > div.profile-skill-life > ul > li");

			const collectiblesString = [];
			for(const element of collectibles){
				collectiblesString.push(element.textContent);
			}

			const cardEffectsString = [];
			for(const element of cardEffects){
				cardEffectsString.push(element.querySelector("div.card-effect__title").textContent);
			}

			const lifeSkillsString = [];
			for(const element of lifeSkills){
				lifeSkillsString.push(element.textContent);
			}
			
			const characterInformation: object = {
				characterName: characterName.textContent,
				characterImage: characterImage.getAttribute("src"),
				expeditionLevel: expeditionLevel.textContent,
				combatLevel: combatLevel.textContent,
				maxItemLevel: maxItemLevel.textContent,
				title: title.textContent,
				guildName: guildName.textContent,
				pvpGrade: pvpGrade.textContent,
				stringholdLevel: stringholdLevel.textContent,
				stringholdName: stringholdName.textContent,
				collectibles: collectiblesString,
				cardEffects: cardEffectsString,
				lifeSkills: lifeSkillsString,
			};

			return characterInformation;
		}, targetElement);

		browser.close(); //창 종료

		return characterInfo;
	}

	/**
	 * unique uuid를 생성함, 10번의 시도 내에 생성하지 못하면 빈값 반환
	 */
	async getUniqueUUID(): Promise<string> {
		let uuidExists: boolean = true;
		let randomString: string = ""; //uuid
		let currentLoop: number = 0; //현재 시도 횟수
		const maxLoop: number = 10; //최대 시도 횟수

		while (uuidExists === true) {
			currentLoop++;
			randomString = randomBytes(20).toString("hex");

			uuidExists = await this.accountsRepository.exist({
				where: {
					uuid: randomString,
				},
			});

			if (maxLoop < currentLoop) {
				//10번의 시도내에 unique uuid 생성 실패
				randomString = "";
				break;
			}
		}

		return randomString;
	}

	/**
	 * 이미 존재하는 email인지 확인
	 */
	isExistsID(accountID: string): Promise<boolean> {
		return this.accountsRepository.exist({
			where: {
				id: accountID,
			},
		});
	}

	/**
	 * 이미 존재하는 nickname인지 확인
	 */
	isExistsNickname(accountNickname: string): Promise<boolean> {
		return this.accountsRepository.exist({
			where: {
				nickname: accountNickname,
			},
		});
	}

	/**
	 * 중복되는 정보가 있는지 확인 후 계정을 생성한다
	 */
	async createAccount(createAccountsDTO: CreateAccountsDTO): Promise<number> {
		const uniqueUUID: string = await this.getUniqueUUID();
		const idExists: boolean = await this.isExistsID(createAccountsDTO.id);
		const nicknameExists: boolean = await this.isExistsNickname(createAccountsDTO.nickname);
		if (idExists === true && nicknameExists === true) {
			return 0; //이미 ID & Nickname 존재
		}
		else if (idExists === true) {
			return 1; //이미 ID 존재
		}
		else if (nicknameExists === true) {
			return 2; //이미 Nickname 존재
		}
		else if (uniqueUUID === ""){
			return 5; //unique uuid를 생성할 수 없음
		}
		else{
			const saltRounds: number = 10;
			const password: string = createAccountsDTO.password;
			const encryptSalt: string = await bcrypt.genSalt(saltRounds);
			const hash = await bcrypt.hash(password, encryptSalt);
			const isMatch = await bcrypt.compare(password, hash);

			if (isMatch === false){
				return 3; //비밀번호 암호화 도중 오류 발생
			}
			else {
				createAccountsDTO.uuid = uniqueUUID;
				createAccountsDTO.password = hash;

				await this.accountsRepository.save(createAccountsDTO);

				return 4; //정상 처리
			}
		}
	}

	/**
	 * code에 맞는 계정을 삭제(논리 삭제)
	 * find > 정보 수정 > softDelete 처리
	 */
	async deleteAccount(deleteAccountsDTO: DeleteAccountsDTO) {
		await this.accountsRepository.softDelete({
			id: deleteAccountsDTO.id,
			password: deleteAccountsDTO.password
		});
	}

	/**
	 * 중복 로그인 방지, 이미 해당 계정으로 로그인한 사람이 있는지 확인
	 * 
	 * empty: 로그인을 시도하지 않은 상태
	 * locked: 잠금 상태
	 * banned: 밴 상태
	 * signin: 정상적인 상태
	 * error: 오류
	 */
	async checkSignInStatus(request: Request, response: Response): Promise<{ status: string, id: string, nickname: string }> {
		if (request.cookies["sessionCode"] === undefined) { //로그인을 시도하지 않은 상태
			return {
				status: "empty",
				id: "",
				nickname: "",
			}
		}
		else if (SIGN_IN_SESSION.has(request.cookies["sessionCode"]) === true) { //정상적으로 로그인한 쿠키가 있다
			const account = await this.accountsRepository.findOne({
				where: {
					uuid: SIGN_IN_SESSION.get(request.cookies["sessionCode"]),
				},
			});

			if (account === null) { //확인해보니 로그인 쿠키 정보와 맞는 계정이 DB에 없다
				this.setSignOut(request, response);

				return {
					status: "error",
					id: "",
					nickname: "",
				}
			}
			else if (account.isLocked === true) { //확인해보니 해당 계정이 잠금 상태
				this.setSignOut(request, response);

				return {
					status: "locked",
					id: "",
					nickname: "",
				}
			}
			else if (account.isBanned === true) { //확인해보니 해당 계정이 밴 상태
				this.setSignOut(request, response);

				return {
					status: "banned",
					id: "",
					nickname: "",
				}
			}
			else{ //정상적인 상태
				response.cookie("sessionCode", request.cookies["sessionCode"], { maxAge: LOGIN_COOKIE_TTL, httpOnly: true, secure: true }); //expire 갱신

				return {
					status: "signin",
					id: account.id,
					nickname: account.nickname,
				}
			}
		}
		else { //로그인 쿠키는 있지만 서버에서 확인할 수 없는 쿠키
			this.setSignOut(request, response);

			return {
				status: "error",
				id: "",
				nickname: "",
			}
		}
	}

	/**
	 * 로그인
	 */
	async signInAccount(body: { id: string, password: string }, request: Request, response: Response): Promise<string> {
		const account = await this.accountsRepository.findOne({
			where: {
				id: body.id,
				isBanned: false,
			}
		});

		if (account === null){ //로그인하려는 계정이 존재하지 않음
			return "fail";
		}
		else if (account.isLocked === true) {
			return "locked";
		}
		else{
			const isMatch: boolean = await bcrypt.compare(body.password, account.password);

			if (isMatch === false) { //로그인 실패
				const failCount = account.loginFailCount + 1; //로그인 실패 횟수 + 1

				await this.accountsRepository.update(
					{ //조건
						uuid: account.uuid,
					},
					{ //변경 값
						loginFailIP: request.ip,
						loginFailCount: failCount,
						isLocked: (failCount >= LOGIN_FAIL_LIMIT), //실패 제한에 걸리면 계정 잠금 처리
					},
				);

				if (failCount === (LOGIN_FAIL_LIMIT - 1)){
					return "fail_limit"; //한번 더 실패할 경우 계정이 잠깁니다, 비밀번호 찾기로 잠김 해제 가능
				}
				else if (failCount >= LOGIN_FAIL_LIMIT) {
					return "locked";
				}
				else{
					return "fail";
				}
			}
			else { //로그인 성공
				if (account.isSleep === true) {
					return "sleep";
				}
				else{
					await this.accountsRepository.update(
						{ //조건
							uuid: account.uuid,
						},
						{ //변경 값
							loginSuccessIP: request.ip,
							loginFailCount: 0,
							lastLogin: new Date(),
						},
					);

					this.setSignInCookie(account, request, response);

					return "success";
				}
			}
		}
	}

	/**
	 * 로그인 시 Cookie 설정
	 */
	setSignInCookie(account: Accounts, request: Request, response: Response) {
		const saltRounds: number = 15;
		const sessionCode: string = bcrypt.genSaltSync(saltRounds);

		for (const sessionData of SIGN_IN_SESSION) {
			if (account.uuid === sessionData[1]) { //같은 uuid 세션이 존재하면
				SIGN_IN_SESSION.delete(sessionData[0]); //해당 세션을 삭제
				break;
			}
		}

		if (SIGN_IN_SESSION.has(request.cookies["sessionCode"]) === true) { //초기화
			SIGN_IN_SESSION.delete(request.cookies["sessionCode"]);
		}

		if (request.cookies["sessionCode"] !== undefined) { //초기화
			response.clearCookie("sessionCode");
		}

		SIGN_IN_SESSION.set(sessionCode, account.uuid);

		response.cookie("sessionCode", sessionCode, { maxAge: LOGIN_COOKIE_TTL, httpOnly: true, secure: true });
	}

	/**
	 * 로그아웃 Cookie 설정
	 */
	setSignOut(request: Request, response: Response) {
		if (SIGN_IN_SESSION.has(request.cookies["sessionCode"]) === true) {
			SIGN_IN_SESSION.delete(request.cookies["sessionCode"]); //서버의 로그인 데이터에서 삭제
		}

		if (request.cookies["sessionCode"] !== undefined) {
			response.clearCookie("sessionCode"); //사용자의 쿠키 값 삭제
		}
	}

	/**
	 * 내 정보 가져오기
	 */
	async getMyInfo(request: Request, response: Response): Promise<Accounts> {
		const acctountData = await this.accountsRepository.findOne({
			select: {
				id: true,
				nickname: true,
				lastLogin: true,
				loginSuccessIP: true,
				passwordChangeDate: true,
				// lostarkMainCharacter: true,
				// 게임 계정 인증 테이블 분리 작업 중 / 2023-07-30
			},
			where: {
				uuid: SIGN_IN_SESSION.get(request.cookies["sessionCode"]),
			}
		});

		return acctountData;
	}

	/**
	 * 비밀번호 변경
	 */
	async updatePassword(request: Request, response: Response, body: { oldPassword: string, newPassword: string }): Promise<number> {
		const acctountData = await this.accountsRepository.findOne({
			select: {
				id: true,
				password: true,
			},
			where: {
				uuid: SIGN_IN_SESSION.get(request.cookies["sessionCode"]),
			}
		});

		if (acctountData !== null){
			const isMatch: boolean = await bcrypt.compare(body.oldPassword, acctountData.password);

			if (body.oldPassword === body.newPassword) {
				return 0;
			}
			else if (isMatch === true) {
				const saltRounds: number = 10;
				const password: string = body.newPassword;
				const encryptSalt: string = await bcrypt.genSalt(saltRounds);
				const hash = await bcrypt.hash(password, encryptSalt);
				const isRight = await bcrypt.compare(password, hash);

				if (isRight === true){
					await this.accountsRepository.update(
						{ //조건
							id: acctountData.id
						},
						{ //변경 값
							password: hash,
							passwordChangeDate: new Date()
						}
					)

					this.setSignOut(request, response);
					
					return 1;
				}
				else {
					return 3;
				}
			}
			else {
				return 2;
			}
		}
		else{
			return 3;
		}
	}

	/**
	 * 닉네임 변경
	 */
	async updateNickname(request: Request, response: Response, body: { nickname: string, password: string }): Promise<Boolean> {
		const acctountData = await this.accountsRepository.findOne({
			select: {
				id: true,
				password: true,
			},
			where: {
				uuid: SIGN_IN_SESSION.get(request.cookies["sessionCode"]),
			}
		});

		if (acctountData !== null) {
			const isMatch: boolean = await bcrypt.compare(body.password, acctountData.password);

			if (isMatch === true) {
				await this.accountsRepository.update(
					{ //조건
						id: acctountData.id
					},
					{ //변경 값
						nickname: body.nickname,
					}
				)

				return true;
			}
			else {
				return false;
			}
		}
		else {
			return false;
		}
	}

	/**
	 * ID에 맞는 계정을 수정한다
	 * find > 정보 수정 > save 처리
	 */
	async updateLostarkMainCharacter(request: Request, body: { lostarkMainCharacter: string }) {
		const account = await this.accountsRepository.findOne({
			where: {
				uuid: SIGN_IN_SESSION.get(request.cookies["sessionCode"]),
			}
		});

		// account.lostarkMainCharacter = body.lostarkMainCharacter;
		// 게임 계정 인증 테이블 분리 작업 중 / 2023-07-30

		await this.accountsRepository.save(account);
	}

	/**
	 * 비밀번호를 잊어버려 비밀번호 초기화하기 전 확인
	 */
	async beforeResetPassword(body: { id: string }): Promise<string> {
		const account = await this.accountsRepository.findOne({
			where: {
				id: body.id,
				isBanned: false,
			},
		});

		if (account === null){
			return "no_user";
		}
		else {
			const verificationCode = randomBytes(16).toString("hex");
			await this.cacheManager.set("PASSWORD_" + verificationCode, account.uuid, EMAIL_CODE_TTL);

			return "email_sent";
		}
	}

	/**
	 * 메일로 전달한 링크의 값을 확인
	 */
	async checkResetEmail(verificationCode: string): Promise<string> {
		const uuid: string = await this.cacheManager.get("PASSWORD_" + verificationCode);

		if (uuid === undefined){
			return "no_user";
		}
		else{
			const account = await this.accountsRepository.findOne({
				where: {
					uuid: uuid,
				},
			});
	
			if (account === null) {
				return "no_user";
			}
			else {
				return "verified";
			}
		}
	}

	/**
	 * 메일로 전달한 링크를 클릭하여 비밀번호 초기화
	 */
	async resetPassword(body: { newPassword: string, verificationCode: string }): Promise<string> {
		const uuid: string = await this.cacheManager.get("PASSWORD_" + body.verificationCode);

		if (uuid === undefined) {
			return "no_user";
		}
		else {
			const saltRounds: number = 10;
			const password: string = body.newPassword;
			const encryptSalt: string = await bcrypt.genSalt(saltRounds);

			const account = await this.accountsRepository.findOne({
				where: {
					uuid: uuid,
				}
			})
			const isSame = await bcrypt.compare(password, account.password);

			if (isSame === false){
				const hash = await bcrypt.hash(password, encryptSalt);
				const isMatch = await bcrypt.compare(password, hash);

				if (isMatch === true) {
					await this.accountsRepository.update(
						{
							uuid: uuid
						},
						{
							isLocked: false,
							loginFailCount: 0,
							password: hash,
							passwordChangeDate: new Date(),
						}
					)

					this.cacheManager.del("PASSWORD_" + body.verificationCode);

					return "reset";
				}
				else {
					return "error";
				}
			}
			else{
				return "same";
			}
		}
	}
}