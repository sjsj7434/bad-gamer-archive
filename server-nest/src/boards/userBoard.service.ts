import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Boards } from './boards.entity';
import { CreateBoardsDTO, UpdateBoardsDTO, DeleteBoardsDTO } from './boards.dto';
import { Replies } from './replies.entity';
import { Cron } from '@nestjs/schedule';
import { CreateRepliesDTO, UpdateRepliesDTO, DeleteRepliesDTO } from './replies.dto';

@Injectable()
export class UserBoardService {
	constructor(
		@InjectRepository(Boards) private boardsRepository: Repository<Boards>,
		@InjectRepository(Replies) private repliesRepository: Repository<Replies>,
	) { }

	contentVoteData: Map<number, Array<string>> = new Map();

	//서울 시간 기준으로 [매일 00:00]에 데이터 초기화
	@Cron("0 0 0 * * *", {
		name: "resetAnonymousVoteData",
		timeZone: "Asia/Seoul",
	})
	resetAnonymousVoteData() {
		this.contentVoteData.clear();
		console.log("[resetAnonymousVoteData] Reset data every day at 00:00");
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
	 * 글 목록 가져오기
	 */
	async getContentList(category: string, page: number, perPage: number): Promise<[Boards[], number]> {
		const result = await this.boardsRepository.findAndCount({
			relations: ["replies"], //댓글 정보 join
			select: {
				replies: {code: true},
				code: true,
				writerNickname: true,
				title: true,
				view: true,
				upvote: true,
				downvote: true,
				ip: true,
				hasImage: true,
				createdAt: true,
			},
			where: {
				category: category,
				deletedAt: IsNull(),
			},
			order: {
				code: "DESC",
			},
			withDeleted: true,
			skip: (page - 1) * perPage,
			take: perPage,
		})

		// const result = await this.boardsRepository.findAndCount({
		// 	skip: (page - 1) * 10, //시작 인덱스
		// 	take: 10, //페이지 당 갯수
		// 	select: {
		// 		code: true,
		// 		title: true,
		// 		hasImage: true,
		// 		view: true,
		// 		upvote: true,
		// 		downvote: true,
		// 		writer: true,
		// 		ip: true,
		// 		createdAt: true,
		// 	},
		// 	where: {
		// 		category: category,
		// 	},
		// 	order: {
		// 		createdAt: "DESC",
		// 		code: "DESC",
		// 	}
		// });

		return result;
	}

	/**
	 * code로 1개의 게시글을 찾는다
	 */
	async getContent(contentCode: number, type: string): Promise<Boards | null> {
		if (type === "view"){
			await this.boardsRepository.increment({code: contentCode}, "view", 1);
		}

		if (type === "id") {
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
					writerNickname: true,
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
					writerNickname: true,
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
	async createContent(createBoardsDTO: CreateBoardsDTO) {
		const createdContent = await this.boardsRepository.save(createBoardsDTO);
	}

	/**
	 * 게시판에 게시글을 수정한다
	 */
	async updateContent(boardData: UpdateBoardsDTO) {
		const contentData = await this.boardsRepository.findOne({
			where: {
				code: boardData.code,
				writerID: boardData.writerID,
			}
		});

		if (contentData !== null){
			boardData.updatedAt = new Date();
	
			await this.boardsRepository.save(boardData);
		}

		return contentData;
	}

	/**
	 * 게시글을 softDelete한다
	 */
	async softDeleteContent(deleteBoardsDTO: DeleteBoardsDTO): Promise<boolean>{
		try {
			const result = await this.boardsRepository.findOneBy({ code: deleteBoardsDTO.code, password: deleteBoardsDTO.password });

			if (result !== null){
				this.boardsRepository.softDelete({
					code: deleteBoardsDTO.code
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
				writerNickname: true,
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
	async createReply(createRepliesDTO: CreateRepliesDTO) {
		const contentData = await this.repliesRepository.save(createRepliesDTO);

		if(contentData.level === 0){
			//댓글
			contentData.replyOrder = contentData.code;
		}
		else{
			//답글
			contentData.replyOrder = contentData.parentReplyCode;
		}

		await this.repliesRepository.save(contentData);
	}

	/**
	 * 댓글 삭제
	 */
	async deleteReply(deleteRepliesDTO: DeleteRepliesDTO): Promise<boolean> {
		const replyData = await this.repliesRepository.findOne({
			where: {
				code: deleteRepliesDTO.code,
				writerID: deleteRepliesDTO.writerID,
			}
		});

		if (replyData === null){
			return false;
		}
		else {
			await this.repliesRepository.softDelete({
				code: deleteRepliesDTO.code,
				writerID: deleteRepliesDTO.writerID,
			});

			return true;
		}
	}
}