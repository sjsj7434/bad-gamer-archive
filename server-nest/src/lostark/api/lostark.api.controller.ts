import { Param, Controller, Get } from '@nestjs/common';
import { LostarkAPIService } from './lostark.api.service';
import { Throttle } from '@nestjs/throttler';

const throttleOption: object = { limit: 10, ttl: 60 * 1000 } //1분에 10개 이상 금지

@Controller()
export class LostarkAPIController {
	constructor(private readonly lostarkAPIService: LostarkAPIService) { }

	@Throttle({ default: throttleOption })
	@Get('characters/:characterNickName')
	async getCharacterList(@Param('characterNickName') characterNickName: string): Promise<object> {
		return await this.lostarkAPIService.getCharacterList(characterNickName);
	}

	@Throttle({ default: throttleOption })
	@Get('character/:characterNickName')
	async getCharacterInfo(@Param('characterNickName') characterNickName: string): Promise<object> {
		return await this.lostarkAPIService.getCharacterInfoProfile(characterNickName);
	}

	// @Throttle({ default: throttleOption })
	// @Get('equipment/:characterNickName')
	// async getEquipmentInfo(@Param('characterNickName') characterNickName: string): Promise<object> {
	// 	return await this.lostarkAPIService.getCharacterInfoEquipment(characterNickName);
	// }

	// @Throttle({ default: throttleOption })
	// @Get('engravings/:characterNickName')
	// async getEngravingsInfo(@Param('characterNickName') characterNickName: string): Promise<object> {
	// 	return await this.lostarkAPIService.getCharacterInfoEngravings(characterNickName);
	// }

	// @Throttle({ default: throttleOption })
	// @Get('cards/:characterNickName')
	// async getCardsInfo(@Param('characterNickName') characterNickName: string): Promise<object> {
	// 	return await this.lostarkAPIService.getCharacterInfoCards(characterNickName);
	// }

	// @Throttle({ default: throttleOption })
	// @Get('gems/:characterNickName')
	// async getGemsInfo(@Param('characterNickName') characterNickName: string): Promise<object> {
	// 	return await this.lostarkAPIService.getCharacterInfoGems(characterNickName);
	// }

	// @Throttle({ default: throttleOption })
	// @Get('guilds/:serverName')
	// async getGuildList(@Param('serverName') serverName: string): Promise<object> {
	// 	return await this.lostarkAPIService.getGuildList(serverName);
	// }
}