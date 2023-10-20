import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorLog } from './error.log.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			ErrorLog
		]),
	],
	controllers: [],
	providers: [],
})
export class ErrorLogModule {}