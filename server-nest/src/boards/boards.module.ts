import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boards } from './boards.entity';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { Replies } from './replies.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Boards, Replies
		]),
	],
	controllers: [BoardsController],
	providers: [BoardsService],
})
export class BoardsModule {}