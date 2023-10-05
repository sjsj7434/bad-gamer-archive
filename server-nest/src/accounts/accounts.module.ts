import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accounts } from './accounts.entity';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { CacheModule } from '@nestjs/cache-manager';
import { Level } from './level.entity';
import { Authentication } from './authentication.entity';
import { LostarkModule } from '../lostark/api/lostark.module';

@Module({
	imports: [
		LostarkModule,

		TypeOrmModule.forFeature([
			Accounts, Level, Authentication
		]),
		CacheModule.register(),
	],
	controllers: [AccountsController,],
	providers: [AccountsService,],
	exports: [AccountsService],
})
export class AccountsModule {}