import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boards } from './boards.entity';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Boards
		]),
	],
	controllers: [BoardsController],
	providers: [BoardsService],
})
export class BoardsModule {}