import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LostarkAPIController } from './lostark.api.controller';
import { LostarkAPIService } from './lostark.api.service';

/**
 * 로스트아크 API 호출(전역 모듈)
 * GlobalModule에 포함되어 있음
 */
@Global()
@Module({
	imports: [
		HttpModule,
	],
	controllers: [LostarkAPIController],
	providers: [LostarkAPIService],
	exports: [LostarkAPIService],
})
export class LostarkApiModule {}