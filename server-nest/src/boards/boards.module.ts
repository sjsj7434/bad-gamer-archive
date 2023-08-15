import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boards } from './boards.entity';
import { AnonymousBoardController } from './anonymousBoard.controller';
import { AnonymousBoardService } from './anonymousBoard.service';
import { Replies } from './replies.entity';
import { UserBoardController } from './userBoard.controller';
import { UserBoardService } from './userBoard.service';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
	imports: [
		AccountsModule,

		TypeOrmModule.forFeature([
			Boards, Replies
		]),
	],
	controllers: [AnonymousBoardController, UserBoardController,],
	providers: [AnonymousBoardService, UserBoardService,],
})
export class BoardsModule {}