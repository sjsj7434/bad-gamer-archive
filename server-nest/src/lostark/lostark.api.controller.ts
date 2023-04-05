import { Param, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { LostarkAPIService } from './lostark.api.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { ConfigService } from '@nestjs/config';

@Controller()
export class LostarkAPIController {
	constructor(private readonly lostarkAPIService: LostarkAPIService, private configService: ConfigService) { }

	@Get('test/:characterNickName')
	async getTestJson(@Param('characterNickName') characterNickName: string): Promise<object> {
		console.log('[Controller-get] test => ' + decodeURIComponent(characterNickName));
		const result = await this.lostarkAPIService.getTestJson(characterNickName);
		return result;
	}

	@Get('guilds/:serverName')
	async getGuildList(@Param('serverName') serverName: string): Promise<object> {
		interface DatabaseConfig {
			host: string;
			port: number;
		}
		const dbConfig = this.configService.get<DatabaseConfig>('database');// get an environment variable
		const dbUser = this.configService.get<string>('DATABASE_USER');// get a custom configuration value
		const dbHost = this.configService.get<string>('database.host');
		console.log(`${dbConfig.port}, ${dbUser}, ${dbHost}`);

		console.log('[Controller-get] guilds => ' + decodeURIComponent(serverName));
		const result = await this.lostarkAPIService.getGuildList(serverName);
		return result;
	}

	@Get('character/:characterNickName')
	async getCharacterInfo(@Param('characterNickName') characterNickName: string): Promise<object> {
		console.log('[Controller-get] character => ' + decodeURIComponent(characterNickName));
		const profile: object = await this.lostarkAPIService.getCharacterInfoProfile(characterNickName);
		
		return profile;
	}

	@Get('equipment/:characterNickName')
	async getEquipmentInfo(@Param('characterNickName') characterNickName: string): Promise<object> {
		console.log('[Controller-get] Equipment => ' + decodeURIComponent(characterNickName));
		const equipment: object = await this.lostarkAPIService.getCharacterInfoEquipment(characterNickName);

		return equipment;
	}

	@Get('engravings/:characterNickName')
	async getEngravingsInfo(@Param('characterNickName') characterNickName: string): Promise<object> {
		console.log('[Controller-get] Engravings => ' + decodeURIComponent(characterNickName));
		const engravings: object = await this.lostarkAPIService.getCharacterInfoEngravings(characterNickName);

		return engravings;
	}

	@Get('cards/:characterNickName')
	async getCardsInfo(@Param('characterNickName') characterNickName: string): Promise<object> {
		console.log('[Controller-get] Cards => ' + decodeURIComponent(characterNickName));
		const cards: object = await this.lostarkAPIService.getCharacterInfoCards(characterNickName);

		return cards;
	}

	@Get('gems/:characterNickName')
	async getGemsInfo(@Param('characterNickName') characterNickName: string): Promise<object> {
		console.log('[Controller-get] Gems => ' + decodeURIComponent(characterNickName));
		const gems: object = await this.lostarkAPIService.getCharacterInfoGems(characterNickName);

		return gems;
	}

	@Get('characters/:characterNickName')
	async getCharacterList(@Param('characterNickName') characterNickName: string): Promise<object> {
		console.log('[Controller-get] characters => ' + decodeURIComponent(characterNickName));
		const result = await this.lostarkAPIService.getCharacterList(characterNickName);
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