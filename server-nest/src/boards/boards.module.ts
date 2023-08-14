import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boards } from './boards.entity';
import { AnonymousController } from './anonymous.controller';
import { AnonymousService } from './anonymous.service';
import { Replies } from './replies.entity';
import { UserBoardController } from './userBoard.controller';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Boards, Replies
		]),
	],
	controllers: [AnonymousController, UserBoardController],
	providers: [AnonymousService],
})
export class BoardsModule {}