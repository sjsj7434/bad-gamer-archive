import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, In, IsNull, Not, Repository } from 'typeorm';
import { Accounts } from './accounts.entity';
import { CreateAccountsDTO, UpdateAccountsDTO } from './accounts.dto';
import { randomBytes } from 'crypto';
import puppeteer from 'puppeteer';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { Authentication } from './authentication.entity';
import { LostarkAPIService } from 'src/lostark/api/lostark.api.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ErrorLogService } from 'src/log/error.log.service';
import { LostarkCharacter } from './lostarkCharacter';

@Injectable()
export class AccountsService {
	constructor(
		@InjectRepository(Accounts) private accountsRepository: Repository<Accounts>,
		@InjectRepository(Authentication) private authenticationRepository: Repository<Authentication>,
		@InjectRepository(LostarkCharacter) private lostarkCharacterRepository: Repository<LostarkCharacter>,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
		private lostarkAPIService: LostarkAPIService,
		private errorLogService: ErrorLogService,
	) { }

	private LOGIN_FAIL_LIMIT: number = 5; //로그인 최대 실패
	private LOGIN_SESSION: Map<string, string> = new Map(); //로그인 세션
	private LOGIN_COOKIE_TTL: number = 1000 * 60 * 60 * 2; //로그인 쿠키 유지 기간 : 2 Hours
	private STOVE_CODE_TTL: number = 1000 * 60 * 3; //스토브 인증 코드 캐시 유지 기간 : 3 Minutes
	private EMAIL_CODE_TTL: number = 1000 * 60 * 60; //이메일 인증 코드 캐시 유지 기간 : 1 Hour

	public WHO_USE_API_TODAY: Map<string, Map<string, Date>> = new Map(); //오늘 누가 API를 사용하였는가

	//서울 시간 기준으로 [매일 00:00] 데이터 초기화
	//서울 시간 기준으로 [1분 마다] 데이터 초기화, 생각해보니 1분에 100번 제한이라 하루에 한번씩만 하도록 하지 않아도 될 듯
	@Cron(CronExpression.EVERY_MINUTE, {
		name: "resetCharacterUpdateCount",
		timeZone: "Asia/Seoul",
	})
	resetCharacterUpdateCount() {
		this.WHO_USE_API_TODAY.clear(); //초기화
		console.log("[resetCharacterUpdateCount] Reset data : " + new Date());
	}

	/**
	 * 해당 서비스를 사용했는지 안했는지 확인, 과도한 API 호출을 방지하기 위함
	 * @param userName 사용자
	 * @param serviceName 서비스 이름
	 * @returns 사용 여부
	 */
	isUseApiService(userName: string, serviceName: string): boolean {
		if (this.WHO_USE_API_TODAY.has(userName) === true) {
			const whatService = this.WHO_USE_API_TODAY.get(userName);

			return whatService.has(serviceName);
		}
		else {
			return false;
		}
	}

	/**
	 * WHO_USE_API_TODAY 객체에 이용한 API 서비스 이름 삽입
	 * @param request 요청
	 * @param serviceName 이용한 API
	 * @returns 성공적으로 완료되었다면 True, 실패했다면 False를 반환
	 */
	setUseApiService(userName: string, serviceName: string): boolean {
		if (userName === undefined || userName === null || userName === "") {
			return false;
		}

		if (this.WHO_USE_API_TODAY.has(userName) === true) {
			//이미 뭔가 사용함
			const whatService = this.WHO_USE_API_TODAY.get(userName);
			whatService.set(serviceName, new Date()); //API 이용자 추가
		}
		else {
			//처음
			const newService = new Map();
			newService.set(serviceName, new Date()) //API 이용자 추가
			this.WHO_USE_API_TODAY.set(userName, newService);
		}

		return true;
	}

	/**
	 * WHO_USE_API_TODAY 객체에 이용한 API 서비스 초기화
	 * @param request 요청
	 * @param serviceName 초기화 API
	 * @returns 성공적으로 완료되었다면 True, 실패했다면 False를 반환
	 */
	unsetUseApiService(userName: string, serviceName: string): boolean {
		if (userName === undefined || userName === null || userName === "") {
			return false;
		}

		if (this.WHO_USE_API_TODAY.has(userName) === true) {
			//이미 뭔가 사용함
			const whatService = this.WHO_USE_API_TODAY.get(userName);
			whatService.delete(serviceName); //서비스 이용 내역 초기화
		}

		return true;
	}

