import { Param, Controller, Get, Post, Body } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsDTO } from './accounts.dto';

@Controller('accounts')
export class  AccountsController {
	constructor(private readonly accountsService: AccountsService) { }

	@Get(':userID')
	async find(@Param('userID') userID: string): Promise<object> {
		console.log('[Controller-user-find]');
		const result = await this.accountsService.findOneByID(userID);
		console.log(result)
		
		return result;
	}

	@Post()
	async create(@Body() body: AccountsDTO): Promise<object> {
		console.log('[Controller-user-create] => ', body);
		const result = await this.accountsService.createOne(body);
		console.log(result);

		return {result: 2};
	}
}

//리스트 조회 : find()
//삭제 : delete()