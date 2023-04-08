import { Param, Controller, Get, Post, Put, Delete, Body } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsDTO } from './accounts.dto';

@Controller('accounts')
export class  AccountsController {
	constructor(private readonly accountsService: AccountsService) { }

	@Get('token')
	async publishUserToken(): Promise<string> {
		console.log('[Controller-user-publishUserToken] => ');

		const userProfileToken = await this.accountsService.publishUserToken();
		console.log(`userProfileToken : ${userProfileToken}`);

		return userProfileToken;
	}

	@Get('stove/:stoveURL')
	async validateAccount(@Param('stoveURL') stoveURL: string): Promise<object> {
		console.log('[Controller-user-validateAccount] => ' + stoveURL);
		const stoveURLWithoutProtocol = stoveURL.replace(/https:\/\/|http:\/\//g, '');
		
		if(stoveURLWithoutProtocol.split('/').length === 2){
			const stoveCode: string = stoveURLWithoutProtocol.split('/')[1];
			const userProfileToken = await this.accountsService.getStoveUserToken(stoveCode);
			const isTokenOK = userProfileToken !== '' ? true : false; //여기에 발급한 토큰과 비교 필요
			console.log(`userProfileToken : ${userProfileToken}`);
	
			if(isTokenOK === true){
				const characterNames = await this.accountsService.getStoveUserCharacters(stoveCode);
				console.log(characterNames);
				
				return characterNames;
			}
			else{
				return {result: 'fail'};
			}
		}
		else{
			return {result: 'url'};
		}
	}

	@Get(':accountID')
	async findWithID(@Param('accountID') accountID: string): Promise<object> {
		console.log('[Controller-user-findWithID]');
		
		const result = await this.accountsService.findWithID(accountID);
		console.log(result)

		return result;
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
		console.log(result);

		return { result: 'create' };
	}

	@Put()
	async updateAccount(@Body() body: AccountsDTO): Promise<object> {
		console.log('[Controller-user-updateAccount] => ', body);

		const result = await this.accountsService.updateAccount(body);
		console.log(result);

		return { result: 'update' };
	}

	@Delete()
	async deleteAccount(@Body() body: AccountsDTO): Promise<object> {
		console.log('[Controller-user-deleteAccount] => ', body);

		const result = await this.accountsService.deleteAccount(body);
		console.log(result);

		return { result: 'soft-delete' };
	}
}