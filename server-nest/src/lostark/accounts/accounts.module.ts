import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accounts } from './accounts.entity';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Accounts
		]),
		CacheModule.register(),
	],
	controllers: [AccountsController],
	providers: [AccountsService],
})
export class AccountsModule {}