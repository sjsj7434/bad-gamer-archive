import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CacheModule } from '@nestjs/cache-manager';

const environmentHere: string = "dev"; //작업 환경 변수 : dev, prod

/**
 * 공통으로 사용하는 기능 모듈
 * 
 * imports: ConfigModule(Global), DB Connection, ServeStaticModule, ScheduleModule, CacheModule(Global)
 */
@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: (environmentHere === "dev" ? ['.dev.env'] : ['.prod.env']),
			load: [configuration],
			isGlobal: true, //When you want to use ConfigModule in other modules
		}),
		
		TypeOrmModule.forRootAsync({ //DB 연결
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
				synchronize: true, // 자동으로 데이터베이스의 스키마를 동기화할 것입니다. 이것은 개발 환경에서만 사용하도록 하고, 운영 환경에서는 비활성화 하는 것이 좋습니다
				charset: "utf8mb4",
				collation: "utf8mb4_unicode_ci",
			}),
			inject: [ConfigService],
		}),

		ServeStaticModule.forRoot({ //React 빌드 파일 연결
			rootPath: join(__dirname, "../..", "client-react/build"), //개발할 때에는 매번 빌드 해야 함? => 실제 서버에서만 빌드하고 개발할 때에는 그냥 두개 모두 서버 뛰워서 확인하면 됨
		}),

		ScheduleModule.forRoot(), //Cron 작업

		CacheModule.register({ //It acts as a temporary data store providing high performance data access
			isGlobal: true, //When you want to use CacheModule in other modules
		})
	],
	controllers: [],
	providers: [],
})
export class CommonModule {}