import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CommonModule } from './common.module';
import { AccountModule } from './account/account.module';
import { GlobalModule } from './global.module';
import { PostModule } from './lostark/post/post.module';

/**
 * 최상위 모듈
 */
@Module({
	imports: [
		CommonModule,
		GlobalModule,
		AccountModule,
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