import { Param, Controller, Get, Post, Put, Delete, Body, Res, Req, Patch, NotFoundException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDTO, UpdateAccountDTO } from './account.dto';
import { Request, Response } from 'express';
import { Account } from './account.entity';
import { UpdateAuthenticationDTO } from './authentication.dto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { CreatePersonalBlackListDTO, DeletePersonalBlackListDTO, UpdatePersonalBlackListDTO } from './personalBlackList.dto';
import { PersonalBlackList } from './personalBlackList.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@SkipThrottle()
@Controller("account")
export class  AccountController {
	constructor(private accountService: AccountService) { }

	//마이페이지 > stove 계정 인증 코드 발급
	@Get("stove/verification/code")
	async createStoveVerificationCode(@Req() request: Request): Promise<string> {
		return await this.accountService.createStoveVerificationCode(request);
	}

	@Get("stove/character/scrap/:characterName")
	async getCharacterInfoScrap(@Param("characterName") characterName: string): Promise<object> {
		return await this.accountService.getCharacterInfo_scrap(characterName);
	}

	@Post()
	async createAccount(@Body() createAccountDTO: CreateAccountDTO): Promise<number> {
		return await this.accountService.createAccount(createAccountDTO);
	}

	@Delete()
	async deleteAccount(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<boolean> {
		return await this.accountService.deleteAccount(request, response);
	}

	//스토브 로아 캐릭터 인증
	@SkipThrottle({ default: false })
	@Throttle({ default: { limit: 10, ttl: 60000 } }) //1분에 10개 이상 금지
	@Get("stove/verification/api/:stoveCode")
	async authenticateStove(@Req() request: Request, @Param("stoveCode") stoveCode: string): Promise<{ result: string, characterList: object }> {
		return await this.accountService.authenticateStove(request, stoveCode);
	}

	@SkipThrottle({ default: false })
	@Throttle({ default: { limit: 10, ttl: 60000 } }) //1분에 10개 이상 금지
	@Put("lostark/character/set")
	async setLostarkCharacter(@Req() request: Request, @Body() updateAuthenticationDTO: UpdateAuthenticationDTO): Promise<string> {
		return await this.accountService.setLostarkCharacter(request, updateAuthenticationDTO.data);
	}

	@SkipThrottle({ default: false })
	@Throttle({ default: { limit: 10, ttl: 60000 } }) //1분에 10개 이상 금지
	@Put("lostark/character/change")
	async changeLostarkChatacter(@Req() request: Request): Promise<{ result: string, characterList: object }> {
		return await this.accountService.changeLostarkChatacter(request);
	}

	//인증된 로아 캐릭터 정보 업데이트
	@SkipThrottle({ default: false })
	@Throttle({ default: { limit: 10, ttl: 60000 } }) //1분에 10개 이상 금지
	@Put("lostark/character/renew")
	async renewLostarkChatacter(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<string> {
		return await this.accountService.renewLostarkChatacter(request, response);
	}

	@SkipThrottle({ default: false })
	@Throttle({ default: { limit: 10, ttl: 60000 } }) //1분에 10개 이상 금지
	@Post("lostark/character/exit")
	async exitLostarkChatacter(@Req() request: Request) {
		await this.accountService.exitLostarkChatacter(request);
	}

	//로스트아크 캐릭터 인증 해제
	@Delete("lostark/character")
	async deactivateLostarkCharacter(@Req() request: Request): Promise<boolean> {
		return await this.accountService.deactivateLostarkCharacter(request);
	}

	@SkipThrottle({ default: false })
	@Throttle({ default: { limit: 20, ttl: 60000 } }) //1분에 20개 이상 금지
	@Post("login")
	async loginAccount(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() updateAccountDTO: UpdateAccountDTO): Promise<string> {
		return await this.accountService.loginAccount(updateAccountDTO, request, response);
	}

	@Post("logout")
	async logoutAccount(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
		this.accountService.logoutAccount(request, response);
	}

	@Get("login/status")
	async checkLoginStatus(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<{ status: string, id: string, nickname: string }> {
		return await this.accountService.checkLoginStatus(request, response);
	}
	
	@Get("information/my")
	async getMyInfo(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<Account | NotFoundException> {
		return await this.accountService.getMyInfo(request, response);
	}

	@Patch("password")
	async updatePassword(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() updateAccountDTO: UpdateAccountDTO): Promise<number> {
		return await this.accountService.updatePassword(request, response, updateAccountDTO);
	}

	@Post("reset/password/request")
	async requestResetPassword(@Body() updateAccountDTO: UpdateAccountDTO): Promise<string> {
		return await this.accountService.beforeResetPassword(updateAccountDTO);
	}

	//비밀번호 잊어버린 사용자, 이메일로 전달받은 코드 확인
	@Get("verify/reset/password/:verificationCode")
	async checkPasswordForgotCode(@Body() updateAccountDTO: UpdateAccountDTO, @Param("verificationCode") verificationCode: string): Promise<string> {
		return await this.accountService.checkPasswordForgotCode(updateAccountDTO, verificationCode);
	}

	@Patch("reset/password/execute")
	async resetPassword(@Body() updateAccountDTO: UpdateAccountDTO): Promise<string> {
		return await this.accountService.resetPassword(updateAccountDTO);
	}

	@Patch("nickname")
	async updateNickname(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() updateAccountDTO: UpdateAccountDTO): Promise<Boolean> {
		return await this.accountService.updateNickname(request, response, updateAccountDTO);
	}

	@Post("blacklist")
	async addToBlacklist(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() createBlacklistDTO: CreatePersonalBlackListDTO): Promise<string> {
		return await this.accountService.addToBlacklist(request, response, createBlacklistDTO);
	}

	@Get("blacklist/:page")
	async getMyBlacklist(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Param("page") page: number): Promise<[PersonalBlackList[], number]> {
		return await this.accountService.getMyBlacklist(request, response, page);
	}

	@Delete("blacklist/reset")
	async resetMyBlacklist(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<boolean> {
		return await this.accountService.resetMyBlacklist(request, response);
	}

	@Delete("blacklist")
	async deleteMyBlacklist(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() deleteBlacklistDTO: DeletePersonalBlackListDTO): Promise<boolean> {
		return await this.accountService.deleteMyBlacklist(request, response, deleteBlacklistDTO);
	}

	@Patch("blacklist")
	async updateMyBlacklist(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() updateBlacklistDTO: UpdatePersonalBlackListDTO): Promise<boolean> {
		return await this.accountService.updateMyBlacklist(request, response, updateBlacklistDTO);
	}

	@Patch("introduce")
	async saveMyIntroduce(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() updateAccounttDTO: UpdateAccountDTO): Promise<boolean> {
		return await this.accountService.saveMyIntroduce(request, response, updateAccounttDTO.introduce);
	}

	@Delete("introduce")
	async deleteMyIntroduce(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<boolean> {
		return await this.accountService.deleteMyIntroduce(request, response);
	}

	//다른 사용자 정보 가져오기
	@Get("information/:nickname")
	async getYourInfo(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Param("nickname") nickname: string): Promise<Account | NotFoundException> {
		return await this.accountService.getYourInfo(request, response, nickname);
	}

	//프로필 사진 정보 저장
	@Post("image")
	@UseInterceptors(FileInterceptor("upload"))
	async uploadProfilePicture(@Req() request: Request, @Res({ passthrough: true }) response: Response, @UploadedFile() file: Express.Multer.File): Promise<{ url: string } | { error: { message: string } }> {
		return await this.accountService.uploadProfilePicture(request, response, file);
	}

	//프로필 사진 정보 삭제
	@Delete("image")
	async deleteProfilePicture(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<boolean> {
		return await this.accountService.deleteProfilePicture(request, response);
	}

	//내가 작성한 글 가져오기
	@Get("post")
	async getMyPost(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<any> {
		return await this.accountService.getMyPost(request, response);
	}

	/*
	@Post("verify/send/email")
	async setVerifyEmailTokenLater(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<string> {
		return await this.accountService.setVerifyEmailTokenLater(request);
	}

	@Get("verify/email/:verificationCode")
	async verifyEmail(@Param("verificationCode") verificationCode: string): Promise<boolean> {
		return await this.accountService.verifyEmail(verificationCode);
	}
	*/
}