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
	 * code로 1개의 게시글을 찾는다
	 */
	getContentByCode(contentCode: number): Promise<Boards | null> {
		return this.boardsRepository.findOne({
			where: {
				code: contentCode,
			},
		});
	}

	/**
	 * category에 해당하는 글 목록 가져오기
	 */
	getContentListByCategory(category: string, page: number): Promise<[Boards[], number]> {
		return this.boardsRepository.findAndCount({
			skip: (page - 1) * 10, //시작 인덱스
			take: 10, //페이지 당 갯수
			select: {
				code: true, title: true, writer: true, createdAt: true
			},
			where: {
				category: category,
			},
		});
	}

	/**
	 * 게시판에 게시글을 생성한다
	 */
	async createContent(boardData: BoardsDTO): Promise<BoardsDTO | Boards> {
		console.log(`serviec Called : createContent`)
		const createdContent = await this.boardsRepository.save(boardData);

		return createdContent;
	}
}