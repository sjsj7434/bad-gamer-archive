import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AccountsModule } from './accounts/accounts.module';
import { BoardsModule } from './boards/boards.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
	imports: [
		AccountsModule,
		BoardsModule,
		ScheduleModule.forRoot(),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, "../..", "client-react/build"), //개발할 때에는 매번 빌드 해야 함? => 실제 서버에서만 빌드하고 개발할 때에는 그냥 두개 모두 서버 뛰워서 확인하면 됨
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				type: "mysql",
				host: configService.get("DATABASE_HOST"),
				port: configService.get("DATABASE_PORT"),
				username: configService.get("DATABASE_USER"),
				password: configService.get("DATABASE_PASSWORD"),
				database: configService.get("DATABASE"),
				entities: [], // entity manual load
				autoLoadEntities: true, // if not registered in forFeature(), won't be included
				synchronize: true, // sychronize 가 켜져 있기 때문에 정의한 entity가 db에 생기는 것???
				charset: "utf8mb4",
				collation: "utf8mb4_unicode_ci",
			}),
			inject: [ConfigService],
		}),
		ThrottlerModule.forRoot([
			{
				ttl: 60000, //time to live in milliseconds
				limit: 100, //the maximum number of requests within the ttl
			}
		]),
	],
	controllers: [],
	providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule { }