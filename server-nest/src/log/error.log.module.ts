import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorLog } from './error.log.entity';
import { ErrorLogService } from './error.log.service';

/**
 * 오류 로그 남기는 모듈(전역 모듈)
 * GlobalModule에 포함되어 있음
 */
@Global()
@Module({
	imports: [
		TypeOrmModule.forFeature([
			ErrorLog
		]),
	],
	controllers: [],
	providers: [ ErrorLogService ],
	exports: [ ErrorLogService ],
})
export class ErrorLogModule {}