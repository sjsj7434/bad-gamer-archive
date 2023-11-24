import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from 'src/accounts/accounts.module';
import { PostController } from './post.controller';
import { BoardsService } from './boards.service';
import { Boards } from './boards.entity';
import { Replies } from './replies.entity';
import { VoteHistory } from './voteHistory.entity';
import { LostArkKnownPost } from './lostark/known/lostArkKnownPost.entity';
import { LostArkKnownReply } from './lostark/known/lostArkKnownReply.entity';
import { LostArkKnownVoteHistory } from './lostark/known/lostArkKnownVoteHistory.entity';
import { LostArkUnknownPost } from './lostark/unknown/lostArkUnknownPost.entity';
import { LostArkUnknownReply } from './lostark/unknown/lostArkUnknownReply.entity';
import { LostArkKnownPostService } from './lostark/known/lostArkKnownPost.service';
import { LostArkUnknownPostService } from './lostark/unknown/lostArkUnknownPost.service';

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
			, LostArkKnownPost, LostArkKnownReply, LostArkKnownVoteHistory
			, LostArkUnknownPost, LostArkUnknownReply
		]),
	],
	controllers: [ PostController ],
	providers: [ BoardsService, LostArkKnownPostService, LostArkUnknownPostService, ],
})
export class PostModule {}