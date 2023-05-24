import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Boards } from './boards.entity';
import { BoardsDTO } from './boards.dto';

@Injectable()
export class BoardsService {
	constructor(
		@InjectRepository(Boards) private boardsRepository: Repository<Boards>,
	) { }

	/**
	 * Code로 1개의 게시글을 찾는다
	 */
	findWithCode(contentCode: number): Promise<Boards | null> {
		return this.boardsRepository.findOne({
			where: {
				code: contentCode,
			},
		});
	}

	/**
	 * 미인증 전용 게시판에 게시글을 생성한다
	 * 
	 * export class BoardsDTO {
		code: number;
		category: string;
		title: string;
		content: string;
		writer: string;
		ip: string;
	}
	 */
	async createContent(boardData: BoardsDTO): Promise<BoardsDTO | Boards> {
		console.log(`serviec Called : createContent`)
		const createdContent = await this.boardsRepository.save(boardData);

		return createdContent;
	}
}