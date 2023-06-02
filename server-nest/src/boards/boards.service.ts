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
	async getContentByCode(contentCode: number): Promise<Boards | null> {
		const content = await this.boardsRepository.findOne({
			select: {
				code: true, category: true, title: true, content: true, writer: true, ip: true, createdAt: true, updatedAt: true
			},
			where: {
				code: contentCode,
			},
		});

		return content;
	}

	/**
	 * category에 해당하는 글 목록 가져오기
	 */
	getContentListByCategory(category: string, page: number): Promise<[Boards[], number]> {
		return this.boardsRepository.findAndCount({
			skip: (page - 1) * 10, //시작 인덱스
			take: 10, //페이지 당 갯수
			select: {
				code: true, title: true, writer: true, ip: true, createdAt: true
			},
			where: {
				category: category,
			},
			order: {
				createdAt: "DESC",
				code: "DESC",
			}
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

	/**
	 * 게시판에 게시글을 수정한다
	 */
	async updateContent(boardData: BoardsDTO) {
		console.log(`serviec Called : updateContent`)

		const content = await this.boardsRepository.findOne({
			where: {
				code: boardData.code
			}
		});

		content.title = boardData.title;
		content.content = boardData.content;

		await this.boardsRepository.save(content);
	}

	/**
	 * 게시글을 softDelete한다
	 */
	async softDeleteContent(contentCode: number, contentPassword: string): Promise<boolean>{
		try {
			const contentData = await this.getContentByCode(contentCode);

			if(contentData !== null){
				if(contentData.password === contentPassword){
					this.boardsRepository.softDelete({
						code: contentCode
					});

					return true;
				}
				else{
					return false;
				}
			}
			else{
				return false;
			}
		} catch (error) {
			return false;
		}
	}
}