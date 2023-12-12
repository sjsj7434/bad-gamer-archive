import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { Account } from './account.entity';
import { AccountDetail } from './accountDetail.entity';
import { Authentication } from './authentication.entity';
import { LostarkCharacter } from './lostarkCharacter';

/**
 * 사용자 계정 관련 기능 모듈
 */
@Module({
	imports: [
		TypeOrmModule.forFeature([
			Account, AccountDetail, Authentication
			, LostarkCharacter
		]),
	],
	controllers: [ AccountController ],
	providers: [ AccountService ],
	exports: [ AccountService ],
})
export class AccountModule {}