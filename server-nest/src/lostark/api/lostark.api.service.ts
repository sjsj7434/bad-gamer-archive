import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class LostarkAPIService {
	constructor(private readonly httpService: HttpService, private configService: ConfigService) { }

	API_CALL_COUNT: number = 0; //max is 100 requests per minute, for now
	API_CALL_LIMIT: number = 100; //1분당 API 호출 가능 횟수

	//서울 시간 기준으로 [1분 마다] 데이터 초기화
	@Cron(CronExpression.EVERY_MINUTE, {
		name: "resetApiCallCount",
		timeZone: "Asia/Seoul",
	})
	resetApiCallCount() {
		this.API_CALL_COUNT = 0; //초기화
	}

	/**
	 * 로스트아크 API 호출 공통 함수
	 * @param destination API 주소
	 * @returns 반환 값
	 */
	getLostArkAPI = async (destination: string) => {
		if (this.API_CALL_COUNT >= this.API_CALL_LIMIT){
			console.log(`[Error] API Call Limit is ${this.API_CALL_LIMIT} per min`);
			return null;
		}

		this.API_CALL_COUNT++; //api 호출 횟수 + 1, 매분 초기화 됨
		console.log(`[Log] API Call : ${this.API_CALL_COUNT}`);

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

		return data;
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