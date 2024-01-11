import { Module } from '@nestjs/common';
import { ErrorLogModule } from './log/error.log.module';
import { LostarkApiModule } from './lostark/api/lostark.api.module';
import { AccessLogModule } from './log/access.log.module';

/**
 * Global 모듈
 * 
 * imports: ErrorLogModule, LostarkApiModule, AccessLogModule
 */
@Module({
	imports: [
		ErrorLogModule,
		LostarkApiModule,
		AccessLogModule,
	],
	controllers: [],
	providers: [],
})
export class GlobalModule {}