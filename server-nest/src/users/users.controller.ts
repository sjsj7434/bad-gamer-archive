import { Body, Controller, Get, Post, Param, Res } from '@nestjs/common';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { VerifyEmailDto } from 'src/dto/verify-email.dto';

@Controller('api/users')
export class UsersController {
	@Get()
	root() {
		console.log('API HOME')
		return { message: `Hello here is API home!\n${new Date()}`, data: new Date() };
	}

	@Post()
	async createUser(@Body() dto: CreateUserDTO): Promise<void>{
		/*
			PowerShell : curl http://localhost:3000/users -contenttype "application/json" -method post -body '{"name":"Dexter","email":"dexter.haan@gmail.com"}'
		*/
		console.log(dto)
		return;
	}
	
	@Post('email-verify')
	async verifyEmail(@Body() dto: VerifyEmailDto): Promise<string> {
		/*
			PowerShell : curl http://localhost:3000/users/email-verify -contenttype "application/json" -method post -body '{"signupVerifyToken": "test_token"}'
		*/
		console.log(dto);
		return;
	}

	@Get('/get/:id')
	async getUserInfo(@Param('id') userId: string): Promise<any> {
		console.log(userId);
		return { "message": 'getUserInfo API!', "userId": userId };
	}
}