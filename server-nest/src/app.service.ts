import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

const lostarkAPIToken = "write_your_lostark_api_key_here"; //keep it secret, do not upload on Github even private repo!

@Injectable()
export class AppService {
	constructor(private readonly httpService: HttpService) { }
	
	getHello(): string {
		return 'Hello World! Finally you called me~';
	}

	async getGuildList(serverName: string): Promise<any> {
		const apiUrl = `https://developer-lostark.game.onstove.com/guilds/rankings?serverName=${serverName}`;
		const headersRequest = {
			'Content-Type': 'application/json', // As Far As I Know, this one is not needed
			'Authorization': `bearer ${lostarkAPIToken}`,
		};

		const { data } = await firstValueFrom(
			this.httpService.get<any>(apiUrl, { headers: headersRequest }).pipe(
				catchError((error: AxiosError) => {
					console.error(error.response.data);
					throw 'An error happened!';
				}),
			),
		);

		return data;
	}

	async getCharacterList(characterNickName: string): Promise<any> {
		const apiUrl = `https://developer-lostark.game.onstove.com/characters/${characterNickName}/siblings`;
		const headersRequest = {
			'Content-Type': 'application/json', // As Far As I Know, this one is not needed
			'Authorization': `bearer ${lostarkAPIToken}`,
		};

		const { data } = await firstValueFrom(
			this.httpService.get<any>(apiUrl, { headers: headersRequest }).pipe(
				catchError((error: AxiosError) => {
					console.error(error.response.data);
					throw 'An error happened!';
				}),
			),
		);

		return data;
	}

	async getCharacterInfo(characterNickName: string): Promise<any> {
		const apiUrl = `https://developer-lostark.game.onstove.com/armories/characters/${characterNickName}/profiles`;
		const headersRequest = {
			'Content-Type': 'application/json', // As Far As I Know, this one is not needed
			'Authorization': `bearer ${lostarkAPIToken}`,
		};

		const { data } = await firstValueFrom(
			this.httpService.get<any>(apiUrl, { headers: headersRequest }).pipe(
				catchError((error: AxiosError) => {
					console.error(error.response.data);
					throw 'An error happened!';
				}),
			),
		);

		return data;
	}
}