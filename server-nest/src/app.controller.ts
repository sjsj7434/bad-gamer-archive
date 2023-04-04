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

	@Get('character/:characterNickName')
	async getCharacterInfo(@Param('characterNickName') characterNickName: string): Promise<object> {
		console.log('[Controller-get] character => ' + decodeURIComponent(characterNickName));
		const profile: object = await this.appService.getCharacterInfoProfile(characterNickName);
		
		return profile;
	}

	@Get('equipment/:characterNickName')
	async getEquipmentInfo(@Param('characterNickName') characterNickName: string): Promise<object> {
		console.log('[Controller-get] Equipment => ' + decodeURIComponent(characterNickName));
		const equipment: object = await this.appService.getCharacterInfoEquipment(characterNickName);

		return equipment;
	}

	@Get('engravings/:characterNickName')
	async getEngravingsInfo(@Param('characterNickName') characterNickName: string): Promise<object> {
		console.log('[Controller-get] Engravings => ' + decodeURIComponent(characterNickName));
		const engravings: object = await this.appService.getCharacterInfoEngravings(characterNickName);

		return engravings;
	}

	@Get('cards/:characterNickName')
	async getCardsInfo(@Param('characterNickName') characterNickName: string): Promise<object> {
		console.log('[Controller-get] Cards => ' + decodeURIComponent(characterNickName));
		const cards: object = await this.appService.getCharacterInfoCards(characterNickName);

		return cards;
	}

	@Get('gems/:characterNickName')
	async getGemsInfo(@Param('characterNickName') characterNickName: string): Promise<object> {
		console.log('[Controller-get] Gems => ' + decodeURIComponent(characterNickName));
		const gems: object = await this.appService.getCharacterInfoGems(characterNickName);

		return gems;
	}

	@Get('characters/:characterNickName')
	async getCharacterList(@Param('characterNickName') characterNickName: string): Promise<object> {
		console.log('[Controller-get] characters => ' + decodeURIComponent(characterNickName));
		const result = await this.appService.getCharacterList(characterNickName);
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