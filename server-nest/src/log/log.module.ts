import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './log.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Log
		]),
	],
	controllers: [],
	providers: [],
})
export class LogModule {}