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
	 * 중복되는 정보가 있는지 확인 후 게시글을 생성한다
	 */
	async createContent(dto: BoardsDTO): Promise<number> {
		const idCheck: object|null = await this.findWithCode(dto.code);
		
		dto.title = "hash";

		await this.boardsRepository.save(dto);

		return 0; //이미 ID & Nickname 존재
	}
}