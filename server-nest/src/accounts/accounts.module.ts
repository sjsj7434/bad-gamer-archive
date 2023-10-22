import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { Accounts } from './accounts.entity';
import { Level } from './level.entity';
import { Authentication } from './authentication.entity';

/**
 * 사용자 계정 관련 기능 모듈
 */
@Module({
	imports: [
		TypeOrmModule.forFeature([
			Accounts, Level, Authentication
		]),
	],
	controllers: [ AccountsController ],
	providers: [ AccountsService ],
	exports: [ AccountsService ],
})
export class AccountsModule {}