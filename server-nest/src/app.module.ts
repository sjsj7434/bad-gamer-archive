import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CommonModule } from './common.module';
import { PostModule } from './boards/post.module';
import { AccountsModule } from './accounts/accounts.module';
import { GlobalModule } from './global.module';

/**
 * 최상위 모듈
 */
@Module({
	imports: [
		CommonModule,
		GlobalModule,
		AccountsModule,
		PostModule,
		ThrottlerModule.forRoot([ //과다 호출 방지 쓰로틀러
			{
				ttl: 60000, //time to live in milliseconds
				limit: 100, //the maximum number of requests within the ttl
			}
		]),
	],
	controllers: [],
	providers: [ { provide: APP_GUARD, useClass: ThrottlerGuard } ],
})
export class AppModule { }