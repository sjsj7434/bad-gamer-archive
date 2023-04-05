import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { LostarkAPIController } from './lostark.api.controller';
import { LostarkAPIService } from './lostark.api.service';

import configuration from './config/configuration';
const environmentHere: string = "dev"; //dev, prod

@Module({
	imports: [
		HttpModule,
		LostarkModule,
		ConfigModule.forRoot({
			envFilePath: (environmentHere === "dev" ? ['.dev.env'] : ['.prod.env']),
			load: [configuration],
		}),
	],
	controllers: [LostarkAPIController],
	providers: [LostarkAPIService],
})
export class LostarkModule {}