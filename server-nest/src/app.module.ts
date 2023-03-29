import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { HttpModule } from '@nestjs/axios';

@Module({
	imports: [
		HttpModule,
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '../..', 'client-react/build'), //개발할 때에는 매번 빌드 해야 함? => 실제 서버에서만 빌드하고 개발할 때에는 그냥 두개 모두 서버 뛰워서 확인하면 됨
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}