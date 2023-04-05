import { Param, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) { }

	@Get('test')
	async test(): Promise<object> {
		console.log('[Controller-get] character => ');
		const result = await this.userService.findOne('serverName');
		
		return result;
	}
}