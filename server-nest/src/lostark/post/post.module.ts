import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from 'src/accounts/accounts.module';
import { PostController } from './post.controller';
import { Boards } from './boards.entity';
import { Replies } from './replies.entity';
import { VoteHistory } from './voteHistory.entity';
import { LostArkKnownPost } from './known/lostArkKnownPost.entity';
import { LostArkKnownReply } from './known/lostArkKnownReply.entity';
import { LostArkKnownVoteHistory } from './known/lostArkKnownVoteHistory.entity';
import { LostArkUnknownPost } from './unknown/lostArkUnknownPost.entity';
import { LostArkUnknownReply } from './unknown/lostArkUnknownReply.entity';
import { LostArkKnownPostService } from './known/lostArkKnownPost.service';
import { LostArkUnknownPostService } from './unknown/lostArkUnknownPost.service';
import { CommonPostService } from './common/commonPost.service';

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
	providers: [ CommonPostService, LostArkKnownPostService, LostArkUnknownPostService, ],
})
export class PostModule {}