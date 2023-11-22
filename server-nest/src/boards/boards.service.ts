import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, MoreThanOrEqual, Between, Equal, In } from 'typeorm';
import { Boards } from './boards.entity';
import { Replies } from './replies.entity';
import { CreateBoardsDTO, UpdateBoardsDTO, DeleteBoardsDTO } from './boards.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateRepliesDTO, DeleteRepliesDTO } from './replies.dto';
import { AccountsService } from 'src/accounts/accounts.service';
import { Request, Response } from 'express';
import { ErrorLogService } from 'src/log/error.log.service';
import { VoteHistory } from './voteHistory.entity';

@Injectable()
export class BoardsService {
	constructor(
		@InjectRepository(Boards) private boardsRepository: Repository<Boards>,
		@InjectRepository(Replies) private repliesRepository: Repository<Replies>,
		@InjectRepository(VoteHistory) private voteHistoryRepository: Repository<VoteHistory>,
		private accountsService: AccountsService,
		private errorLogService: ErrorLogService,
	) { }

	private VOTE_HISTORY: Map<number, Array<string>> = new Map();
	private REPlY_MAX_LENG: number = 300; //댓글 글자 수 제한
	private REPlY_MAX_ROW: number = 10; //댓글 줄 수 제한
	private HOW_MANY_CONTENTS_ON_LIST: number = 20;

