import { Param, Controller, Get, Post, Put, Delete, Body, Res, Req } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsDTO } from './accounts.dto';
import { Request, Response } from 'express';
import { Accounts } from './accounts.entity';

@Controller("accounts")
export class  AccountsController {
	constructor(private readonly accountsService: AccountsService) { }

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
			const userProfileToken = await this.accountsService.compareStoveUserToken(request, stoveURLWithOutProtocol);
	
			if (userProfileToken === true){
				const characterNames = await this.accountsService.getStoveUserCharacters(stoveURLWithOutProtocol);
				console.log(characterNames);
				
				return {data: characterNames};
			}
			else{
				return {data: "fail"};
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
	async createAccount(@Body() body: AccountsDTO): Promise<{ data: number }> {
		console.log("[Controller-user-createAccount] => ", body);

		const result = await this.accountsService.createAccount(body);

		return { data: result };
	}

	@Put()
	async updateAccount(@Body() body: AccountsDTO): Promise<{data: string}> {
		console.log("[Controller-user-updateAccount] => ", body);

		const result = await this.accountsService.updateAccount(body);
		console.log(result);

		return { data: "update" };
	}

	@Delete()
	async deleteAccount(@Body() body: AccountsDTO): Promise<{data: string}> {
		console.log("[Controller-user-deleteAccount] => ", body);

		const result = await this.accountsService.deleteAccount(body);
		console.log(result);

		return { data: "soft-delete" };
	}

	@Post("signin")
	async signInAccount(@Body() body: AccountsDTO, @Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<{data: string}> {
		console.log("[Controller-user-signInAccount] => ", body);

		const cookieCheck = await this.accountsService.checkSignInStatus(request, response);
		const result = await this.accountsService.signInAccount(body, cookieCheck.status, request, response);

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