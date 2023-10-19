import { Param, Controller, Get, Post, Put, Delete, Body, Res, Req, Patch, NotFoundException } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountsDTO, DeleteAccountsDTO, UpdateAccountsDTO } from './accounts.dto';
import { Request, Response } from 'express';
import { Accounts } from './accounts.entity';
import { UpdateAuthenticationDTO } from './authentication.dto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@SkipThrottle()
@Controller("accounts")
export class  AccountsController {
	constructor(private accountsService: AccountsService) { }

	//마이페이지 > stove 계정 인증 코드 발급
	@Get("stove/verification/code")
	async createStoveVerificationCode(@Req() request: Request): Promise<string> {
		return await this.accountsService.createStoveVerificationCode(request);
	}

	@Get("stove/character/scrap/:characterName")
	async getCharacterInfoScrap(@Param("characterName") characterName: string): Promise<object> {
		return await this.accountsService.getCharacterInfo_scrap(characterName);
	}

	@Post()
	async createAccount(@Body() createAccountsDTO: CreateAccountsDTO): Promise<number> {
		return await this.accountsService.createAccount(createAccountsDTO);
	}

	@Delete()
	async deleteAccount(@Req() request: Request, @Res({ passthrough: true }) response: Response, deleteAccountsDTO: DeleteAccountsDTO) {
		await this.accountsService.deleteAccount(request, response, deleteAccountsDTO);
	}

	//스토브 로아 캐릭터 인증
	@SkipThrottle({ default: false })
	@Throttle({ default: { limit: 10, ttl: 60000 } }) //1분에 10개 이상 금지
	@Get("stove/verification/api/:stoveCode")
	async authenticateStove(@Req() request: Request, @Param("stoveCode") stoveCode: string): Promise<{ result: string, characterList: object }> {
		return await this.accountsService.authenticateStove(request, stoveCode);
	}

	@SkipThrottle({ default: false })
	@Throttle({ default: { limit: 10, ttl: 60000 } }) //1분에 10개 이상 금지
	@Put("lostark/character/set")
	async setLostarkCharacter(@Req() request: Request, @Body() updateAuthenticationDTO: UpdateAuthenticationDTO): Promise<string> {
		return await this.accountsService.setLostarkCharacter(request, updateAuthenticationDTO.data);
	}

	@SkipThrottle({ default: false })
	@Throttle({ default: { limit: 10, ttl: 60000 } }) //1분에 10개 이상 금지
	@Put("lostark/character/change")
	async changeLostarkChatacter(@Req() request: Request): Promise<{ result: string, characterList: object }> {
		return await this.accountsService.changeLostarkChatacter(request);
	}

	//인증된 로아 캐릭터 정보 업데이트
	@SkipThrottle({ default: false })
	@Throttle({ default: { limit: 10, ttl: 60000 } }) //1분에 10개 이상 금지
	@Put("lostark/character/renew")
	async renewLostarkChatacter(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<string> {
		return await this.accountsService.renewLostarkChatacter(request, response);
	}

	@SkipThrottle({ default: false })
	@Throttle({ default: { limit: 10, ttl: 60000 } }) //1분에 10개 이상 금지
	@Post("lostark/character/exit")
	async exitLostarkChatacter(@Req() request: Request) {
		await this.accountsService.exitLostarkChatacter(request);
	}

	//로스트아크 캐릭터 인증 해제
	@Delete("lostark/character")
	async deactivateLostarkCharacter(@Req() request: Request): Promise<boolean> {
		return await this.accountsService.deactivateLostarkCharacter(request);
	}

	@SkipThrottle({ default: false })
	@Throttle({ default: { limit: 20, ttl: 60000 } }) //1분에 20개 이상 금지
	@Post("login")
	async loginAccount(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() updateAccountsDTO: UpdateAccountsDTO): Promise<string> {
		return await this.accountsService.loginAccount(updateAccountsDTO, request, response);
	}

	@Post("logout")
	async logoutAccount(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
		this.accountsService.logoutAccount(request, response);
	}

	@Get("login/status")
	async checkLoginStatus(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<{ status: string, id: string, nickname: string }> {
		return await this.accountsService.checkLoginStatus(request, response);
	}
	
	@Get("information/my")
	async getMyInfo(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<Accounts | NotFoundException> {
		return await this.accountsService.getMyInfo(request, response);
	}

	@Patch("password")
	async updatePassword(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() updateAccountsDTO: UpdateAccountsDTO): Promise<number> {
		return await this.accountsService.updatePassword(request, response, updateAccountsDTO);
	}

	@Post("reset/password/request")
	async requestResetPassword(@Body() updateAccountsDTO: UpdateAccountsDTO): Promise<string> {
		return await this.accountsService.beforeResetPassword(updateAccountsDTO);
	}

	//비밀번호 잊어버린 사용자, 이메일로 전달받은 코드 확인
	@Get("verify/reset/password/:verificationCode")
	async checkPasswordForgotCode(@Body() updateAccountsDTO: UpdateAccountsDTO, @Param("verificationCode") verificationCode: string): Promise<string> {
		return await this.accountsService.checkPasswordForgotCode(updateAccountsDTO, verificationCode);
	}

	@Patch("reset/password/execute")
	async resetPassword(@Body() updateAccountsDTO: UpdateAccountsDTO): Promise<string> {
		return await this.accountsService.resetPassword(updateAccountsDTO);
	}

	@Patch("nickname")
	async updateNickname(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() updateAccountsDTO: UpdateAccountsDTO): Promise<Boolean> {
		return await this.accountsService.updateNickname(request, response, updateAccountsDTO);
	}

	/*
	@Post("verify/send/email")
	async setVerifyEmailTokenLater(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<string> {
		return await this.accountsService.setVerifyEmailTokenLater(request);
	}

	@Get("verify/email/:verificationCode")
	async verifyEmail(@Param("verificationCode") verificationCode: string): Promise<boolean> {
		return await this.accountsService.verifyEmail(verificationCode);
	}
	*/
}