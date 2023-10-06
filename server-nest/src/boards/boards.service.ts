import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, MoreThanOrEqual, Between } from 'typeorm';
import { Boards } from './boards.entity';
import { Replies } from './replies.entity';
import { CreateBoardsDTO, UpdateBoardsDTO, DeleteBoardsDTO } from './boards.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateRepliesDTO, DeleteRepliesDTO } from './replies.dto';

@Injectable()
export class BoardsService {
	constructor(
		@InjectRepository(Boards) private boardsRepository: Repository<Boards>,
		@InjectRepository(Replies) private repliesRepository: Repository<Replies>,
	) { }

	contentVoteData: Map<number, Array<string>> = new Map();

	//서울 시간 기준으로 [매일 00:00]에 데이터 초기화
	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
		name: "resetAnonymousVoteData",
		timeZone: "Asia/Seoul",
	})
	resetAnonymousVoteData() {
		this.contentVoteData.clear();
		console.log("[resetAnonymousVoteData] Reset data every day at 00:00");
	}

	isVotableContent(contentCode: number, ipData: string): boolean {
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
		else {
			return false;
		}
	}

	/**
	 * 검색 날짜 범위 설정
	 * @param type 검색 타입
	 * @returns Date
	 */
	setSearchDate(type: string): Date {
		const dateOfNow = new Date();
		const yearNow = dateOfNow.getFullYear();
		const monthNow = dateOfNow.getMonth();
		const dayNow = dateOfNow.getDate();

		const allTime: Date = new Date(2023, 1, 1); //전체
		const yearly: Date = new Date(yearNow - 1, monthNow, dayNow); //연간
		const monthly: Date = new Date(yearNow, monthNow - 1, dayNow); //월간
		const weekly: Date = new Date(yearNow, monthNow, dayNow - 7); //주간
		const daily: Date = new Date(yearNow, monthNow, dayNow - 1); //일간
		let searchDate: Date = null;

		switch (type) {
			case "allTime":
				searchDate = allTime;
				break;
			case "yearly":
				searchDate = yearly;
				break;
			case "monthly":
				searchDate = monthly;
				break;
			case "weekly":
				searchDate = weekly;
				break;
			case "daily":
				searchDate = daily;
				break;
			default:
				searchDate = monthly;
				break;
		}

		return searchDate;
	}

	/**
	 * 글 목록 가져오기
	 */
	async getUpvoteTrend(upvoteCutline: number, page: number, perPage: number, type: string): Promise<[Boards[], number]> {
		let searchDate: Date = this.setSearchDate(type);

		const result = await this.boardsRepository.findAndCount({
			relations: ["replies"], //댓글 정보 join
			select: {
				replies: { code: true },
				code: true,
				category: true,
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
				deletedAt: IsNull(),
				upvote: MoreThanOrEqual(upvoteCutline),
				createdAt: Between(searchDate, new Date()),
			},
			order: {
				upvote: "DESC",
				view: "DESC",
				createdAt: "DESC",
			},
			withDeleted: true,
			skip: (page - 1) * perPage,
			take: perPage,
		})

		return result;
	}

	/**
	 * 글 목록 가져오기
	 */
	async getDownvoteTrend(downvoteCutline: number, page: number, perPage: number, type: string): Promise<[Boards[], number]> {
		let searchDate: Date = this.setSearchDate(type);

		const result = await this.boardsRepository.findAndCount({
			relations: ["replies"], //댓글 정보 join
			select: {
				replies: { code: true },
				code: true,
				category: true,
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
				deletedAt: IsNull(),
				downvote: MoreThanOrEqual(downvoteCutline),
				createdAt: Between(searchDate, new Date()),
			},
			order: {
				downvote: "DESC",
				view: "DESC",
				createdAt: "DESC",
			},
			withDeleted: true,
			skip: (page - 1) * perPage,
			take: perPage,
		})

		return result;
	}

	/**
	 * 글 목록 가져오기
	 */
	async getViewTrend(viewCutline: number, page: number, perPage: number, type: string): Promise<[Boards[], number]> {
		let searchDate: Date = this.setSearchDate(type);

		const result = await this.boardsRepository.findAndCount({
			relations: ["replies"], //댓글 정보 join
			select: {
				replies: { code: true },
				code: true,
				category: true,
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
				deletedAt: IsNull(),
				view: MoreThanOrEqual(viewCutline),
				createdAt: Between(searchDate, new Date()),
			},
			order: {
				view: "DESC",
				upvote: "DESC",
				downvote: "ASC",
				createdAt: "DESC",
			},
			withDeleted: true,
			skip: (page - 1) * perPage,
			take: perPage,
		})

		return result;
	}

	//=================================================================================================================================================================================

	/**
	 * 글 목록 가져오기
	 */
	async getContentList(category: string, page: number, perPage: number): Promise<[Boards[], number]> {
		const result = await this.boardsRepository.findAndCount({
			relations: ["replies"], //댓글 정보 join
			select: {
				replies: { code: true },
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

		return result;
	}

	/**
	 * code로 1개의 게시글을 찾는다
	 */
	async getContent(contentCode: number, category: string, type: string): Promise<Boards> {
		if (type === "author") {
			const contentData = await this.boardsRepository.findOne({
				select: {
					code: true,
					password: true,
					writerID: true,
					writerNickname: true,
				},
				where: {
					code: contentCode,
					category: category,
				},
			});

			return contentData;
		}
		else if (type === "view" || type === "edit") {
			if (type === "view") {
				await this.boardsRepository.increment({ code: contentCode }, "view", 1);
			}

			const contentData = await this.boardsRepository.findOne({
				select: {
					code: true,
					category: true,
					title: true,
					content: true,
					view: true,
					upvote: true,
					downvote: true,
					writerID: true,
					writerNickname: true,
					ip: true,
					createdAt: true,
					updatedAt: true,
				},
				where: {
					code: contentCode,
					category: category,
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
	async updateContent(boardData: UpdateBoardsDTO): Promise<Boolean> {
		const contentData = await this.boardsRepository.findOne({
			where: {
				code: boardData.code,
				category: boardData.category,
				password: boardData.password,
				writerID: boardData.writerID,
			}
		});

		if (contentData !== null) {
			boardData.updatedAt = new Date();

			await this.boardsRepository.save(boardData);

			return true;
		}
		else {
			return false;
		}
	}

	/**
	 * 게시글을 softDelete한다
	 */
	async softDeleteContent(deleteBoardsDTO: DeleteBoardsDTO, category: string, writerID: string): Promise<Boolean> {
		try {
			const result = await this.boardsRepository.findOneBy(
				{
					code: deleteBoardsDTO.code,
					category: category,
					password: deleteBoardsDTO.password,
					writerID: writerID,
				}
			);

			if (result !== null) {
				this.boardsRepository.softDelete({
					code: deleteBoardsDTO.code
				});

				return true;
			}
			else {
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
	async createReply(createRepliesDTO: CreateRepliesDTO, category: string): Promise<Boolean> {
		//부모 게시글의 코드만 바꿔서 요청이 들어오면 비로그인 유저가 로그인 전용 게시글에 댓글을 익명으로 남길 수 있게됨
		//댓글 저장 전에 부모 게시글의 정보 확인
		const contentData = await this.boardsRepository.exist({
			where: {
				code: createRepliesDTO.parentContentCode,
				category: category,
			},
		});

		if (contentData === true) {
			const replyData = await this.repliesRepository.save(createRepliesDTO);

			if (replyData.level === 0) {
				//댓글
				replyData.replyOrder = replyData.code;
			}
			else {
				//답글
				replyData.replyOrder = replyData.parentReplyCode;
			}

			await this.repliesRepository.save(replyData);

			return true;
		}
		else {
			return false;
		}
	}

	/**
	 * 댓글 삭제
	 */
	async deleteReply(deleteRepliesDTO: DeleteRepliesDTO, writerID: string): Promise<boolean> {
		const replyData = await this.repliesRepository.findOne({
			where: {
				code: deleteRepliesDTO.code,
				writerID: writerID,
				password: deleteRepliesDTO.password,
			}
		});

		if (replyData === null) {
			return false;
		}
		else {
			await this.repliesRepository.softDelete({
				code: deleteRepliesDTO.code,
				writerID: writerID,
				password: deleteRepliesDTO.password,
			});

			return true;
		}
	}
}