	//서울 시간 기준으로 [매일 00:00]에 데이터 초기화
	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
		name: "resetAnonymousVoteData",
		timeZone: "Asia/Seoul",
	})
	resetAnonymousVoteData() {
		this.VOTE_HISTORY.clear();
		console.log("[익명 추천 초기화] Reset data every day at 00:00");
	}

	isVotableContent(contentCode: number, ipData: string): boolean {
		try {
			const ipArray: Array<string> | undefined = this.VOTE_HISTORY.get(contentCode);

			if (ipArray === undefined) {
				this.VOTE_HISTORY.set(contentCode, [ipData]);
				return true;
			}
			else if (ipArray.includes(ipData) === false) {
				ipArray.push(ipData);
				this.VOTE_HISTORY.set(contentCode, ipArray);
				return true;
			}
			else {
				return false;
			}
		}
		catch (error) {
			this.errorLogService.createErrorLog(error);
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
	 * 추천 트랜드 게시글 목록 가져오기
	 */
	async getUpvoteTrend(page: number, type: string): Promise<[Boards[], number]> {
		try {
			const searchDate: Date = this.setSearchDate(type);
			const perPage: number = 10;
			const upvoteCutline: number = 1;

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
					category: In(["anonymous", "user"]),
				},
				order: {
					upvote: "DESC",
					view: "DESC",
					createdAt: "DESC",
				},
				withDeleted: true,
				skip: (page - 1) * perPage,
				take: perPage,
			});

			return result;
		}
		catch (error) {
			this.errorLogService.createErrorLog(error);
		}
	}

	/**
	 * 비추천 트랜드 게시글 목록 가져오기
	 */
	async getDownvoteTrend(page: number, type: string): Promise<[Boards[], number]> {
		const searchDate: Date = this.setSearchDate(type);
		const perPage: number = 10;
		const downvoteCutline: number = 1;

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
				category: In(["anonymous", "user"]),
			},
			order: {
				downvote: "DESC",
				view: "DESC",
				createdAt: "DESC",
			},
			withDeleted: true,
			skip: (page - 1) * perPage,
			take: perPage,
		});

		return result;
	}

	/**
	 * 조회 트랜드 게시글 목록 가져오기
	 */
	async getViewTrend(page: number, type: string): Promise<[Boards[], number]> {
		const searchDate: Date = this.setSearchDate(type);
		const perPage: number = 10;
		const viewCutline: number = 1;

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
				category: In(["anonymous", "user"]),
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
		});

		return result;
	}

	//=================================================================================================================================================================================

	/**
	 * 익명 게시판 목록 가져오기
	 */
	async getAnonymousContentList(page: number): Promise<[Boards[], number]> {
		try {
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
					category: Equal("anonymous"),
					deletedAt: IsNull(),
				},
				order: {
					code: "DESC",
				},
				withDeleted: true,
				skip: (page - 1) * this.HOW_MANY_CONTENTS_ON_LIST,
				take: this.HOW_MANY_CONTENTS_ON_LIST,
			});

			if (result !== null) {
				//ip 전체 노출하지 않고 앞부분만 노출
				for (let index: number = 0; index < result[0].length; index++) {
					result[0][index]["ip"] = result[0][index]["ip"].split(".")[0] + (result[0][index]["ip"].split(".")[1] !== undefined ? "." + result[0][index]["ip"].split(".")[1] : "");
				}
			}

			return result;
		}
		catch (error) {
			this.errorLogService.createErrorLog(error);
		}
	}

	/**
	 * 유저 게시판 목록 가져오기
	 */
	async getUserContentList(page: number): Promise<[Boards[], number]> {
		/*
		const queryOBJ = this.boardsRepository
		.createQueryBuilder("boards")
		.leftJoinAndSelect("boards.replies", "replies", "replies.parentContentCode = boards.code")
		.leftJoinAndSelect("boards.accounts", "accounts", "accounts.id = boards.writerID")
		.innerJoinAndSelect("accounts.authentication", "authentication", "authentication.uuid = accounts.uuid AND authentication.type = 'lostark_item_level'")

		.select("boards.code", "code")
		.addSelect("boards.writerNickname", "writerNickname")
		.addSelect("boards.title", "title")
		.addSelect("boards.view", "view")
		.addSelect("boards.upvote", "upvote")
		.addSelect("boards.downvote", "downvote")
		.addSelect("boards.hasImage", "hasImage")
		.addSelect("boards.createdAt", "createdAt")
		.addSelect("REPLACE(authentication.data, ',', '')", 'simpleItemLevel')
		.addSelect("COUNT(replies.code)", "repliesCount")

		.where("boards.category = :category", { category: "user" })
		.groupBy(`
			boards.code
			, boards.writerNickname
			, boards.title
			, boards.view
			, boards.upvote
			, boards.downvote
			, boards.hasImage
			, boards.createdAt
		`)
		.orderBy("boards.code", "DESC")
		.withDeleted()
		.skip((page - 1) * this.HOW_MANY_CONTENTS_ON_LIST)
		.take(this.HOW_MANY_CONTENTS_ON_LIST)

		// const queryData = queryOBJ.getSql();
		// console.log(queryData)

		const result3 = await queryOBJ.getRawMany(); // getMany를 하게 되면 entity와 같은 값만 나옴, getRawMany를 해야 위와 같은 연산 처리가 가능하다.
		console.log(result3)

		// return result2;
		return [result3, result3.length];
		*/


		const result = await this.boardsRepository.findAndCount({
			relations: ["replies", "accounts", "accounts.authentication"], //댓글 정보 join
			select: {
				replies: { code: true },
				accounts: { email: true, authentication: { type: true, data: true } },
				code: true,
				writerNickname: true,
				title: true,
				view: true,
				upvote: true,
				downvote: true,
				hasImage: true,
				createdAt: true,
			},
			where: {
				category: Equal("user"),
				deletedAt: IsNull(),
				accounts: {
					authentication: [
						{ type: Equal("lostark_item_level") },
						{ type: IsNull() },
					]
				}
			},
			order: {
				code: "DESC",
			},
			withDeleted: true,
			skip: (page - 1) * this.HOW_MANY_CONTENTS_ON_LIST,
			take: this.HOW_MANY_CONTENTS_ON_LIST,
		});

		return result;
	}
	
	/**
	 * 익명 게시판 글 읽기, 조회수 + 1
	 */
	async readAnonymousContent(contentCode: number): Promise<{ contentData: Boards, isWriter: boolean }> {
		if (isNaN(contentCode) === true) {
			return null;
		}

		let isAuthor: boolean = false;

		await this.boardsRepository.increment({ code: contentCode }, "view", 1);

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
				code: Equal(contentCode),
				category: Equal("anonymous"),
			},
		});

		if (contentData !== null) {
			contentData.ip = contentData.ip.split(".")[0] + (contentData.ip.split(".")[1] !== undefined ? "." + contentData.ip.split(".")[1] : "");
			isAuthor = contentData.writerID === "";
		}

		return { contentData: contentData, isWriter: isAuthor };
	}

	/**
	 * 익명 게시판 글 데이터 가져오기
	 */
	async getAnonymousContentData(contentCode: number): Promise<{ contentData: Boards, isWriter: boolean }> {
		if (isNaN(contentCode) === true) {
			return null;
		}

		let isAuthor: boolean = false;

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
				code: Equal(contentCode),
				category: Equal("anonymous"),
			},
		});

		if (contentData !== null) {
			contentData.ip = contentData.ip.split(".")[0] + (contentData.ip.split(".")[1] !== undefined ? "." + contentData.ip.split(".")[1] : "");
			isAuthor = contentData.writerID === "";
		}

		return { contentData: contentData, isWriter: isAuthor };
	}

	/**
	 * 유저 게시판 글 읽기, 조회수 + 1
	 */
	async readUserContent(request: Request, response: Response, contentCode: number): Promise<{ contentData: Boards, isWriter: boolean }> {
		const loginCookie = await this.accountsService.checkLoginStatus(request, response);

		if (isNaN(contentCode) === true) {
			return null;
		}

		let isAuthor: boolean = false;

		await this.boardsRepository.increment({ code: contentCode }, "view", 1);

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
				code: Equal(contentCode),
				category: Equal("user"),
			},
		});

		if (contentData !== null) {
			isAuthor = contentData.writerID === loginCookie.id;
		}

		return { contentData: contentData, isWriter: isAuthor };
	}

	/**
	 * 유저 게시판 글 데이터 가져오기
	 */
	async getUserContentData(request: Request, response: Response, contentCode: number): Promise<{ contentData: Boards, isWriter: boolean }> {
		const loginCookie = await this.accountsService.checkLoginStatus(request, response);

		if (isNaN(contentCode) === true) {
			return null;
		}

		let isAuthor: boolean = false;

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
				code: Equal(contentCode),
				category: Equal("user"),
			},
		});

		if (contentData !== null) {
			// contentData.ip = contentData.ip.split(".")[0] + (contentData.ip.split(".")[1] !== undefined ? "." + contentData.ip.split(".")[1] : "");
			isAuthor = contentData.writerID === loginCookie.id;
		}

		return { contentData: contentData, isWriter: isAuthor };
	}

	/**
	 * 익명 게시글 작성자 확인
	 */
	async isAnonymousAuthor(inputCode: number, inputPassword: string): Promise<boolean> {
		if (isNaN(inputCode) === true) {
			return false;
		}

		const isExists = await this.boardsRepository.exist({
			select: {
				code: true,
			},
			where: {
				code: Equal(inputCode),
				category: Equal("anonymous"),
				password: Equal(inputPassword),
			},
		});

		return isExists;
	}

	/**
	 * 유저 게시글 작성자 확인
	 */
	async isUserAuthor(request: Request, response: Response, code: number): Promise<boolean> {
		const loginCookie = await this.accountsService.checkLoginStatus(request, response);

		if (loginCookie.status === "login") {
			if (isNaN(code) === true) {
				return false;
			}

			const isExists = await this.boardsRepository.exist({
				select: {
					code: true,
					writerID: true,
				},
				where: {
					code: Equal(code),
					category: Equal("user"),
					writerID: Equal(loginCookie.id),
				},
			});

			return isExists;
		}
		else {
			return false;
		}
	}

	/**
	 * 익명 게시판에 게시글을 생성한다
	 */
	async createAnonymousContent(createBoardsDTO: CreateBoardsDTO, ipData: string) {
		createBoardsDTO.category = "anonymous";
		createBoardsDTO.writerID = "";
		createBoardsDTO.writerNickname = "";
		createBoardsDTO.ip = ipData; //개발서버에서는 로컬만 찍혀서 임시로 비활성
		createBoardsDTO.ip = Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5);

		await this.boardsRepository.save(createBoardsDTO);
	}

	/**
	 * 유저 게시판에 게시글을 생성한다
	 */
	async createUserContent(createBoardsDTO: CreateBoardsDTO, ipData: string, request: Request, response: Response) {
		const loginCookie = await this.accountsService.checkLoginStatus(request, response);

		if (loginCookie.status === "login") {
			createBoardsDTO.category = "user";
			createBoardsDTO.writerID = loginCookie.id;
			createBoardsDTO.writerNickname = loginCookie.nickname;
			createBoardsDTO.ip = ipData; //개발서버에서는 로컬만 찍혀서 임시로 비활성
			createBoardsDTO.ip = Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5);

			await this.boardsRepository.save(createBoardsDTO);

			return true;
		}
		else {
			return false;
		}
	}

	/**
	 * 익명 게시판에 글을 수정한다
	 */
	async updateAnonymousContent(boardData: UpdateBoardsDTO): Promise<boolean> {
		const isExists = await this.boardsRepository.exist({
			where: {
				code: Equal(boardData.code),
				category: Equal("anonymous"),
				password: Equal(boardData.password),
				writerID: Equal(""),
			}
		});

		if (isExists === true) {
			// boardData.updatedAt = new Date(); //update 날짜 수정

			await this.boardsRepository.save(boardData);
		}

		return isExists;
	}

	/**
	 * 유저 게시판에 글을 수정한다
	 */
	async updateUserContent(request: Request, response: Response, updateBoardsDTO: UpdateBoardsDTO): Promise<boolean> {
		const loginCookie = await this.accountsService.checkLoginStatus(request, response);

		if (loginCookie.status === "login") {
			if (loginCookie.id !== updateBoardsDTO.writerID) {
				//위의 값이 아니면 누군가 값을 조작하여 전송했을 가능성이 있으므로 게시글 저장 차단
				return false;
			}

			updateBoardsDTO.writerID = loginCookie.id;

			const isExists = await this.boardsRepository.exist({
				where: {
					code: Equal(updateBoardsDTO.code),
					category: Equal("user"),
					password: Equal(""),
					writerID: Equal(updateBoardsDTO.writerID),
				}
			});

			if (isExists === true) {
				// updateBoardsDTO.updatedAt = new Date(); //update 날짜 수정

				await this.boardsRepository.save(updateBoardsDTO);
			}

			return isExists;
		}
		else {
			return false;
		}
	}

	/**
	 * 익명 게시판 글을 softDelete한다
	 */
	async softDeleteAnonymousContent(deleteBoardsDTO: DeleteBoardsDTO): Promise<boolean> {
		const isExists = await this.boardsRepository.exist({
			where: {
				code: Equal(deleteBoardsDTO.code),
				category: Equal("anonymous"),
				password: Equal(deleteBoardsDTO.password),
				writerID: Equal(""),
			}
		});

		if (isExists === true) {
			await this.boardsRepository.softDelete({
				code: Equal(deleteBoardsDTO.code)
			});
		}

		return isExists;
	}

	/**
	 * 유저 게시판 글을 softDelete한다
	 */
	async softDeleteUserContent(request: Request, response: Response, deleteBoardsDTO: DeleteBoardsDTO): Promise<boolean> {
		const loginCookie = await this.accountsService.checkLoginStatus(request, response);

		if (loginCookie.status === "login") {
			const isExists = await this.boardsRepository.exist({
				where: {
					code: Equal(deleteBoardsDTO.code),
					category: Equal("user"),
					password: Equal(""),
					writerID: Equal(loginCookie.id),
				}
			});

			if (isExists === true) {
				await this.boardsRepository.softDelete({
					code: Equal(deleteBoardsDTO.code)
				});
			}

			return isExists;
		}
		else {
			return false;
		}
	}

	/**
	 * 익명 게시판 글 추천
	 */
	async upvoteAnonymousContent(contentCode: number, ipData: string): Promise<{ upvote: number, downvote: number, isVotable: boolean }> {
		const isVotable: boolean = this.isVotableContent(contentCode, ipData);

		if (isVotable === true) {
			await this.boardsRepository.increment({ code: Equal(contentCode), category: Equal("anonymous") }, "upvote", 1);
		}

		const contentData = await this.boardsRepository.findOne({
			select: {
				upvote: true,
				downvote: true,
			},
			where: {
				code: Equal(contentCode),
				category: Equal("anonymous"),
			},
		});

		return { upvote: contentData.upvote, downvote: contentData.downvote, isVotable: isVotable };
	}

	/**
	 * 익명 게시판 글 비추천
	 */
	async downvoteAnonymousContent(contentCode: number, ipData: string): Promise<{ upvote: number, downvote: number, isVotable: boolean }> {
		const isVotable: boolean = this.isVotableContent(contentCode, ipData);

		if (isVotable === true) {
			await this.boardsRepository.increment({ code: Equal(contentCode), category: Equal("anonymous") }, "downvote", 1);
		}

		const contentData = await this.boardsRepository.findOne({
			select: {
				upvote: true,
				downvote: true,
			},
			where: {
				code: Equal(contentCode),
				category: Equal("anonymous"),
			},
		});

		return { upvote: contentData.upvote, downvote: contentData.downvote, isVotable: isVotable };
	}

	/**
	 * 유저 게시판 글 추천
	 */
	async upvoteUserContent(request: Request, response: Response, contentCode: number, ipData: string): Promise<{ upvote: number, downvote: number, isVotable: boolean }> {
		const isVotable: boolean = this.isVotableContent(contentCode, ipData);
		const loginCookie = await this.accountsService.checkLoginStatus(request, response);

		if (isVotable === true && loginCookie !== null) {
			await this.boardsRepository.increment({ code: Equal(contentCode), category: Equal("user") }, "upvote", 1);
			
			const insertHistory = this.voteHistoryRepository.create({
				parentContentCode: contentCode,
				voteType: "up",
				writerID: loginCookie.id,
				writerNickname: loginCookie.nickname,
				ip: ipData,
			});
			await this.voteHistoryRepository.insert(insertHistory);
		}

		const contentData = await this.boardsRepository.findOne({
			select: {
				upvote: true,
				downvote: true,
			},
			where: {
				code: Equal(contentCode),
				category: Equal("user"),
			},
		});

		return { upvote: contentData.upvote, downvote: contentData.downvote, isVotable: isVotable };
	}

	/**
	 * 유저 게시판 글 비추천
	 */
	async downvoteUserContent(request: Request, response: Response, contentCode: number, ipData: string): Promise<{ upvote: number, downvote: number, isVotable: boolean }> {
		const isVotable: boolean = this.isVotableContent(contentCode, ipData);
		const loginCookie = await this.accountsService.checkLoginStatus(request, response);

		if (isVotable === true) {
			await this.boardsRepository.increment({ code: Equal(contentCode), category: Equal("user") }, "downvote", 1);

			const insertHistory = this.voteHistoryRepository.create({
				parentContentCode: contentCode,
				voteType: "down",
				writerID: loginCookie.id,
				writerNickname: loginCookie.nickname,
				ip: ipData,
			});
			await this.voteHistoryRepository.insert(insertHistory);
		}

		const contentData = await this.boardsRepository.findOne({
			select: {
				upvote: true,
				downvote: true,
			},
			where: {
				code: Equal(contentCode),
				category: Equal("user"),
			},
		});

		return { upvote: contentData.upvote, downvote: contentData.downvote, isVotable: isVotable };
	}

	/**
	 * 유저 게시판 추천 목록 확인
	 */
	async getUserContentUpvoteList(request: Request, response: Response, contentCode: number): Promise<{ writerNickname: string, createdAt: Date }> {
		// const loginCookie = await this.accountsService.checkLoginStatus(request, response);

		const contentData = await this.voteHistoryRepository.findOne({
			select: {
				writerNickname: true,
				createdAt: true,
			},
			where: {
				parentContentCode: Equal(contentCode),
				voteType: Equal("up"),
			},
		});

		return { writerNickname: contentData.writerNickname, createdAt: contentData.createdAt };
	}

	/**
	 * 익명 게시판 댓글 목록 가져오기
	 */
	async getAnonymousReplies(contentCode: number, page: number): Promise<[Replies[], number]> {
		const perPage = 50;

		const repliesData = await this.repliesRepository.findAndCount({
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
				parentContentCode: Equal(contentCode),
			},
			order: {
				replyOrder: "DESC",
				level: "ASC",
				code: "ASC",
			},
			withDeleted: true,
		});

		if (repliesData[1] !== 0) {
			for (let index: number = 0; index < repliesData[0].length; index++) {
				if (repliesData[0][index]["deletedAt"] !== null) {
					repliesData[0][index]["content"] = new Date(repliesData[0][index]["deletedAt"]).toLocaleString("sv-SE") + " 삭제되었습니다";
				}
			}
		}

		return repliesData;
	}

	/**
	 * 유저 게시판 댓글 목록 가져오기
	 */
	async getUserReplies(contentCode: number, page: number): Promise<[Replies[], number]> {
		const perPage = 50;

		const repliesData = await this.repliesRepository.findAndCount({
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
				parentContentCode: Equal(contentCode),
			},
			order: {
				replyOrder: "DESC",
				level: "ASC",
				code: "ASC",
			},
			withDeleted: true,
		});

		if (repliesData[1] !== 0) {
			for (let index: number = 0; index < repliesData[0].length; index++) {
				if (repliesData[0][index]["deletedAt"] !== null) {
					repliesData[0][index]["content"] = new Date(repliesData[0][index]["deletedAt"]).toLocaleString("sv-SE") + " 삭제되었습니다";
				}
			}
		}

		return repliesData;
	}

	/**
	 * 익명 게시판 댓글 생성
	 */
	async createAnonymousReply(createRepliesDTO: CreateRepliesDTO, ipData: string): Promise<boolean> {
		//부모 게시글의 코드만 바꿔서 요청이 들어오면 비로그인 유저가 로그인 전용 게시글에 댓글을 익명으로 남길 수 있게됨
		//댓글 저장 전에 부모 게시글의 정보 확인
		if (createRepliesDTO.content === "") {
			return false;
		}
		else if (createRepliesDTO.content.length > this.REPlY_MAX_LENG) {
			return false;
		}
		else if (createRepliesDTO.content.split("\n").length > this.REPlY_MAX_ROW) {
			return false;
		}
		
		if (createRepliesDTO.level === 0) {
			createRepliesDTO.parentReplyCode = 0;
		}
		createRepliesDTO.writerID = "";
		createRepliesDTO.writerNickname = "";
		createRepliesDTO.replyOrder = 0;
		createRepliesDTO.ip = ipData;
		createRepliesDTO.ip = Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5);

		const contentData = await this.boardsRepository.exist({
			where: {
				code: Equal(createRepliesDTO.parentContentCode),
				category: Equal("anonymous"),
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
	 * 유저 게시판 댓글 생성
	 */
	async createUserReply(request: Request, response: Response, createRepliesDTO: CreateRepliesDTO, ipData: string): Promise<boolean> {
		//부모 게시글의 코드만 바꿔서 요청이 들어오면 비로그인 유저가 로그인 전용 게시글에 댓글을 익명으로 남길 수 있게됨
		//댓글 저장 전에 부모 게시글의 정보 확인
		if (createRepliesDTO.content === ""){
			return false;
		}
		else if (createRepliesDTO.content.length > this.REPlY_MAX_LENG) {
			return false;
		}
		else if (createRepliesDTO.content.split("\n").length > this.REPlY_MAX_ROW) {
			return false;
		}

		const loginCookie = await this.accountsService.checkLoginStatus(request, response);

		if (loginCookie.status === "login") {
			createRepliesDTO.writerID = loginCookie.id;
			createRepliesDTO.writerNickname = loginCookie.nickname;
			createRepliesDTO.replyOrder = 0;

			if (createRepliesDTO.level === 0) {
				createRepliesDTO.parentReplyCode = 0;
			}

			createRepliesDTO.ip = ipData;
			createRepliesDTO.ip = Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5);

			const contentData = await this.boardsRepository.exist({
				where: {
					code: Equal(createRepliesDTO.parentContentCode),
					category: Equal("user"),
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
		else {
			return false;
		}
	}

	/**
	 * 익명 게시판 댓글 삭제
	 */
	async deleteAnonymousReply(deleteRepliesDTO: DeleteRepliesDTO): Promise<boolean> {
		const isExists = await this.repliesRepository.exist({
			where: {
				code: Equal(deleteRepliesDTO.code),
				writerID: Equal(""),
				password: Equal(deleteRepliesDTO.password),
			}
		});

		if (isExists === true) {
			await this.repliesRepository.softDelete({
				code: Equal(deleteRepliesDTO.code),
				writerID: Equal(""),
				password: Equal(deleteRepliesDTO.password),
			});
		}

		return isExists;
	}

	/**
	 * 유저 게시판 댓글 삭제
	 */
	async deleteUserReply(request: Request, response: Response, deleteRepliesDTO: DeleteRepliesDTO): Promise<boolean> {
		const loginCookie = await this.accountsService.checkLoginStatus(request, response);

		if (loginCookie.status !== "login") {
			return false;
		}
		
		const replyData = await this.repliesRepository.exist({
			where: {
				code: Equal(deleteRepliesDTO.code),
				writerID: Equal(loginCookie.id),
				password: Equal(deleteRepliesDTO.password),
			}
		});

		if (replyData === false) {
			return false;
		}
		else {
			await this.repliesRepository.softDelete({
				code: Equal(deleteRepliesDTO.code),
				writerID: Equal(loginCookie.id),
				password: Equal(deleteRepliesDTO.password),
			});

			return true;
		}
	}

	//===================================

	/**
	 * 공지 게시판 목록 가져오기
	 */
	async getAnnouncementContentList(page: number): Promise<[Boards[], number]> {
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
				hasImage: true,
				createdAt: true,
			},
			where: {
				category: Equal("announcement"),
				deletedAt: IsNull(),
			},
			order: {
				code: "DESC",
			},
			withDeleted: true,
			skip: (page - 1) * this.HOW_MANY_CONTENTS_ON_LIST,
			take: this.HOW_MANY_CONTENTS_ON_LIST,
		});

		return result;
	}

	/**
	 * 공지 게시판 글 읽기, 조회수 + 1
	 */
	async readAnnouncementContent(request: Request, response: Response, contentCode: number): Promise<{ contentData: Boards, isWriter: boolean }> {
		if (isNaN(contentCode) === true) {
			return null;
		}

		await this.boardsRepository.increment({ code: contentCode }, "view", 1);

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
				code: Equal(contentCode),
				category: Equal("announcement"),
			},
		});

		return { contentData: contentData, isWriter: false };
	}

	/**
	 * 공지 게시판 글 추천
	 */
	async upvoteAnnouncementContent(contentCode: number, ipData: string): Promise<{ upvote: number, downvote: number, isVotable: boolean }> {
		const isVotable: boolean = this.isVotableContent(contentCode, ipData);

		if (isVotable === true) {
			await this.boardsRepository.increment({ code: Equal(contentCode), category: Equal("announcement") }, "upvote", 1);
		}

		const contentData = await this.boardsRepository.findOne({
			select: {
				upvote: true,
				downvote: true,
			},
			where: {
				code: Equal(contentCode),
				category: Equal("announcement"),
			},
		});

		return { upvote: contentData.upvote, downvote: contentData.downvote, isVotable: isVotable };
	}

	/**
	 * 공지 게시판 글 비추천
	 */
	async downvoteAnnouncementContent(contentCode: number, ipData: string): Promise<{ upvote: number, downvote: number, isVotable: boolean }> {
		const isVotable: boolean = this.isVotableContent(contentCode, ipData);

		if (isVotable === true) {
			await this.boardsRepository.increment({ code: Equal(contentCode), category: Equal("announcement") }, "downvote", 1);
		}

		const contentData = await this.boardsRepository.findOne({
			select: {
				upvote: true,
				downvote: true,
			},
			where: {
				code: Equal(contentCode),
				category: Equal("announcement"),
			},
		});

		return { upvote: contentData.upvote, downvote: contentData.downvote, isVotable: isVotable };
	}

	/**
	 * 게시판 글 이미지 삽입
	 */
	async uploadImage(file: Express.Multer.File): Promise<{ url: string } | { error: { message: string } }> {
		// const timeOfNow = new Date();
		// const timeString = timeOfNow.toLocaleDateString("sv-SE").replace(/-/g, "") + timeOfNow.toLocaleTimeString("sv-SE").replace(/:/g, "");
		// const randomName = Array(10).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16).substring(0, 1)).join("");
		file.originalname = Buffer.from(file.originalname, "latin1").toString("utf8"); //한글 파일 이름이 깨져서 인코딩 추가
		console.log("uploadImage : ", file);

		return { url: "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AAZrqDW?w=300&h=157&q=60&m=6&f=jpg&u=t" };
		// return { error: { message: "test error" } };
	}
}