import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from 'src/account/account.module';
import { PostController } from './post.controller';
import { LostArkKnownPost } from './known/lostArkKnownPost.entity';
import { LostArkKnownReply } from './known/lostArkKnownReply.entity';
import { LostArkKnownVoteHistory } from './known/lostArkKnownVoteHistory.entity';
import { LostArkUnknownPost } from './unknown/lostArkUnknownPost.entity';
import { LostArkUnknownReply } from './unknown/lostArkUnknownReply.entity';
import { LostArkKnownPostService } from './known/lostArkKnownPost.service';
import { LostArkUnknownPostService } from './unknown/lostArkUnknownPost.service';
import { LostarkAnnouncePostService } from './announce/lostarkAnnouncePost.service';
import { LostarkAnnouncePost } from './announce/lostarkAnnouncePost.entity';
import { LostarkAnnounceVoteHistory } from './announce/lostarkAnnounceVoteHistory.entity';

/**
 * 게시판 관련 기능 모듈
 * 
 * imports: AccountModule
 */
@Module({
	imports: [
		AccountModule,

		TypeOrmModule.forFeature([
			LostarkAnnouncePost, LostarkAnnounceVoteHistory
			, LostArkKnownPost, LostArkKnownReply, LostArkKnownVoteHistory
			, LostArkUnknownPost, LostArkUnknownReply
		]),
	],
	controllers: [ PostController ],
	providers: [ LostarkAnnouncePostService, LostArkKnownPostService, LostArkUnknownPostService ],
})
export class PostModule {}