import { Param, Controller, Get, Post, Put, Delete, Body, Res, Req } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountsDTO, DeleteAccountsDTO, UpdateAccountsDTO } from './accounts.dto';
import { Request, Response } from 'express';
import { Accounts } from './accounts.entity';
import { LostarkAPIService } from '../lostark/api/lostark.api.service';

@Controller("accounts")
export class  AccountsController {
	constructor(private accountsService: AccountsService, private apiService: LostarkAPIService) { }

	@Get("stove/token")
	async publishUserToken(@Req() request: Request): Promise<object> {
		const userProfileToken = await this.accountsService.publishUserToken(request);
		return userProfileToken;
	}

	@Get("stove/:stoveURL")
	async checkTokenMatch(@Req() request: Request, @Param("stoveURL") stoveURL: string): Promise<{ data: any }> {
		console.log("[Controller-user-checkTokenMatch] => " + stoveURL);
		const stoveURLWithOutProtocol: string = stoveURL.replace(/https:\/\/|http:\/\//g, "");
		
		if(isNaN(Number(stoveURLWithOutProtocol)) === false){
			const compareResult = await this.accountsService.compareStoveUserToken(request, stoveURLWithOutProtocol);

			if (compareResult === "good"){
				// const characterNames = await this.accountsService.getStoveUserCharacters_scrap(stoveURLWithOutProtocol);
				const characterName = await this.accountsService.getStoveUserCharacters_api(stoveURLWithOutProtocol);
				const characterNames = await this.apiService.getCharacterList(characterName);
				
				return {data: characterNames};
			}
			else if (compareResult === "bad") {
				return { data: "fail" };
			}
			else {
				return { data: "redo" };
			}
		}
		else{
			return {data: "code"};
		}
	}

	@Get("id/:accountID")
	async findWithID(@Param("accountID") accountID: string): Promise<{ data: Accounts | null }> {
		console.log("[Controller-user-findWithID]");
		
		const result = await this.accountsService.findWithID(accountID);
		console.log(result);

		if(result === null){
			console.log("findWithID is null");
		}

		return {data: result};
	}

	@Get("nickname/:nickname")
	async findWithNickname(@Param("nickname") nickname: string): Promise<{ data: Accounts | null }> {
		console.log("[Controller-user-findWithNickname]");
		
		const result = await this.accountsService.findWithNickname(nickname);
		console.log(result);

		if(result === null){
			console.log("findWithNickname is null");
		}

		return {data: result};
	}

	@Get()
	async findAll(): Promise<Accounts[]> {
		console.log("[Controller-user-findAll] => ");

		const result = await this.accountsService.findAll();
		console.log(result);

		return result;
	}

	@Post()
	async createAccount(@Body() createAccountsDTO: CreateAccountsDTO): Promise<{ data: number }> {
		console.log("[Controller-user-createAccount] => ", createAccountsDTO);

		const result = await this.accountsService.createAccount(createAccountsDTO);

		return { data: result };
	}

	@Delete()
	async deleteAccount(@Body() deleteAccountsDTO: DeleteAccountsDTO): Promise<{data: string}> {
		console.log("[Controller-user-deleteAccount] => ", deleteAccountsDTO);

		const result = await this.accountsService.deleteAccount(deleteAccountsDTO);
		console.log(result);

		return { data: "soft-delete" };
	}

	@Put("lostark/character")
	async updateLostarkMainCharacter(@Req() request: Request, @Body() updateAccountsDTO: UpdateAccountsDTO): Promise<{data: string}> {
		console.log("[Controller-user-updateLostarkMainCharacter] => ", updateAccountsDTO);

		const result = await this.accountsService.updateLostarkMainCharacter(request, updateAccountsDTO);
		console.log(result);

		return { data: "update lostark" };
	}

	@Post("signin")
	async signInAccount(@Body() updateAccountsDTO: UpdateAccountsDTO, @Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<{data: string}> {
		console.log("[Controller-user-signInAccount] => ", updateAccountsDTO);

		const cookieCheck = await this.accountsService.checkSignInStatus(request, response);
		const result = await this.accountsService.signInAccount(updateAccountsDTO, cookieCheck.status, request, response);

		return { data: result };
	}

	@Post("signin/status")
	async getSignInStatus(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<{ data: object }> {
		console.log("[Controller-user-getSignInStatus] => ", request.ip);

		const cookieCheck = await this.accountsService.checkSignInStatus(request, response);

		return { data: cookieCheck };
	}

	@Post("signout")
	async setSignOut(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
		console.log("[Controller-user-setSignOut]");

		this.accountsService.setSignOut(request, response);
	}
}