import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountService } from 'src/account/account.service';
import { Request, Response } from 'express';
import { ErrorLogService } from 'src/log/error.log.service';
import { LostarkHelp } from './lostarkHelp.entity';
import { CreateLostarkHelpDTO } from './lostarkHelp.dto';

@Injectable()
export class LostarkHelpService {
	constructor(
		@InjectRepository(LostarkHelp) private lostarkHelpRepository: Repository<LostarkHelp>,
		private accountService: AccountService,
		private errorLogService: ErrorLogService,
	) { }

	private HOW_MANY_CONTENTS_ON_LIST: number = 20;

	//=================================================================================================================================================================================

	/**
	 * 고객센터 문의 작성
	 */
	async writeHelp(request: Request, response: Response, sendData: CreateLostarkHelpDTO, ipData: string): Promise<string> {
		const accountData = await this.accountService.getMyInfo(request, response);
		const loginUUID = await this.accountService.getMyUUID(request);

		if(accountData === null){
			return "login";
		}

		const newHelpData = await this.lostarkHelpRepository.create({
			writerUUID: loginUUID,
			category: sendData.category,
			title: sendData.title,
			content: sendData.content,
			ip: ipData,
		});

		await this.lostarkHelpRepository.insert(newHelpData);

		return "success";
	}

	/**
	 * 게시판 글 이미지 삽입
	 */
	async uploadImage(file: Express.Multer.File): Promise<{ url: string } | { error: { message: string } }> {
		// const timeOfNow = new Date();
		// const timeString = timeOfNow.toLocaleDateString("sv-SE").replace(/-/g, "") + timeOfNow.toLocaleTimeString("sv-SE").replace(/:/g, "");
		// const randomName = Array(10).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16).substring(0, 1)).join("");
		file.originalname = Buffer.from(file.originalname, "latin1").toString("utf8"); //한글 파일 이름이 깨져서 인코딩 추가
		console.log("uploadImage : ", file);

		return { url: "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AAZrqDW?w=300&h=157&q=60&m=6&f=jpg&u=t" };
		// return { error: { message: "test error" } };
	}
}