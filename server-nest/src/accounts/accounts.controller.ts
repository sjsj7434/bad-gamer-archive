import { Param, Controller, Get, Post, Put, Delete, Body, Res, Req, Patch, Query } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountsDTO, DeleteAccountsDTO, UpdateAccountsDTO } from './accounts.dto';
import { Request, Response } from 'express';
import { Accounts } from './accounts.entity';
import { LostarkAPIService } from '../lostark/api/lostark.api.service';
import { UpdateResult } from 'typeorm';

@Controller("accounts")
export class  AccountsController {
	constructor(private accountsService: AccountsService, private apiService: LostarkAPIService) { }

	/**
	 * 마이페이지 > stove 계정 인증 코드 발급
	 */
	@Get("stove/verification/code")
	async createStoveVerificationCode(@Req() request: Request): Promise<string> {
		console.log("[AccountsController(Get) - accounts/stove/verification/code]");
		const stoveVerificationCode = await this.accountsService.createStoveVerificationCode(request);
		return stoveVerificationCode;
	}

	@Get("stove/verification/:method/:stoveURL")
	async executeStoveVerification(@Req() request: Request, @Param("method") method: string, @Param("stoveURL") stoveURL: string): Promise<[string, object]> {
		console.log("[AccountsController(Get) - accounts/stove/verification/:method/:stoveURL] => " + stoveURL);
		const stoveURLWithOutProtocol: string = stoveURL.replace(/https:\/\/|http:\/\//g, "");
		
		if(isNaN(Number(stoveURLWithOutProtocol)) === false){
			// const compareResult = await this.accountsService.compareStoveVerificationCode(request, stoveURLWithOutProtocol);
			const compareResult = true; //인증 테스트를 위해서 확인 절차 건너뛰는 중

			if (compareResult === true){
				if(method === "api"){ //공식 API 사용
					const characterName = await this.accountsService.getStoveUserCharacters_api(stoveURLWithOutProtocol);
					const characterNames = await this.apiService.getCharacterList(characterName); // { CharacterClassName: string, CharacterName: number, ItemAvgLevel: string, ItemMaxLevel: string, ServerName: string }

					return ["success", characterNames];
				}
				else if(method === "scrap"){ //전투정보실 웹 페이지 정보 스크랩
					const characterNames = await this.accountsService.getStoveUserCharacters_scrap(stoveURLWithOutProtocol);

					return ["success", characterNames];
				}
				else{
					return ["fail", []];
				}
			}
			else {
				return ["fail", []];
			}
		}
		else{
			return ["codeError", []];
		}
	}

	@Get("stove/character/scrap/:characterName")
	async getCharacterInfoScrap(@Req() request: Request, @Param("characterName") characterName: string): Promise<object> {
		console.log("[AccountsController(Get) - accounts/stove/character/scrap/:characterName] => " + characterName);
		
		const characterInfo: object = await this.accountsService.getCharacterInfo_scrap(characterName);

		return characterInfo;
	}

	@Post()
	async createAccount(@Body() createAccountsDTO: CreateAccountsDTO): Promise<number> {
		console.log("[AccountsController(Post) - accounts/] => ", createAccountsDTO);

		const result = await this.accountsService.createAccount(createAccountsDTO);

		return result;
	}

	@Delete()
	async deleteAccount(@Body() deleteAccountsDTO: DeleteAccountsDTO): Promise<string> {
		console.log("[AccountsController(Delete) - accounts/] => ", deleteAccountsDTO);

		const result = await this.accountsService.deleteAccount(deleteAccountsDTO);
		console.log(result);

		return "soft-delete";
	}

	@Put("lostark/character")
	async updateLostarkMainCharacter(@Req() request: Request, @Body() body: { lostarkMainCharacter: string }): Promise<string> {
		console.log("[AccountsController(Put) - accounts/lostark/character] => ", body);

		const result = await this.accountsService.updateLostarkMainCharacter(request, body);
		console.log(result);

		return "update lostark";
	}

	@Post("signin")
	async signInAccount(@Body() body: { id: string, password: string }, @Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<string> {
		console.log("[AccountsController(Post) - accounts/signin]");

		const cookieCheck = await this.accountsService.checkSignInStatus(request, response);

		if (cookieCheck.status === "empty") { //로그인을 시도하지 않은 상태
			const result = await this.accountsService.signInAccount(body, request, response);

			return result;
		}
		else {
			if (cookieCheck.status === "error") {
				return "fail";
			}
			else if (cookieCheck.status === "locked") {
				return "locked";
			}
			else if (cookieCheck.status === "banned") {
				return "banned";
			}
			else{
				return "already";
			}
		}
	}

	@Post("signout")
	async setSignOut(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
		console.log("[AccountsController(Post) - accounts/signout]");

		this.accountsService.setSignOut(request, response);
	}

	@Get("signin/status")
	async getSignInStatus(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<{ status: string, id: string, nickname: string }> {
		console.log("[AccountsController(Get) - accounts/signin/status]");

		const cookieCheck = await this.accountsService.checkSignInStatus(request, response);

		return cookieCheck;
	}

	@Get("information/my")
	async getMyInfo(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<Accounts> {
		console.log("[AccountsController(Get) - accounts/information/my]");

		const accountData = await this.accountsService.getMyInfo(request, response);

		return accountData;
	}

	@Patch("password")
	async updatePassword(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() body: { oldPassword: string, newPassword: string }): Promise<number> {
		console.log("[AccountsController(Patch) - accounts/password]");

		const updateResult = await this.accountsService.updatePassword(request, response, body);

		return updateResult;
	}

	/*
	@Post("verify/send/email")
	async setVerifyEmailTokenLater(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<string> {
		console.log("[AccountsController(Post) - accounts/verify/send/email]");

		const verifyResult = await this.accountsService.setVerifyEmailTokenLater(request);

		return verifyResult;
	}

	@Get("verify/email/:verificationCode")
	async verifyEmail(@Param("verificationCode") verificationCode: string): Promise<boolean> {
		console.log("[AccountsController(Get) - accounts/verify/email/:verificationCode]", verificationCode);

		const verifyResult = await this.accountsService.verifyEmail(verificationCode);

		return verifyResult;
	}
	*/

	@Post("reset/password/request")
	async requestResetPassword(@Body() body: { id: string }): Promise<string> {
		console.log("[AccountsController(Post) - accounts/reset/password/request]");

		const verifyResult = await this.accountsService.beforeResetPassword(body);

		return verifyResult;
	}

	@Post("verify/reset/password/code")
	async checkResetEmail(@Body() body: { verificationCode: string }): Promise<string> {
		console.log("[AccountsController(Post) - accounts/verify/reset/password/code]", body);

		const verifyResult = await this.accountsService.checkResetEmail(body.verificationCode);

		return verifyResult;
	}

	@Patch("reset/password/execute")
	async resetPassword(@Body() body: { newPassword: string, verificationCode: string }): Promise<string> {
		console.log("[AccountsController(Patch) - accounts/reset/password/execute]", body);

		const verifyResult = await this.accountsService.resetPassword(body);

		return verifyResult;
	}

	@Patch("nickname")
	async updateNickname(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() body: { nickname: string, password: string }): Promise<Boolean> {
		console.log("[AccountsController(Patch) - accounts/nickname]");

		const updateResult = await this.accountsService.updateNickname(request, response, body);

		return updateResult;
	}
}