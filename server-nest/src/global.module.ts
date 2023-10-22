import { Module } from '@nestjs/common';
import { ErrorLogModule } from './log/error.log.module';
import { LostarkApiModule } from './lostark/api/lostark.api.module';

/**
 * Global 모듈
 * ErrorLogModule, LostarkApiModule
 */
@Module({
	imports: [
		ErrorLogModule,
		LostarkApiModule,
	],
	controllers: [],
	providers: [],
})
export class GlobalModule {}