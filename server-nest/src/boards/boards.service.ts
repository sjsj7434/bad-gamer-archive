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
	 * category에 해당하는 글 목록 가져오기
	 */
	getContentListByCategory(category: string, page: number): Promise<[Boards[], number]> {
		return this.boardsRepository.findAndCount({
			skip: (page - 1) * 10, //시작 인덱스
			take: 10, //페이지 당 갯수
			select: {
				code: true, title: true, view: true, upvote: true, downvote: true, writer: true, ip: true, createdAt: true
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
	 * code로 1개의 게시글을 찾는다
	 */
	async getContentByCode(contentCode: number, type: string): Promise<Boards | null> {
		if (type === "view"){
			await this.boardsRepository.increment({code: contentCode}, "view", 1);
		}

		const contentData = await this.boardsRepository.findOne({
			select: {
				code: true, category: true, title: true, content: true, view: true, upvote: true, downvote: true, writer: true, ip: true, createdAt: true, updatedAt: true
			},
			where: {
				code: contentCode,
			},
		});

		return contentData;
	}

	/**
	 * code로 1개의 게시글을 찾는다
	 */
	async checkContentPassword(boardData: BoardsDTO): Promise<boolean> {
		const contentData = await this.boardsRepository.findOne({
			select: {
				writer: true, password: true
			},
			where: {
				code: boardData.code,
			},
		});

		let isCorrect = false;

		if (contentData !== null) {
			if (contentData.password === boardData.password) {
				isCorrect = true;
			}
		}

		return isCorrect;
	}

	/**
	 * 게시판에 게시글을 생성한다
	 */
	async createContent(contentData: BoardsDTO): Promise<BoardsDTO | Boards> {
		console.log(`serviec Called : createContent`)
		const createdContent = await this.boardsRepository.save(contentData);

		return createdContent;
	}

	/**
	 * 게시판에 게시글을 수정한다
	 */
	async updateContent(boardData: BoardsDTO) {
		const contentData = await this.boardsRepository.findOne({
			where: {
				code: boardData.code,
				password: boardData.password,
			}
		});

		if (contentData !== null){
			contentData.title = boardData.title;
			contentData.content = boardData.content;
			contentData.updatedAt = new Date(); //기본 값을 NULL로 삽입하기
	
			await this.boardsRepository.save(contentData);
		}

		return contentData;
	}

	/**
	 * 게시글을 softDelete한다
	 */
	async softDeleteContent(contentCode: number, contentPassword: string): Promise<boolean>{
		try {
			const contentData = new BoardsDTO();
			contentData.code = contentCode;
			contentData.password = contentPassword;

			const result = await this.checkContentPassword(contentData);

			if (result === true){
				this.boardsRepository.softDelete({
					code: contentCode
				});

				return true;
			}
			else{
				return false;
			}
		} catch (error) {
			return false;
		}
	}

	/**
	 * code로 1개의 게시글 upvote
	 */
	async upvoteContent(contentCode: number, type: string): Promise<Boards | null> {
		if (type === "cancel") {
			await this.boardsRepository.increment({ code: contentCode }, "upvote", -1);
		}
		else {
			await this.boardsRepository.increment({ code: contentCode }, "upvote", 1);
		}

		const contentData = await this.boardsRepository.findOne({
			select: {
				upvote: true, downvote: true,
			},
			where: {
				code: contentCode,
			},
		});

		return contentData;
	}

	/**
	 * code로 1개의 게시글 downvote
	 */
	async downvoteContent(contentCode: number, type: string): Promise<Boards | null> {
		if (type === "cancel") {
			await this.boardsRepository.increment({ code: contentCode }, "downvote", -1);
		}
		else {
			await this.boardsRepository.increment({ code: contentCode }, "downvote", 1);
		}

		const contentData = await this.boardsRepository.findOne({
			select: {
				upvote: true, downvote: true,
			},
			where: {
				code: contentCode,
			},
		});

		return contentData;
	}
}