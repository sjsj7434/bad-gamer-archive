import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boards } from './boards.entity';
import { Replies } from './replies.entity';
import { AccountsModule } from 'src/accounts/accounts.module';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';

@Module({
	imports: [
		AccountsModule,

		TypeOrmModule.forFeature([
			Boards, Replies
		]),
	],
	controllers: [ BoardsController ],
	providers: [ BoardsService ],
})
export class BoardsModule {}