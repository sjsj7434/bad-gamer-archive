import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AccountsModule } from './accounts/accounts.module';
import { BoardsModule } from './boards/boards.module';

@Module({
	imports: [
		AccountsModule,
		BoardsModule,
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '../..', 'client-react/build'), //개발할 때에는 매번 빌드 해야 함? => 실제 서버에서만 빌드하고 개발할 때에는 그냥 두개 모두 서버 뛰워서 확인하면 됨
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				type: 'mysql',
				host: configService.get('DATABASE_HOST'),
				port: configService.get('DATABASE_PORT'),
				username: configService.get('DATABASE_USER'),
				password: configService.get('DATABASE_PASSWORD'),
				database: configService.get('DATABASE'),
				entities: [], // entity manual load
				autoLoadEntities: true, // if not registered in forFeature(), won't be included
				synchronize: true, // sychronize 가 켜져 있기 때문에 정의한 entity가 db에 생기는 것???
			}),
			inject: [ConfigService],
		}),
	],
	controllers: [],
	providers: [],
})
export class AppModule { }