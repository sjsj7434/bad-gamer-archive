import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from 'src/accounts/accounts.module';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { Boards } from './boards.entity';
import { Replies } from './replies.entity';
import { VoteHistory } from './voteHistory.entity';

/**
 * 게시판 관련 기능 모듈
 * 
 * imports: AccountsModule
 */
@Module({
	imports: [
		AccountsModule,

		TypeOrmModule.forFeature([
			Boards, Replies, VoteHistory
		]),
	],
	controllers: [ BoardsController ],
	providers: [ BoardsService ],
})
export class BoardsModule {}