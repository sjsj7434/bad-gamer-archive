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
		
		if (profile["data"] !== null){
			const equipment: object = await this.appService.getCharacterInfoEquipment(characterNickName);
			const avatars: object = await this.appService.getCharacterInfoAvatars(characterNickName);
			const combatSkills: object = await this.appService.getCharacterInfoCombatSkills(characterNickName);
			const engravings: object = await this.appService.getCharacterInfoEngravings(characterNickName);
			const cards: object = await this.appService.getCharacterInfoCards(characterNickName);
			const gems: object = await this.appService.getCharacterInfoGems(characterNickName);
			const colosseums: object = await this.appService.getCharacterInfoColosseums(characterNickName);
			const collectibles: object = await this.appService.getCharacterInfoCollectibles(characterNickName);

			return {
				data: {
					profile: profile,
					equipment: equipment,
					avatars: avatars,
					combatSkills: combatSkills,
					engravings: engravings,
					cards: cards,
					gems: gems,
					colosseums: colosseums,
					collectibles: collectibles
				}
			};
		}
		else{
			return profile;
		}
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