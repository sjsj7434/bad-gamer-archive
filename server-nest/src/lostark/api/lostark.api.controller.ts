import { Param, Controller, Get } from '@nestjs/common';
import { LostarkAPIService } from './lostark.api.service';

@Controller()
export class LostarkAPIController {
	constructor(private readonly lostarkAPIService: LostarkAPIService) { }

	@Get('characters/:characterNickName')
	async getCharacterList(@Param('characterNickName') characterNickName: string): Promise<object> {
		return await this.lostarkAPIService.getCharacterList(characterNickName);
	}

	@Get('character/:characterNickName')
	async getCharacterInfo(@Param('characterNickName') characterNickName: string): Promise<object> {
		return await this.lostarkAPIService.getCharacterInfoProfile(characterNickName);
	}

	// @Get('equipment/:characterNickName')
	// async getEquipmentInfo(@Param('characterNickName') characterNickName: string): Promise<object> {
	// 	return await this.lostarkAPIService.getCharacterInfoEquipment(characterNickName);
	// }

	// @Get('engravings/:characterNickName')
	// async getEngravingsInfo(@Param('characterNickName') characterNickName: string): Promise<object> {
	// 	return await this.lostarkAPIService.getCharacterInfoEngravings(characterNickName);
	// }

	// @Get('cards/:characterNickName')
	// async getCardsInfo(@Param('characterNickName') characterNickName: string): Promise<object> {
	// 	return await this.lostarkAPIService.getCharacterInfoCards(characterNickName);
	// }

	// @Get('gems/:characterNickName')
	// async getGemsInfo(@Param('characterNickName') characterNickName: string): Promise<object> {
	// 	return await this.lostarkAPIService.getCharacterInfoGems(characterNickName);
	// }

	// @Get('guilds/:serverName')
	// async getGuildList(@Param('serverName') serverName: string): Promise<object> {
	// 	return await this.lostarkAPIService.getGuildList(serverName);
	// }
}