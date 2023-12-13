import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { Account } from './account.entity';
import { Authentication } from './authentication.entity';
import { LostarkCharacter } from './lostarkCharacter.entity';
import { PersonalBlackList } from './personalBlackList.entity';

/**
 * 사용자 계정 관련 기능 모듈
 */
@Module({
	imports: [
		TypeOrmModule.forFeature([
			Account, Authentication, PersonalBlackList
			, LostarkCharacter
		]),
	],
	controllers: [ AccountController ],
	providers: [ AccountService ],
	exports: [ AccountService ],
})
export class AccountModule {}