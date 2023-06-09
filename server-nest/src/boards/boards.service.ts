import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Boards } from './boards.entity';
import { CreateBoardsDTO, UpdateBoardsDTO, DeleteBoardsDTO } from './boards.dto';
import { Replies } from './replies.entity';
import { Cron } from '@nestjs/schedule';
import { CreateRepliesDTO, UpdateRepliesDTO, DeleteRepliesDTO } from './replies.dto';

@Injectable()
export class BoardsService {
	constructor(
		@InjectRepository(Boards) private boardsRepository: Repository<Boards>,
		@InjectRepository(Replies) private repliesRepository: Repository<Replies>,
	) { }

	contentVoteData: Map<number, Array<string>> = new Map();

	//매일 00:00이 되면 데이터 비우기
	@Cron("0 0 0 * * *", {
		name: "resetVoteData",
		timeZone: "Asia/Seoul",
	})
	resetVoteData() {
		this.contentVoteData.clear();
		console.log("[resetVoteData] Called every minute");
	}

	isVotableContent(contentCode: number, ipData: string): boolean{
		const ipArray: Array<string> | undefined = this.contentVoteData.get(contentCode);

		if (ipArray === undefined) {
			this.contentVoteData.set(contentCode, [ipData]);
			return true;
		}
		else if (ipArray.includes(ipData) === false) {
			ipArray.push(ipData);
			this.contentVoteData.set(contentCode, ipArray);
			return true;
		}
		else{
			return false;
		}
	}

	/**
	 * category에 해당하는 글 목록 가져오기
	 */
	getContentListByCategory(category: string, page: number): Promise<[Boards[], number]> {
		return this.boardsRepository.findAndCount({
			skip: (page - 1) * 10, //시작 인덱스
			take: 10, //페이지 당 갯수
			select: {
				code: true,
				title: true,
				hasImage: true,
				view: true,
				upvote: true,
				downvote: true,
				writer: true,
				ip: true,
				createdAt: true
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

		if (type === "password") {
			const contentData = await this.boardsRepository.findOne({
				select: {
					code: true,
					category: true,
					title: true,
					content: true,
					password: true,
					view: true,
					upvote: true,
					downvote: true,
					writer: true,
					ip: true,
					createdAt: true,
					updatedAt: true
				},
				where: {
					code: contentCode,
				},
			});

			return contentData;
		}
		else{
			const contentData = await this.boardsRepository.findOne({
				select: {
					code: true,
					category: true,
					title: true,
					content: true,
					view: true,
					upvote: true,
					downvote: true,
					writer: true,
					ip: true,
					createdAt: true,
					updatedAt: true
				},
				where: {
					code: contentCode,
				},
			});

			return contentData;
		}
	}

	/**
	 * 게시판에 게시글을 생성한다
	 */
	async createContent(contentData: CreateBoardsDTO): Promise<Boards> {
		console.log(`serviec Called : createContent`)
		const createdContent = await this.boardsRepository.save(contentData);

		return createdContent;
	}

	/**
	 * 게시판에 게시글을 수정한다
	 */
	async updateContent(boardData: UpdateBoardsDTO) {
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
	async softDeleteContent(boardData: DeleteBoardsDTO): Promise<boolean>{
		try {
			const result = await this.boardsRepository.findOneBy({ code: boardData.code, password: boardData.password });

			if (result !== null){
				this.boardsRepository.softDelete({
					code: boardData.code
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
	async upvoteContent(contentCode: number): Promise<Boards | null> {
		await this.boardsRepository.increment({ code: contentCode }, "upvote", 1);

		const contentData = await this.boardsRepository.findOne({
			select: {
				upvote: true,
				downvote: true,
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
	async downvoteContent(contentCode: number): Promise<Boards | null> {
		await this.boardsRepository.increment({ code: contentCode }, "downvote", 1);

		const contentData = await this.boardsRepository.findOne({
			select: {
				upvote: true,
				downvote: true,
			},
			where: {
				code: contentCode,
			},
		});

		return contentData;
	}

	/**
	 * 댓글 목록 가져오기
	 */
	async getReplies(contentCode: number, page: number): Promise<[Replies[], number]> {
		const perPage = 50;
		return this.repliesRepository.findAndCount({
			skip: (page - 1) * perPage, //시작 인덱스
			take: perPage, //페이지 당 갯수
			select: {
				code: true,
				parentReplyCode: true,
				level: true,
				content: true,
				upvote: true,
				downvote: true,
				writer: true,
				ip: true,
				createdAt: true,
				deletedAt: true
			},
			where: {
				parentContentCode: contentCode,
			},
			order: {
				replyOrder: "DESC",
				level: "ASC",
				code: "ASC",
			},
			withDeleted: true,
		});
	}

	/**
	 * 댓글 생성
	 */
	async createReply(createRepliesDTO: CreateRepliesDTO): Promise<Replies | null> {
		const contentData = await this.repliesRepository.save(createRepliesDTO);

		if(contentData.level === 0){
			contentData.replyOrder = contentData.code;
		}
		else{
			contentData.replyOrder = contentData.parentReplyCode;
		}
		await this.repliesRepository.save(contentData);

		return contentData;
	}

	/**
	 * 댓글 삭제
	 */
	async deleteReply(deleteRepliesDTO: DeleteRepliesDTO): Promise<boolean> {
		const replyData = await this.repliesRepository.findOne({
			where: {
				code: deleteRepliesDTO.code,
				writer: deleteRepliesDTO.writer,
				password: deleteRepliesDTO.password,
			}
		});

		if (replyData === null){
			return false;
		}
		else{
			await this.repliesRepository.softDelete({
				code: deleteRepliesDTO.code,
				writer: deleteRepliesDTO.writer,
				password: deleteRepliesDTO.password,
			});

			return true;
		}
	}
}