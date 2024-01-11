import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessLog } from './access.log.entity';
import { AccessLogService } from './access.log.service';

/**
 * 오류 로그 남기는 모듈(전역 모듈)
 * 
 * GlobalModule에 포함되어 있음
 */
@Global()
@Module({
	imports: [
		TypeOrmModule.forFeature([
			AccessLog
		]),
	],
	controllers: [],
	providers: [ AccessLogService ],
	exports: [ AccessLogService ],
})
export class AccessLogModule {}