	/**
	 * 스토브 소개란에 적을 인증 코드(32글자)를 생성한다
	 */
	async createStoveVerificationCode(request: Request): Promise<string>{
		const stoveVerificationCode = randomBytes(16).toString("hex");
		await this.cacheManager.set("STOVE_" + request.cookies["sessionCode"], stoveVerificationCode, this.STOVE_CODE_TTL);

		return stoveVerificationCode;
	}

	/**
	 * 스토브 로아 캐릭터 인증
	 */
	async authenticateStove(request: Request, stoveCode: string): Promise<{ result: string, characterList: object }> {
		const sessionCode: string = request.cookies["sessionCode"]; //로그인한 세션의 코드 값
		const loginUUID = this.LOGIN_SESSION.get(sessionCode); //로그인한 정보
		const stoveCodeWithOutProtocol: string = stoveCode.replace(/https:\/\/|http:\/\//g, "");

		if (sessionCode === null || sessionCode === ""){
			return { result: "codeError", characterList: null };
		}

		if (isNaN(Number(stoveCodeWithOutProtocol)) === true) {
			return { result: "codeError", characterList: null };
		}

		const isExist = await this.authenticationRepository.exist({ //이미 인증된 계정으로는 다시 인증 불가능
			where: {
				type: Equal("stove_code"),
				data: Equal(stoveCodeWithOutProtocol),
			}
		});

		if (isExist === true){
			return { result: "already", characterList: null };
		}

		// const isMatched: boolean = await this.compareStoveVerificationCode(request, stoveCodeWithOutProtocol); //테스트 용으로 임시 비활성화
		const isMatched = true;

		if (isMatched) {
			const characterName = await this.getCharacterName(stoveCode); //web page scrapping

			if (characterName === "") {
				return { result: "codeError", characterList: null };
			}

			const characterNameArray = await this.lostarkAPIService.getCharacterList(characterName); //api 호출

			// for (let index = 0; index < characterNameArray.length; index++) {
			// 	const element = characterNameArray[index];

			// 	await this.lostarkCharacterRepository.upsert(
			// 		[{
			// 			uuid: loginUUID,
			// 			stoveCode: stoveCode,
			// 			serverName: element.ServerName,
			// 			characterName: element.CharacterName,
			// 			characterClass: element.CharacterClassName,
			// 			characterLevel: element.CharacterLevel,
			// 			maxItemLevel: element.ItemMaxLevel,
			// 			avgItemLevel: element.ItemAvgLevel,
			// 		}],
			// 		["uuid", "stoveCode"]
			// 	);
			// }

			await this.setCacheData("LOSTARK_" + request.cookies["sessionCode"], characterNameArray, 5 * 60); //캐릭터 데이터 cache에 저장
			await this.setCacheData("STOVE_CODE_" + request.cookies["sessionCode"], stoveCode, 5 * 60); //스토브 코드 cache에 저장

			if (characterNameArray === null) {
				return { result: "limit", characterList: null };
			}
			else {
				return { result: "success", characterList: characterNameArray };
			}
		}
		else {
			return { result: "fail", characterList: null };
		}
	}

	/**
	 * 이미 인증한 계정만 가능한 간편 스토브 로아 캐릭터 인증
	 */
	async changeLostarkChatacter(request: Request): Promise<{ result: string, characterList: object }> {
		// let hello = await this.authenticationRepository.query("SELECT ? AS TEST", ["dd"]);
		// console.log(hello);
		const loginUUID = this.LOGIN_SESSION.get(request.cookies["sessionCode"]); //로그인한 정보

		if (loginUUID === null || loginUUID === undefined) {
			return { result: "fail", characterList: null };
		}

		const isUsed: boolean = this.isUseApiService(loginUUID, "change-lostark-character");//cached data 확인해서 이미 진행했으면 튕김
		if (isUsed === true) {
			return { result: "wait", characterList: null };
		}
		
		const authenticationData = await this.authenticationRepository.findOne({
			select: {
				data: true,
			},
			where: {
				uuid: Equal(loginUUID),
				type: Equal("stove_code"),
			}
		});

		if (authenticationData === null) {
			return { result: "fail", characterList: null };
		}

		const characterName = await this.getCharacterName(authenticationData.data); //web page scrapping

		if (characterName === "") {
			return { result: "codeError", characterList: null };
		}

		const characterList = await this.lostarkAPIService.getCharacterList(characterName); //api 호출

		await this.setCacheData("LOSTARK_" + request.cookies["sessionCode"], characterList, 5 * 60); //캐릭터 데이터 cache에 저장
		await this.setCacheData("STOVE_CODE_" + request.cookies["sessionCode"], authenticationData.data, 5 * 60); //스토브 코드 cache에 저장

		if (characterList === null) {
			return { result: "limit", characterList: null };
		}
		else {
			this.setUseApiService(loginUUID, "change-lostark-character");//cached data 확인해서 이미 진행했으면 튕김
			return { result: "success", characterList: characterList };
		}
	}

	/**
	 * 스토브 소개란에 적힌 인증 코드를 가져와 비교한다
	 */
	async compareStoveVerificationCode(request: Request, stoveCode: string): Promise<boolean>{
		const stoveCodeWithOutProtocol: string = stoveCode.replace(/https:\/\/|http:\/\//g, "");

		const browser = await puppeteer.launch({
			headless: true,
			waitForInitialPage: false,
		});

		const page = await browser.newPage();
		// await page.setViewport({width: 1920, height: 1080}); //화면 크기 설정, headless: false 여야 확인 가능
		
		await page.goto(`https://timeline.onstove.com/${stoveCodeWithOutProtocol}`, {waitUntil: "networkidle2"});
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
	async getCharacterName(stoveCode: string): Promise<string> {
		try {
			const stoveCodeWithOutProtocol: string = stoveCode.replace(/https:\/\/|http:\/\//g, "");

			const browser = await puppeteer.launch({
				headless: true,
				waitForInitialPage: false,
			});
			const page = await browser.newPage();
			// await page.setViewport({width: 1920, height: 1080}); //화면 크기 설정, headless: false 여야 확인 가능
			await page.goto(`https://lostark.game.onstove.com/Board/GetExpandInfo?memberNo=${stoveCodeWithOutProtocol}`, { timeout: 10000, waitUntil: "networkidle2" });

			const pageTarget = page.target(); //save this to know that this was the opener
			await page.click("body > div.profile-library > div.profile-link > a.button.button--black"); //click on a link
			const newTarget = await browser.waitForTarget(target => target.opener() === pageTarget); //check that you opened this page, rather than just checking the url
			const newPage = await newTarget.page(); //get the page object
			await newPage.waitForSelector("body"); //wait for page to be loaded

			const targetElement = await newPage.$("#lostark-wrapper > div > main > div > div.profile-character-info > span.profile-character-info__name");

			const characterName = await newPage.evaluate((data) => {
				if (data === null || data === undefined){
					return "";
				}
				else{
					return data.getAttribute("title");
				}
			}, targetElement);

			browser.close(); //창 종료

			return characterName;
		}
		catch (error) {
			console.error(error);
		}
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
					uuid: Equal(randomString),
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
	 * 이미 존재하는 id인지 확인
	 */
	isExistsID(accountID: string): Promise<boolean> {
		return this.accountsRepository.exist({
			where: {
				id: Equal(accountID),
			},
			// withDeleted: true, //에러 로그 쌓이는 것 테스트 중
		});
	}

	/**
	 * 이미 존재하는 nickname인지 확인
	 */
	isExistsNickname(accountNickname: string): Promise<boolean> {
		return this.accountsRepository.exist({
			where: {
				nickname: Equal(accountNickname),
			},
			withDeleted: true,
		});
	}

	/**
	 * 중복되는 정보가 있는지 확인 후 계정을 생성한다
	 */
	async createAccount(createAccountsDTO: CreateAccountsDTO): Promise<number> {
		try {
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
		catch (error) {
			// console.error(error);
			this.errorLogService.createErrorLog(error);
		}
	}

	/**
	 * code에 맞는 계정을 삭제(논리 삭제)
	 * find > 정보 수정 > softDelete 처리
	 */
	async deleteAccount(request: Request, response: Response): Promise<boolean> {
		const loginUUID = this.LOGIN_SESSION.get(request.cookies["sessionCode"]); //로그인한 정보

		const isExists: boolean = await this.accountsRepository.exist({
			where: {
				uuid: Equal(loginUUID)
			}
		});

		if (isExists === true){
			await this.accountsRepository.softDelete({ //계정 정보는 soft delete
				uuid: loginUUID,
			});

			await this.authenticationRepository.softDelete({ //인증 정보는 soft delete
				uuid: loginUUID,
			});
		}

		return isExists;
	}

	/**
	 * 중복 로그인 방지, 이미 해당 계정으로 로그인한 사람이 있는지 확인
	 * 
	 * empty: 로그인을 시도하지 않은 상태
	 * locked: 잠금 상태
	 * banned: 밴 상태
	 * login: 정상적인 상태
	 * error: 오류
	 */
	async checkLoginStatus(request: Request, response: Response): Promise<{ status: string, id: string, nickname: string }> {
		if (request.cookies["sessionCode"] === undefined) { //로그인을 시도하지 않은 상태
			return {
				status: "empty",
				id: "",
				nickname: "",
			}
		}
		else if (this.LOGIN_SESSION.has(request.cookies["sessionCode"]) === true) { //정상적으로 로그인한 쿠키가 있다
			const loginUUID = this.LOGIN_SESSION.get(request.cookies["sessionCode"]); //로그인한 정보

			const account = await this.accountsRepository.findOne({
				select: {
					id: true,
					nickname: true,
					isLocked: true,
					isBanned: true,
				},
				where: {
					uuid: Equal(loginUUID),
				},
			});

			if (account === null) { //확인해보니 로그인 쿠키 정보와 맞는 계정이 DB에 없다
				this.logoutAccount(request, response);

				return {
					status: "error",
					id: "",
					nickname: "",
				}
			}
			else if (account.isLocked === true) { //확인해보니 해당 계정이 잠금 상태
				this.logoutAccount(request, response);

				return {
					status: "locked",
					id: "",
					nickname: "",
				}
			}
			else if (account.isBanned === true) { //확인해보니 해당 계정이 밴 상태
				this.logoutAccount(request, response);

				return {
					status: "banned",
					id: "",
					nickname: "",
				}
			}
			else{ //정상적인 상태
				response.cookie("sessionCode", request.cookies["sessionCode"], { maxAge: this.LOGIN_COOKIE_TTL, httpOnly: true }); //expire 갱신 / secure: true 옵션은 http일 때에는 사용할 수 없다, 사용하면 쿠키가 생성되지 않게 됨

				return {
					status: "login",
					id: account.id,
					nickname: account.nickname,
				}
			}
		}
		else { //로그인 쿠키는 있지만 서버에서 확인할 수 없는 쿠키
			this.logoutAccount(request, response);

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
	async loginAccount(updateAccountsDTO: UpdateAccountsDTO, request: Request, response: Response): Promise<string> {
		response.clearCookie("sessionCode");

		const account = await this.accountsRepository.findOne({
			select: {
				uuid: true,
				password: true,
				loginFailCount: true,
				isBanned: true,
				isLocked: true,
				isSleep: true,
			},
			where: {
				id: Equal(updateAccountsDTO.id),
			}
		});

		if (account === null){ //로그인하려는 계정이 존재하지 않음
			return "fail";
		}
		else if (account.isBanned === true){
			return "banned";
		}
		else if (account.isLocked === true) {
			return "locked";
		}
		else{
			const isMatch: boolean = await bcrypt.compare(updateAccountsDTO.password, account.password);

			if (isMatch === false) { //로그인 실패
				const failCount = account.loginFailCount + 1; //로그인 실패 횟수 + 1

				await this.accountsRepository.update(
					{ //조건
						uuid: account.uuid,
					},
					{ //변경 값
						loginFailIP: request.ip,
						loginFailCount: failCount,
						isLocked: (failCount >= this.LOGIN_FAIL_LIMIT), //실패 제한에 걸리면 계정 잠금 처리
					},
				);

				if (failCount === (this.LOGIN_FAIL_LIMIT - 1)){
					return "fail_limit"; //한번 더 실패할 경우 계정이 잠깁니다, 비밀번호 찾기로 잠김 해제 가능
				}
				else if (failCount >= this.LOGIN_FAIL_LIMIT) {
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

					this.setLoginCookie(account, request, response);

					return "success";
				}
			}
		}
	}

	/**
	 * 로그인 시 Cookie 설정
	 */
	setLoginCookie(account: Accounts, request: Request, response: Response) {
		const saltRounds: number = 15;
		const sessionCode: string = bcrypt.genSaltSync(saltRounds);

		for (const sessionData of this.LOGIN_SESSION) {
			if (account.uuid === sessionData[1]) { //같은 uuid 세션이 존재하면
				this.LOGIN_SESSION.delete(sessionData[0]); //해당 세션을 삭제
				break;
			}
		}

		if (this.LOGIN_SESSION.has(request.cookies["sessionCode"]) === true) { //초기화
			this.LOGIN_SESSION.delete(request.cookies["sessionCode"]);
		}

		if (request.cookies["sessionCode"] !== undefined) { //초기화
			response.clearCookie("sessionCode");
		}

		this.LOGIN_SESSION.set(sessionCode, account.uuid);

		response.cookie("sessionCode", sessionCode, { maxAge: this.LOGIN_COOKIE_TTL, httpOnly: true }); //secure: true 옵션은 http일 때에는 사용할 수 없다, 사용하면 쿠키가 생성되지 않게 됨
	}

	/**
	 * 로그아웃 Cookie 설정
	 */
	logoutAccount(request: Request, response: Response) {
		if (this.LOGIN_SESSION.has(request.cookies["sessionCode"]) === true) {
			this.LOGIN_SESSION.delete(request.cookies["sessionCode"]); //서버의 로그인 데이터에서 삭제
		}

		if (request.cookies["sessionCode"] !== undefined) {
			response.clearCookie("sessionCode"); //사용자의 쿠키 값 삭제
		}
	}

	/**
	 * 내 정보 가져오기
	 */
	async getMyInfo(request: Request, response: Response): Promise<Accounts> {
		const loginUUID = this.LOGIN_SESSION.get(request.cookies["sessionCode"]); //로그인한 정보

		if (loginUUID === null || loginUUID === undefined){
			return null;
		}

		const acctountData = await this.accountsRepository.findOne({
			relations: ["authentication"], //사용자 인증 정보 join
			select: {
				authentication: { type: true, data: true, createdAt: true, updatedAt: true },
				code: true,
				id: true,
				nickname: true,
				email: true,
				exp: true,
				evolution: true,
				passwordChangeDate: true,
				createdAt: true,
			},
			where: [
				{
					uuid: Equal(loginUUID),
					authentication: { type: In(["lostark_character_level", "lostark_item_level", "lostark_name", "lostark_server", "stove_code"]) },
				},
				{
					uuid: Equal(loginUUID),
					authentication: { type: IsNull() }
				},
			],
		});

		return acctountData;
	}

	/**
	 * 비밀번호 변경
	 */
	async updatePassword(request: Request, response: Response, updateAccountsDTO: UpdateAccountsDTO): Promise<number> {
		const loginUUID = this.LOGIN_SESSION.get(request.cookies["sessionCode"]); //로그인한 정보

		const acctountData = await this.accountsRepository.findOne({
			select: {
				id: true,
				password: true,
			},
			where: {
				uuid: Equal(loginUUID),
			}
		});

		if (acctountData !== null){
			const isMatch: boolean = await bcrypt.compare(updateAccountsDTO.oldPassword, acctountData.password);

			if (updateAccountsDTO.oldPassword === updateAccountsDTO.newPassword) {
				return 0;
			}
			else if (isMatch === true) {
				const saltRounds: number = 10;
				const password: string = updateAccountsDTO.newPassword;
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

					this.logoutAccount(request, response);
					
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
	async updateNickname(request: Request, response: Response, updateAccountsDTO: UpdateAccountsDTO): Promise<Boolean> {
		const loginUUID = this.LOGIN_SESSION.get(request.cookies["sessionCode"]); //로그인한 정보

		const nicknameExists: boolean = await this.isExistsNickname(updateAccountsDTO.nickname);

		if (nicknameExists === true){
			return false;
		}

		const acctountData = await this.accountsRepository.findOne({
			select: {
				id: true,
				password: true,
			},
			where: {
				uuid: Equal(loginUUID),
			}
		});

		if (acctountData !== null) {
			const isMatch: boolean = await bcrypt.compare(updateAccountsDTO.password, acctountData.password);

			if (isMatch === true) {
				await this.accountsRepository.update(
					{ //조건
						id: acctountData.id
					},
					{ //변경 값
						nickname: updateAccountsDTO.nickname,
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
	 * 로스트아크 캐릭터 인증
	 */
	async setLostarkCharacter(request: Request, lostarkName: string): Promise<string> {
		//받아온 캐릭터 정보 저장해놓고, 다시 넘어온 것 비교해서 위조 확인
		const sessionCode: string = request.cookies["sessionCode"]; //로그인한 세션의 코드 값
		const loginUUID = this.LOGIN_SESSION.get(sessionCode); //로그인한 정보
		const characterList: [any] = await this.cacheManager.get("LOSTARK_" + sessionCode);
		const stoveCode: string = await this.cacheManager.get("STOVE_CODE_" + sessionCode);

		if (typeof characterList !== "object") {
			return "0002";
		}

		let isContain: boolean = false;
		let infoIndex: number = 0;

		for (let index = 0; index < characterList.length; index++) {
			const element = characterList[index];

			// await this.lostarkCharacterRepository.upsert(
			// 	[{
			// 		uuid: loginUUID,
			// 		stoveCode: stoveCode,
			// 		serverName: element.ServerName,
			// 		characterName: element.CharacterName,
			// 		characterClass: element.CharacterClassName,
			// 		characterLevel: element.CharacterLevel,
			// 		maxItemLevel: element.ItemMaxLevel,
			// 		avgItemLevel: element.ItemAvgLevel,
			// 	}],
			// 	["uuid", "stoveCode"]
			// );

			if (element.CharacterName === lostarkName){
				isContain = true;
				infoIndex = index;
				break;
			}
		}

		if (isContain === true) {
			//다시 인증을 진행하면 이전에 인증 해제한 데이터 완전 삭제 처리
			await this.authenticationRepository.delete({
				uuid: loginUUID,
				type: In(["lostark_name", "lostark_item_level", "lostark_server", "lostark_character_level", "stove_code"]),
				deletedAt: Not(IsNull()),
			});

			let simpleItemLevel = characterList[infoIndex].ItemMaxLevel.replace(",", "").split(".")[0];
			simpleItemLevel = simpleItemLevel.slice(0, simpleItemLevel.length -1) + "0+"; //끝자리 0으로 변경

			await this.authenticationRepository.upsert(
				[
					{ uuid: loginUUID, type: "stove_code", data: stoveCode },
					{ uuid: loginUUID, type: "lostark_name", data: characterList[infoIndex].CharacterName },
					{ uuid: loginUUID, type: "lostark_character_level", data: characterList[infoIndex].CharacterLevel },
					{ uuid: loginUUID, type: "lostark_item_level", data: simpleItemLevel },
					{ uuid: loginUUID, type: "lostark_server", data: characterList[infoIndex].ServerName },
				],
				["uuid", "type"]
			);

			await this.cacheManager.del("LOSTARK_" + sessionCode);
			await this.cacheManager.del("STOVE_CODE_" + sessionCode);

			return "0001";
		}
		else{
			return "0003";
		}
	}

	/**
	 * 로스트아크 캐릭터 인증 해제
	 */
	async deactivateLostarkCharacter(request: Request): Promise<boolean> {
		const loginUUID = this.LOGIN_SESSION.get(request.cookies["sessionCode"]);

		const isExists: boolean = await this.authenticationRepository.exist({
			where: {
				uuid: Equal(loginUUID),
				type: In(["lostark_name", "lostark_item_level", "lostark_server", "lostark_character_level", "stove_code"]),
				deletedAt: IsNull(),
			}
		});

		if (isExists === true){
			//다시 인증을 진행하지 않으면 데이터는 완전 삭제되지 않음
			await this.authenticationRepository.softDelete({
				uuid: Equal(loginUUID),
				type: In(["lostark_name", "lostark_item_level", "lostark_server", "lostark_character_level", "stove_code"]),
				deletedAt: IsNull(),
			});

			this.unsetUseApiService(loginUUID, "change-lostark-character");
			this.unsetUseApiService(loginUUID, "renew-lostark-character");
		}

		return isExists;
	}

	/**
	 * 로스트아크 캐릭터 인증하지 않고 종료할 때 캐시 데이터 삭제
	 */
	async exitLostarkChatacter(request: Request) {
		const sessionCode = request.cookies["sessionCode"];
		
		await this.cacheManager.del("LOSTARK_" + sessionCode);
		await this.cacheManager.del("STOVE_CODE_" + sessionCode);
	}

	/**
	 * 비밀번호를 잊어버려 비밀번호 초기화하기 전 확인
	 */
	async beforeResetPassword(updateAccountsDTO: UpdateAccountsDTO): Promise<string> {
		const account = await this.accountsRepository.findOne({
			select: {
				uuid: true
			},
			where: {
				id: Equal(updateAccountsDTO.id),
				isBanned: Equal(false),
			},
		});

		if (account === null){
			return "no_user";
		}
		else {
			const verificationCode = randomBytes(16).toString("hex");
			await this.cacheManager.set("PASSWORD_" + verificationCode, account.uuid, this.EMAIL_CODE_TTL);
			console.log(`http://localhost:3001/accounts/reset/password/${verificationCode}`);

			return "email_sent";
		}
	}

	/**
	 * 비밀번호 잊어버린 사용자, 이메일로 전달받은 코드 확인
	 */
	async checkPasswordForgotCode(updateAccountsDTO: UpdateAccountsDTO, verificationCode: string): Promise<string> {
		updateAccountsDTO.verificationCode = verificationCode;

		const uuid: string = await this.cacheManager.get("PASSWORD_" + updateAccountsDTO.verificationCode);

		if (uuid === undefined){
			return "error";
		}
		else{
			const account = await this.accountsRepository.findOne({
				select: {
					uuid: true
				},
				where: {
					uuid: Equal(uuid),
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
	async resetPassword(updateAccountsDTO: UpdateAccountsDTO): Promise<string> {
		const uuid: string = await this.cacheManager.get("PASSWORD_" + updateAccountsDTO.verificationCode);

		if (uuid === undefined) {
			return "no_user";
		}
		else {
			const saltRounds: number = 10;
			const password: string = updateAccountsDTO.newPassword;
			const encryptSalt: string = await bcrypt.genSalt(saltRounds);

			const account = await this.accountsRepository.findOne({
				select: {
					password: true
				},
				where: {
					uuid: Equal(uuid),
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

					this.cacheManager.del("PASSWORD_" + updateAccountsDTO.verificationCode);

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

	/**
	 * 캐시 데이터 설정
	 * @param cacheName 캐시 이름
	 * @param cacheValue 캐시 값
	 * @param cacheLiveSeconds TTL 초
	 * @returns 정상 처리인가 아닌가
	 */
	async setCacheData(cacheName: string, cacheValue: any, cacheLiveSeconds: number): Promise<Boolean> {
		if (cacheName === "" || cacheName === undefined || cacheName === null) {
			return false;
		}
		else if (cacheValue === undefined) {
			return false;
		}
		else if (cacheLiveSeconds === null || cacheLiveSeconds === undefined || cacheLiveSeconds < 0) {
			return false;
		}

		let cacheTTL: number = 1000 * cacheLiveSeconds;

		await this.cacheManager.set(cacheName, cacheValue, cacheTTL);

		return true;
	}

	/**
	 * 캐시 데이터 가져오기
	 * @param cacheName 캐시 이름
	 * @returns 가져온 값(any)
	 */
	async getCacheData(cacheName: string): Promise<any> {
		if (cacheName === "" || cacheName === undefined || cacheName === null) {
			return null;
		}

		return await this.cacheManager.get(cacheName);
	}

	/**
	 * 쿠키 설정
	 * @param response Response
	 * @param cookieName 쿠키 이름
	 * @param cookieValue 쿠키 값
	 * @param cookieLiveSeconds 쿠키 만료 시간
	 * @returns 정상 처리인가 아닌가
	 */
	async setCookieData(response: Response, cookieName: string, cookieValue: string, cookieLiveSeconds: number): Promise<Boolean> {
		if (cookieName === "" || cookieName === undefined || cookieName === null) {
			return false;
		}
		else if (cookieValue === undefined) {
			return false;
		}
		else if (cookieLiveSeconds === null || cookieLiveSeconds === undefined || cookieLiveSeconds < 0) {
			return false;
		}

		let cacheTTL: number = 1000 * cookieLiveSeconds;

		response.cookie(cookieName, cookieValue, { maxAge: cacheTTL, httpOnly: true }); //secure: true 옵션은 http일 때에는 사용할 수 없다, 사용하면 쿠키가 생성되지 않게 됨

		return true;
	}

	async renewLostarkChatacter(request: Request, response: Response): Promise<string> {
		const loginUUID = this.LOGIN_SESSION.get(request.cookies["sessionCode"]); //로그인한 정보
		const accountData = await this.getMyInfo(request, response);
		
		if (accountData !== null) {
			const isUsed: boolean = this.isUseApiService(loginUUID, "renew-lostark-character");//cached data 확인해서 이미 진행했으면 튕김
			if (isUsed === true) {
				return "0004";
			}

			const lostarkName: string = accountData.authentication.filter((element) => element.type === "lostark_name")[0].data;
			const stoveCode: string = accountData.authentication.filter((element) => element.type === "stove_code")[0].data;

			const lostarkCharacterData: any = await this.lostarkAPIService.getCharacterInfoProfile(lostarkName);

			await this.setCacheData("LOSTARK_" + request.cookies["sessionCode"], [lostarkCharacterData], 5 * 60); //캐릭터 데이터 cache에 저장
			await this.setCacheData("STOVE_CODE_" + request.cookies["sessionCode"], stoveCode, 5 * 60); //스토브 코드 cache에 저장

			const resultCode: string = await this.setLostarkCharacter(request, lostarkName);

			this.setUseApiService(loginUUID, "renew-lostark-character");//cached data 확인해서 이미 진행했으면 튕김

			return resultCode;
		}
		else {
			return "0004";
		}
	}

	/**
	 * 유저 경험치 갱신
	 * 경험치가 42억을 넘을 일이 생기면 진화시켜버리기
	 */
	async updateAccountExp(request: Request, response: Response, direction: string, expPoint: number) {
		// const loginUUID = this.LOGIN_SESSION.get(request.cookies["sessionCode"]); //로그인한 정보
		const UNSIGNED_INT_MAX: number = 4294967295;
		const accountData = await this.getMyInfo(request, response);
		let accountEXP: number = accountData.exp;

		if (direction === "down"){
			expPoint = expPoint * (-1);
		}

		if (accountEXP + expPoint >= 0) { //unsigned int 최소 값 보다 작을 경우
			// this.accountsRepository.increment({ uuid: Equal(loginUUID) }, "exp", expPoint);
			accountEXP += expPoint;

			if (accountEXP >= UNSIGNED_INT_MAX){
				if (accountData.evolution < 32767){ //smallint 최대 값
					accountData.evolution += 1; //진화
					accountData.exp = (accountEXP - UNSIGNED_INT_MAX); //경험치 0으로 초기화
				}
			}
			else{
				accountData.exp = accountEXP;
			}
		}
		else{
			accountData.exp = 0; //0보다 낮아지면 경험치 0으로 초기화
		}

		this.accountsRepository.save(accountData);
	}
}