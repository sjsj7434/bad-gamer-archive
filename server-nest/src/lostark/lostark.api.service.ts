import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class LostarkAPIService {
	constructor(private readonly httpService: HttpService, private configService: ConfigService) { }

	getLostArkAPI = async (destination: string) => {
		const headersRequest = {
			"Content-Type": "application/json", // As Far As I Know, this one is not needed
			"Authorization": `bearer ${this.configService.get("LOSTARK_API_KEY")}`,
		};

		const { data } = await firstValueFrom(
			this.httpService.get<object>(destination, { headers: headersRequest }).pipe(
				catchError((error: AxiosError) => {
					console.error(error.response.data);
					throw "An error happened!";
				}),
			),
		);

		return { "data": data };
	}

	async getTestJson(characterNickName: string): Promise<object> {
		characterNickName = "welcome to service";

		return {
			characterNickName: characterNickName,
			CharacterClassName: "배틀마스터",
			CharacterImage: "https://img.lostark.co.kr/armory/1/3D0FE3746B32F9D56FE5541819EA79047555E513F84EDE40D9A8A827218FC330.png?v=20230329115151",
			ExpeditionLevel: 216,
			ItemAvgLevel: "1,655.00",
			CharacterLevel: 60
		};
	}

	async getGuildList(serverName: string): Promise<object> {
		const result = await this.getLostArkAPI(`https://developer-lostark.game.onstove.com/guilds/rankings?serverName=${serverName}`);

		return result;
	}

	async getCharacterList(characterNickName: string): Promise<object> {
		const result = await this.getLostArkAPI(`https://developer-lostark.game.onstove.com/characters/${characterNickName}/siblings`);

		return result;
	}

	async getCharacterInfoProfile(characterNickName: string): Promise<object> {
		const result = await this.getLostArkAPI(`https://developer-lostark.game.onstove.com/armories/characters/${characterNickName}/profiles`);

		return result;
	}

	async getCharacterInfoEquipment(characterNickName: string): Promise<object> {
		const result = await this.getLostArkAPI(`https://developer-lostark.game.onstove.com/armories/characters/${characterNickName}/equipment`);

		return result;
	}

	async getCharacterInfoAvatars(characterNickName: string): Promise<object> {
		const result = await this.getLostArkAPI(`https://developer-lostark.game.onstove.com/armories/characters/${characterNickName}/avatars`);

		return result;
	}

	async getCharacterInfoCombatSkills(characterNickName: string): Promise<object> {
		const result = await this.getLostArkAPI(`https://developer-lostark.game.onstove.com/armories/characters/${characterNickName}/combat-skills`);

		return result;
	}

	async getCharacterInfoEngravings(characterNickName: string): Promise<object> {
		const result = await this.getLostArkAPI(`https://developer-lostark.game.onstove.com/armories/characters/${characterNickName}/engravings`);

		return result;
	}

	async getCharacterInfoCards(characterNickName: string): Promise<object> {
		const result = await this.getLostArkAPI(`https://developer-lostark.game.onstove.com/armories/characters/${characterNickName}/cards`);

		return result;
	}

	async getCharacterInfoGems(characterNickName: string): Promise<object> {
		const result = await this.getLostArkAPI(`https://developer-lostark.game.onstove.com/armories/characters/${characterNickName}/gems`);

		return result;
	}

	async getCharacterInfoColosseums(characterNickName: string): Promise<object> {
		const result = await this.getLostArkAPI(`https://developer-lostark.game.onstove.com/armories/characters/${characterNickName}/colosseums`);

		return result;
	}

	async getCharacterInfoCollectibles(characterNickName: string): Promise<object> {
		const result = await this.getLostArkAPI(`https://developer-lostark.game.onstove.com/armories/characters/${characterNickName}/collectibles`);

		return result;
	}
}