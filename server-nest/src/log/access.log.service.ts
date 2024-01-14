import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessLog } from './access.log.entity';
import { Request } from 'express';

@Injectable()
export class AccessLogService {
	constructor(
		@InjectRepository(AccessLog) private accessLogRepository: Repository<AccessLog>,
	) { }

	async createAccessLog(request: Request, sendData: {sizeData: string}){
		try {
			const ipData: string = request.headers["x-forwarded-for"].toString();

			if(ipData !== null && ipData !== undefined){
				const logData = this.accessLogRepository.create({ message: sendData.sizeData, ip: ipData });
				this.accessLogRepository.insert(logData);
			}
		}
		catch (error) {
			console.error("[심각함] 로그를 삽입할 수 없습니다", error);
		}
	}
}