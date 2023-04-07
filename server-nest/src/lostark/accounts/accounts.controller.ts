import { Param, Controller, Get, Post, Put, Delete, Body } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsDTO } from './accounts.dto';

@Controller('accounts')
export class  AccountsController {
	constructor(private readonly accountsService: AccountsService) { }

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