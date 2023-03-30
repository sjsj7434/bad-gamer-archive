import { Param, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) { }

	@Get('test/:characterNickName')
	async getTestJson(@Param('characterNickName') characterNickName: string): Promise<object> {
		console.log('[Controller-get] test => ' + decodeURIComponent(characterNickName));
		const result = await this.appService.getTestJson(characterNickName);
		return result;
	}

	@Get('guilds/:serverName')
	async getGuildList(@Param('serverName') serverName: string): Promise<object> {
		console.log('[Controller-get] guilds => ' + decodeURIComponent(serverName));
		const result = await this.appService.getGuildList(serverName);
		return result;
	}

	@Get('characters/:characterNickName')
	async getCharacterList(@Param('characterNickName') characterNickName: string): Promise<object> {
		console.log('[Controller-get] characters => ' + decodeURIComponent(characterNickName));
		const result = await this.appService.getCharacterList(characterNickName);
		return result;
	}

	@Get('character/:characterNickName')
	async getCharacterInfo(@Param('characterNickName') characterNickName: string): Promise<object> {
		console.log('[Controller-get] character => ' + decodeURIComponent(characterNickName));
		const result = await this.appService.getCharacterInfo(characterNickName);
		return result;
	}

	@Post('image')
	@UseInterceptors(FileInterceptor('upload'))
	uploadFile(@UploadedFile() file: Express.Multer.File): object {
		//Multer is --save-dev option installed, same as -d option
		const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
		console.log('[Controller-post] image', randomName, extname(file.originalname));
		console.log(file);
		return { "url": "https://docs.nestjs.com/assets/logo-small.svg" };
	}
}