import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorLog } from 'src/log/error.log.entity';

@Injectable()
export class ErrorLogService {
	constructor(
		@InjectRepository(ErrorLog) private errorLogRepository: Repository<ErrorLog>,
	) { }

	async createErrorLog(error: Error){
		try {
			console.debug(typeof error.stack, error.stack.split("at ")[0]);
			const errorName = error.name.substring(0, 100);
			const errorMassage = error.stack.substring(0, 2000);
			const logData = this.errorLogRepository.create({ type: "error", name: errorName, message: errorMassage, ip: "request.ip", id: "id here" });
			this.errorLogRepository.insert(logData);
		}
		catch (error) {
			console.error("[심각함] 로그를 삽입할 수 없습니다", error);
		}
	}
}