import { Param, Controller, Get, Post, Put, Delete, Body } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsDTO } from './accounts.dto';

@Controller('accounts')
export class  AccountsController {
	constructor(private readonly accountsService: AccountsService) { }

	@Get('token')
	async publishUserToken(): Promise<object> {
		const userProfileToken = await this.accountsService.publishUserToken();
		return userProfileToken;
	}

	@Get('stove/:stoveURL')
	async validateAccount(@Param('stoveURL') stoveURL: string): Promise<object> {
		console.log('[Controller-user-validateAccount] => ' + stoveURL);
		const stoveURLWithoutProtocol: string = stoveURL.replace(/https:\/\/|http:\/\//g, '');
		
		if(isNaN(Number(stoveURLWithoutProtocol)) === false){
			const userProfileToken = await this.accountsService.getStoveUserToken(stoveURLWithoutProtocol);
			const isTokenOK = userProfileToken['data'] !== '' ? true : false; //여기에 발급한 토큰과 비교 필요
	
			if(isTokenOK === true){
				const characterNames = await this.accountsService.getStoveUserCharacters(stoveURLWithoutProtocol);
				console.log(characterNames);
				
				return {data: characterNames};
			}
			else{
				return {data: 'fail'};
			}
		}
		else{
			return {data: 'code'};
		}
	}

	@Get(':accountID')
	async findWithID(@Param('accountID') accountID: string): Promise<object> {
		console.log('[Controller-user-findWithID]');
		
		const result = await this.accountsService.findWithID(accountID);
		console.log(result);

		if(result === null){
			console.log('findWithID is null');
		}

		return {data: result};
	}

	@Get('nickname/:nickname')
	async findWithNickname(@Param('nickname') nickname: string): Promise<object> {
		console.log('[Controller-user-findWithNickname]');
		
		const result = await this.accountsService.findWithNickname(nickname);
		console.log(result);

		if(result === null){
			console.log('findWithNickname is null');
		}

		return {data: result};
	}

	@Get()
	async findAll(): Promise<object> {
		console.log('[Controller-user-findAll] => ');

		const result = await this.accountsService.findAll();
		console.log(result);

		return result;
	}

	@Post()
	async createAccount(@Body() body: AccountsDTO): Promise<object> {
		console.log('[Controller-user-createAccount] => ', body);

		const result = await this.accountsService.createAccount(body);

		return { data: result };
	}

	@Put()
	async updateAccount(@Body() body: AccountsDTO): Promise<object> {
		console.log('[Controller-user-updateAccount] => ', body);

		const result = await this.accountsService.updateAccount(body);
		console.log(result);

		return { data: 'update' };
	}

	@Delete()
	async deleteAccount(@Body() body: AccountsDTO): Promise<object> {
		console.log('[Controller-user-deleteAccount] => ', body);

		const result = await this.accountsService.deleteAccount(body);
		console.log(result);

		return { data: 'soft-delete' };
	}
}