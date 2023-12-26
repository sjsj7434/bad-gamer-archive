import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from 'src/account/account.module';
import { PostController } from './post.controller';
import { LostArkKnownPost } from './known/lostArkKnownPost.entity';
import { LostArkKnownReply } from './known/lostArkKnownReply.entity';
import { LostArkKnownPostVoteHistory } from './known/lostArkKnownPostVoteHistory.entity';
import { LostArkUnknownPost } from './unknown/lostArkUnknownPost.entity';
import { LostArkUnknownReply } from './unknown/lostArkUnknownReply.entity';
import { LostArkKnownPostService } from './known/lostArkKnownPost.service';
import { LostArkUnknownPostService } from './unknown/lostArkUnknownPost.service';
import { LostarkAnnouncePostService } from './announce/lostarkAnnouncePost.service';
import { LostarkAnnouncePost } from './announce/lostarkAnnouncePost.entity';
import { LostarkAnnounceVoteHistory } from './announce/lostarkAnnounceVoteHistory.entity';
import { LostArkKnownReplyVoteHistory } from './known/lostArkKnownReplyVoteHistory.entity';
import { LostarkHelp } from './help/lostarkHelp.entity';
import { LostarkHelpService } from './help/lostarkHelp.service';

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
			, LostArkKnownPost, LostArkKnownReply, LostArkKnownPostVoteHistory, LostArkKnownReplyVoteHistory
			, LostArkUnknownPost, LostArkUnknownReply
			, LostarkHelp
		]),
	],
	controllers: [ PostController ],
	providers: [ LostarkAnnouncePostService, LostArkKnownPostService, LostArkUnknownPostService, LostarkHelpService ],
})
export class PostModule {}