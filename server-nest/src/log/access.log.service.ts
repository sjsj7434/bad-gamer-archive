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

	async createAccessLog(sendData: {sizeData: string}, ipData: string){
		try {
			const logData = this.accessLogRepository.create({ message: sendData.sizeData, ip: ipData });
			this.accessLogRepository.insert(logData);
		}
		catch (error) {
			console.error("[심각함] 로그를 삽입할 수 없습니다", error);
		}
	}
}