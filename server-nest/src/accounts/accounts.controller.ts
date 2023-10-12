import { Param, Controller, Get, Post, Put, Delete, Body, Res, Req, Patch, NotFoundException } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountsDTO, DeleteAccountsDTO } from './accounts.dto';
import { Request, Response } from 'express';
import { Accounts } from './accounts.entity';
import { LostarkAPIService } from '../lostark/api/lostark.api.service';

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

	@Get("stove/character/scrap/:characterName")
	async getCharacterInfoScrap(@Param("characterName") characterName: string): Promise<object> {
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

	@Get("stove/verification/api/:stoveCode")
	async startAuthentication(@Req() request: Request, @Param("stoveCode") stoveCode: string): Promise<[string, object]> {
		console.log("[AccountsController(Get) - accounts/stove/verification/api/:stoveCode] => " + stoveCode);

		const result: [string, object] = await this.accountsService.startAuthentication(request, stoveCode);

		return result;
	}

	@Put("lostark/character")
	async updateLostarkCharacter(@Req() request: Request, @Body() body: { lostarkCharacter: string }): Promise<string> {
		console.log("[AccountsController(Put) - accounts/lostark/character] => ", body);

		const resultCode: string = await this.accountsService.updateLostarkCharacter(request, body);

		return resultCode;
	}

	@Put("lostark/character/refresh")
	async refreshLostarkCharacter(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<string> {
		console.log("[AccountsController(Put) - accounts/lostark/character/refresh]");

		const accountData = await this.accountsService.getMyInfo(request, response);

		if (accountData !== null) {
			const lostarkName: string = accountData.authentication.filter((element) => element.type === "lostark_name")[0].data;
			const stoveCode: string = accountData.authentication.filter((element) => element.type === "stove_code")[0].data;

			const lostarkCharacterData: any = await this.apiService.getCharacterInfoProfile(lostarkName);

			await this.accountsService.setCacheData("LOSTARK_" + request.cookies["sessionCode"], [lostarkCharacterData], 5 * 60); //캐릭터 데이터 cache에 저장
			await this.accountsService.setCacheData("STOVE_CODE_" + request.cookies["sessionCode"], stoveCode, 5 * 60); //스토브 코드 cache에 저장

			const resultCode: string = await this.accountsService.updateLostarkCharacter(request, { lostarkCharacter: lostarkName });

			return resultCode;
		}
		else{
			response.status(400);
		}
	}

	@Put("stove/verification/api/again")
	async restartAuthentication(@Req() request: Request): Promise<[string, object]> {
		console.log("[AccountsController(Get) - accounts/stove/verification/api/again]");

		const result: [string, object] = await this.accountsService.restartAuthentication(request);

		return result;
	}

	@Delete("lostark/character")
	async deactivateLostarkCharacter(@Req() request: Request): Promise<string> {
		console.log("[AccountsController(Delete) - accounts/lostark/character]");

		const result = await this.accountsService.deactivateLostarkCharacter(request);
		console.log(result);

		return "deactivate lostark";
	}

	@Post("lostark/character/exit")
	async exitLostarkAuthentication(@Req() request: Request): Promise<string> {
		console.log("[AccountsController(Post) - accounts/lostark/character/exit]");

		const result = await this.accountsService.exitLostarkAuthentication(request);
		console.log(result);

		return "exit lostark";
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
	async getMyInfo(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<Accounts | NotFoundException> {
		console.log("[AccountsController(Get) - accounts/information/my]");

		const accountData = await this.accountsService.getMyInfo(request, response);

		if (accountData === null){
			response.status(400);
		}

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