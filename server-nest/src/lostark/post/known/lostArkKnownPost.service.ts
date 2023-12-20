import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, MoreThanOrEqual, Equal, Like, FindOptionsWhere, Not, In } from 'typeorm';
import { AccountService } from 'src/account/account.service';
import { Request, Response } from 'express';
import { ErrorLogService } from 'src/log/error.log.service';
import { LostArkKnownPost } from './lostArkKnownPost.entity';
import { LostArkKnownReply } from './lostArkKnownReply.entity';
import { LostArkKnownPostVoteHistory } from './lostArkKnownPostVoteHistory.entity';
import { CreateLostArkKnownPostDTO, DeleteLostArkKnownPostDTO, UpdateLostArkKnownPostDTO } from './lostArkKnownPost.dto';
import { CreateLostArkKnownReplyDTO, DeleteLostArkKnownReplyDTO } from './lostArkKnownReply.dto';
import { LostArkKnownReplyVoteHistory } from './lostArkKnownReplyVoteHistory.entity';

@Injectable()
export class LostArkKnownPostService {
	constructor(
		@InjectRepository(LostArkKnownPost) private lostArkKnownPostRepository: Repository<LostArkKnownPost>,
		@InjectRepository(LostArkKnownReply) private lostArkKnownReplyRepository: Repository<LostArkKnownReply>,
		@InjectRepository(LostArkKnownPostVoteHistory) private lostArkKnownPostVoteHistoryRepository: Repository<LostArkKnownPostVoteHistory>,
		@InjectRepository(LostArkKnownReplyVoteHistory) private lostArkKnownReplyVoteHistoryRepository: Repository<LostArkKnownReplyVoteHistory>,
		private accountService: AccountService,
		private errorLogService: ErrorLogService,
	) { }

	private REPlY_MAX_LENG: number = 300; //댓글 글자 수 제한
	private REPlY_MAX_ROW: number = 10; //댓글 줄 수 제한
	private HOW_MANY_POST_ON_LIST: number = 20; //목록에 표시할 최대 게시글 수

	private POINT_WRITE_POST: number = 50; //글 작성 시 획득하는 포인트
	private POINT_WRITE_REPLY: number = 15; //댓글 작성 시 획득하는 포인트
	private POINT_VOTE: number = 5; //추천, 비추천 시 획득하는 포인트

	async isVotablePost(postCode: number, userUUID: string): Promise<boolean> {
		try {
			if (userUUID === "") {
				return false;
			}
			else {
				return !await this.lostArkKnownPostVoteHistoryRepository.exist({
					select: {
						voterNickname: true
					},
					where: {
						postCode: Equal(postCode),
						voterUUID: Equal(userUUID),
					},
				});
			}
		}
		catch (error) {
			this.errorLogService.createErrorLog(error);
		}
	}

	async isVotableReply(replyCode: number, userUUID: string): Promise<boolean> {
		try {
			if (userUUID === "") {
				return false;
			}
			else {
				return !await this.lostArkKnownReplyVoteHistoryRepository.exist({
					select: {
						voterNickname: true
					},
					where: {
						replyCode: Equal(replyCode),
						voterUUID: Equal(userUUID),
					},
				});
			}
		}
		catch (error) {
			this.errorLogService.createErrorLog(error);
		}
	}

	/**
	 * 검색 날짜 범위 설정 / 이제 사용하지 않음
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
	 * 에디터 내용 kilobyte(1000) 계산하여 반환, kibibyte(1024)아님
	 */
	getKiloByteSize = (stringData): number => {
		const encoder = new TextEncoder();
		const encoded = encoder.encode(stringData);
		const kilobyteStr = (encoded.byteLength / 1000).toFixed(2);
		const kilobyte = parseFloat(kilobyteStr);
		return kilobyte;
	}

	/**
	 * 추천 트랜드 게시글 목록 가져오기
	 */
	async getUpvoteTrend(page: number, searchType: string, searchText: string): Promise<[LostArkKnownPost[], number]> {
		try {
			const perPage: number = 5;
			const upvoteCutline: number = 1;

			const whereClause: FindOptionsWhere<LostArkKnownPost> | FindOptionsWhere<LostArkKnownPost>[] = [{
				deletedAt: IsNull(),
				upvote: MoreThanOrEqual(upvoteCutline),
				account: {
					authentication: [
						{ type: Equal("lostark_item_level") },
						{ type: IsNull() },
					]
				},
			}];

			if (searchText !== "") {
				if (searchType === "title") {
					whereClause[0].title = Like(`%${searchText}%`);
				}
				else if (searchType === "content") {
					whereClause[0].content = Like(`%${searchText}%`);
				}
				else if (searchType === "nickname") {
					whereClause[0].writerNickname = Like(`%${searchText}%`);
				}
				else if (searchType === "titleAndContent") {
					const deepCopiedWhere = Object.assign({}, whereClause[0]);
					deepCopiedWhere.content = Like(`%${searchText}%`);
					whereClause.push(deepCopiedWhere);
					whereClause[0].title = Like(`%${searchText}%`);
				}
			}

			const result = await this.lostArkKnownPostRepository.findAndCount({
				relations: ["reply", "account", "account.authentication"], //정보 join
				select: {
					reply: { code: true },
					account: { nickname: true, authentication: { type: true, data: true } },
					code: true,
					category: true,
					writerNickname: true,
					title: true,
					view: true,
					upvote: true,
					downvote: true,
					hasImage: true,
					createdAt: true,
				},
				where: whereClause,
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
	async getDownvoteTrend(page: number, searchType: string, searchText: string): Promise<[LostArkKnownPost[], number]> {
		try {
			const perPage: number = 5;
			const downvoteCutline: number = 1;

			const whereClause: FindOptionsWhere<LostArkKnownPost> | FindOptionsWhere<LostArkKnownPost>[] = [{
				deletedAt: IsNull(),
				downvote: MoreThanOrEqual(downvoteCutline),
				account: {
					authentication: [
						{ type: Equal("lostark_item_level") },
						{ type: IsNull() },
					]
				},
			}];

			if (searchText !== "") {
				if (searchType === "title") {
					whereClause[0].title = Like(`%${searchText}%`);
				}
				else if (searchType === "content") {
					whereClause[0].content = Like(`%${searchText}%`);
				}
				else if (searchType === "nickname") {
					whereClause[0].writerNickname = Like(`%${searchText}%`);
				}
				else if (searchType === "titleAndContent") {
					const deepCopiedWhere = Object.assign({}, whereClause[0]);
					deepCopiedWhere.content = Like(`%${searchText}%`);
					whereClause.push(deepCopiedWhere);
					whereClause[0].title = Like(`%${searchText}%`);
				}
			}

			const result = await this.lostArkKnownPostRepository.findAndCount({
				relations: ["reply", "account", "account.authentication"], //정보 join
				select: {
					reply: { code: true },
					account: { nickname: true, authentication: { type: true, data: true } },
					code: true,
					category: true,
					writerNickname: true,
					title: true,
					view: true,
					upvote: true,
					downvote: true,
					hasImage: true,
					createdAt: true,
				},
				where: whereClause,
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
		catch (error) {
			this.errorLogService.createErrorLog(error);
		}
	}

	/**
	 * 조회 트랜드 게시글 목록 가져오기
	 */
	async getViewTrend(page: number, searchType: string, searchText: string): Promise<[LostArkKnownPost[], number]> {
		try {
			const perPage: number = 5;
			const viewCutline: number = 1;

			const whereClause: FindOptionsWhere<LostArkKnownPost> | FindOptionsWhere<LostArkKnownPost>[] = [{
				deletedAt: IsNull(),
				view: MoreThanOrEqual(viewCutline),
				account: {
					authentication: [
						{ type: Equal("lostark_item_level") },
						{ type: IsNull() },
					]
				},
			}];

			if (searchText !== "") {
				if (searchType === "title") {
					whereClause[0].title = Like(`%${searchText}%`);
				}
				else if (searchType === "content") {
					whereClause[0].content = Like(`%${searchText}%`);
				}
				else if (searchType === "nickname") {
					whereClause[0].writerNickname = Like(`%${searchText}%`);
				}
				else if (searchType === "titleAndContent") {
					const deepCopiedWhere = Object.assign({}, whereClause[0]);
					deepCopiedWhere.content = Like(`%${searchText}%`);
					whereClause.push(deepCopiedWhere);
					whereClause[0].title = Like(`%${searchText}%`);
				}
			}

			const result = await this.lostArkKnownPostRepository.findAndCount({
				relations: ["reply", "account", "account.authentication"], //정보 join
				select: {
					reply: { code: true },
					account: { nickname: true, authentication: { type: true, data: true } },
					code: true,
					category: true,
					writerNickname: true,
					title: true,
					view: true,
					upvote: true,
					downvote: true,
					hasImage: true,
					createdAt: true,
				},
				where: whereClause,
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
		catch (error) {
			this.errorLogService.createErrorLog(error);
		}
	}

	//=================================================================================================================================================================================

	/**
	 * 유저 게시판 목록 가져오기
	 */
	async getPostList(request: Request, response: Response, page: number, searchType: string, searchText: string): Promise<[LostArkKnownPost[], number]> {
		const blacklist = await this.accountService.getMyBlacklistUUID(request, response);

		const whereClause: FindOptionsWhere<LostArkKnownPost> | FindOptionsWhere<LostArkKnownPost>[] = [{
			deletedAt: IsNull(),
			account: {
				uuid: Not(In(blacklist)), //내가 차단한 유저는 가져오지 않음
				authentication: [
					{ type: Equal("lostark_item_level") },
					{ type: IsNull() },
				]
			},
		}];

		if (searchText !== "") {
			if (searchType === "title") {
				whereClause[0].title = Like(`%${searchText}%`);
			}
			else if (searchType === "content") {
				whereClause[0].content = Like(`%${searchText}%`);
			}
			else if (searchType === "nickname") {
				whereClause[0].writerNickname = Like(`%${searchText}%`);
			}
			else if (searchType === "titleAndContent") {
				const deepCopiedWhere = Object.assign({}, whereClause[0]);
				deepCopiedWhere.content = Like(`%${searchText}%`);
				whereClause.push(deepCopiedWhere);
				whereClause[0].title = Like(`%${searchText}%`);
			}
		}

		const result = await this.lostArkKnownPostRepository.findAndCount({
			relations: ["reply", "account", "account.authentication"], //댓글 정보 join
			select: {
				reply: { code: true },
				account: { nickname: true, authentication: { type: true, data: true } },
				code: true,
				category: true,
				writerNickname: true,
				title: true,
				view: true,
				upvote: true,
				downvote: true,
				hasImage: true,
				createdAt: true,
			},
			where: whereClause,
			order: {
				code: "DESC",
			},
			withDeleted: true,
			skip: (page - 1) * this.HOW_MANY_POST_ON_LIST,
			take: this.HOW_MANY_POST_ON_LIST,
		});

		return result;

		/*
		const queryOBJ = this.lostArkKnownPostRepository
		.createQueryBuilder("boards")
		.leftJoinAndSelect("boards.replies", "replies", "replies.postCode = boards.code")
		.leftJoinAndSelect("boards.account", "account", "account.id = boards.writerID")
		.innerJoinAndSelect("account.authentication", "authentication", "authentication.uuid = account.uuid AND authentication.type = 'lostark_item_level'")

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
		.skip((page - 1) * this.HOW_MANY_POST_ON_LIST)
		.take(this.HOW_MANY_POST_ON_LIST)

		// const queryData = queryOBJ.getSql();
		// console.log(queryData)

		const result3 = await queryOBJ.getRawMany(); // getMany를 하게 되면 entity와 같은 값만 나옴, getRawMany를 해야 위와 같은 연산 처리가 가능하다.
		console.log(result3)

		// return result2;
		return [result3, result3.length];
		*/
	}

	/**
	 * 유저 게시판 글 읽기, 조회수 + 1
	 */
	async readPost(request: Request, response: Response, postCode: number): Promise<{ contentData: LostArkKnownPost, isWriter: boolean }> {
		const loginCookie = await this.accountService.checkLoginStatus(request, response);

		if (isNaN(postCode) === true) {
			return null;
		}

		let isWriter: boolean = false;

		await this.lostArkKnownPostRepository.increment({ code: postCode }, "view", 1);

		const contentData = await this.lostArkKnownPostRepository.findOne({
			relations: ["account", "account.authentication"],
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
				createdAt: true,
				updatedAt: true,
				account: {
					nickname: true,
					authentication: {
						type: true,
						data: true,
					},
				},
			},
			where: {
				code: Equal(postCode),
				account: {
					authentication: [
						{ type: Equal("lostark_item_level") },
						{ type: IsNull() },
					]
				}
			},
		});

		if (contentData !== null) {
			isWriter = contentData.writerID === loginCookie.id;
			contentData.writerID = "";
		}

		return { contentData: contentData, isWriter: isWriter };
	}

	/**
	 * 유저 게시판 글 데이터 가져오기
	 */
	async getPost(request: Request, response: Response, postCode: number): Promise<{ contentData: LostArkKnownPost, isWriter: boolean }> {
		const loginCookie = await this.accountService.checkLoginStatus(request, response);

		if (isNaN(postCode) === true) {
			return null;
		}

		let isWriter: boolean = false;

		const contentData = await this.lostArkKnownPostRepository.findOne({
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
				createdAt: true,
				updatedAt: true,
			},
			where: {
				code: Equal(postCode),
			},
		});

		if (contentData !== null) {
			isWriter = contentData.writerID === loginCookie.id;
			contentData.writerID = "";
		}

		return { contentData: contentData, isWriter: isWriter };
	}

	/**
	 * 유저 게시글 작성자 확인
	 */
	async isAuthor(request: Request, response: Response, code: number): Promise<boolean> {
		const loginCookie = await this.accountService.checkLoginStatus(request, response);
		const loginUUID = await this.accountService.getMyUUID(request);

		if (loginCookie.status === "login") {
			if (isNaN(code) === true) {
				return false;
			}

			const isExists = await this.lostArkKnownPostRepository.exist({
				select: {
					code: true,
				},
				where: {
					code: Equal(code),
					writerUUID: Equal(loginUUID),
				},
			});

			return isExists;
		}
		else {
			return false;
		}
	}

	/**
	 * 유저 게시판에 게시글을 생성한다
	 */
	async createPost(createPostDTO: CreateLostArkKnownPostDTO, ipData: string, request: Request, response: Response): Promise<{ createdCode: number, status: string }> {
		const loginCookie = await this.accountService.checkLoginStatus(request, response);
		const loginUUID = await this.accountService.getMyUUID(request);

		if (loginCookie.status === "login") {
			if (createPostDTO.title.length > 200) {
				return { createdCode: 0, status: "long_title" };
			}
			else if (this.getKiloByteSize(createPostDTO.content) > 30) {
				return { createdCode: 0, status: "long_content" };
			}

			createPostDTO.writerUUID = loginUUID;
			createPostDTO.writerID = loginCookie.id;
			createPostDTO.writerNickname = loginCookie.nickname;
			createPostDTO.ip = ipData; //개발서버에서는 로컬만 찍혀서 임시로 비활성
			createPostDTO.ip = Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5);

			const createdPost = await this.lostArkKnownPostRepository.save(createPostDTO);
			await this.accountService.updateAccountExp(request, response, "up", this.POINT_WRITE_POST);
			await this.accountService.updateAccountPostCount(request, response, "create");

			return { createdCode: createdPost.code, status: "" };
		}
		else {
			return { createdCode: 0, status: "need_login" };
		}
	}

	/**
	 * 유저 게시판에 글을 수정한다
	 */
	async updatePost(request: Request, response: Response, updatePostDTO: UpdateLostArkKnownPostDTO): Promise<boolean> {
		const loginCookie = await this.accountService.checkLoginStatus(request, response);
		const loginUUID = await this.accountService.getMyUUID(request);

		const isExist = await this.lostArkKnownPostRepository.exist({
			where: {
				code: Equal(updatePostDTO.code),
				writerUUID: Equal(loginUUID),
			}
		})

		if (loginCookie.status === "login") {
			if (isExist === true) {
				updatePostDTO.updatedAt = new Date(); //update 날짜 수정

				await this.lostArkKnownPostRepository.update({ code: updatePostDTO.code }, updatePostDTO)
			}

			return isExist;
		}
		else {
			return false;
		}
	}

	/**
	 * 유저 게시판 글을 softDelete한다
	 */
	async softDeletePost(request: Request, response: Response, deletePostDTO: DeleteLostArkKnownPostDTO): Promise<boolean> {
		const loginCookie = await this.accountService.checkLoginStatus(request, response);
		const loginUUID = await this.accountService.getMyUUID(request);

		if (loginCookie.status === "login") {
			const isExists = await this.lostArkKnownPostRepository.exist({
				where: {
					code: Equal(deletePostDTO.code),
					writerUUID: Equal(loginUUID),
				}
			});

			if (isExists === true) {
				await this.lostArkKnownPostRepository.softDelete({
					code: Equal(deletePostDTO.code)
				});
				await this.accountService.updateAccountPostCount(request, response, "delete");
			}

			return isExists;
		}
		else {
			return false;
		}
	}

	/**
	 * 유저 게시판 글 추천
	 */
	async upvotePost(request: Request, response: Response, postCode: number, ipData: string): Promise<{ upvote: number, downvote: number, isVotable: boolean }> {
		const loginCookie = await this.accountService.checkLoginStatus(request, response);
		const loginUUID = await this.accountService.getMyUUID(request);
		const isVotable: boolean = await this.isVotablePost(postCode, loginUUID);

		if (isVotable === true && loginCookie !== null) {
			await this.lostArkKnownPostRepository.increment({ code: Equal(postCode) }, "upvote", 1);
			
			const insertHistory = this.lostArkKnownPostVoteHistoryRepository.create({
				postCode: postCode,
				voteType: "up",
				voterUUID: loginUUID,
				voterID: loginCookie.id,
				voterNickname: loginCookie.nickname,
				ip: ipData,
			});
			await this.lostArkKnownPostVoteHistoryRepository.insert(insertHistory);
			await this.accountService.updateAccountExp(request, response, "up", this.POINT_VOTE);
		}

		const contentData = await this.lostArkKnownPostRepository.findOne({
			select: {
				upvote: true,
				downvote: true,
			},
			where: {
				code: Equal(postCode),
			},
		});

		return { upvote: contentData.upvote, downvote: contentData.downvote, isVotable: isVotable };
	}

	/**
	 * 유저 게시판 글 비추천
	 */
	async downvotePost(request: Request, response: Response, postCode: number, ipData: string): Promise<{ upvote: number, downvote: number, isVotable: boolean }> {
		const loginCookie = await this.accountService.checkLoginStatus(request, response);
		const loginUUID = await this.accountService.getMyUUID(request);
		const isVotable: boolean = await this.isVotablePost(postCode, loginUUID);

		if (isVotable === true) {
			await this.lostArkKnownPostRepository.increment({ code: Equal(postCode) }, "downvote", 1);

			const insertHistory = this.lostArkKnownPostVoteHistoryRepository.create({
				postCode: postCode,
				voteType: "down",
				voterUUID: loginUUID,
				voterID: loginCookie.id,
				voterNickname: loginCookie.nickname,
				ip: ipData,
			});
			await this.lostArkKnownPostVoteHistoryRepository.insert(insertHistory);
			await this.accountService.updateAccountExp(request, response, "up", this.POINT_VOTE);
		}

		const contentData = await this.lostArkKnownPostRepository.findOne({
			select: {
				upvote: true,
				downvote: true,
			},
			where: {
				code: Equal(postCode),
			},
		});

		return { upvote: contentData.upvote, downvote: contentData.downvote, isVotable: isVotable };
	}

	/**
	 * 유저 게시판 추천자 목록
	 */
	async getPostUpvoteList(request: Request, response: Response, postCode: number): Promise<LostArkKnownPostVoteHistory[]> {
		// const loginCookie = await this.accountService.checkLoginStatus(request, response);

		const contentData = await this.lostArkKnownPostVoteHistoryRepository.find({
			select: {
				voterNickname: true,
				createdAt: true,
			},
			where: {
				postCode: Equal(postCode),
				voteType: Equal("up"),
			},
		});

		return contentData;
	}

	/**
	 * 유저 게시판 비추천자 목록
	 */
	async getPostDownvoteList(request: Request, response: Response, postCode: number): Promise<LostArkKnownPostVoteHistory[]> {
		// const loginCookie = await this.accountService.checkLoginStatus(request, response);

		const contentData = await this.lostArkKnownPostVoteHistoryRepository.find({
			select: {
				voterNickname: true,
				createdAt: true,
			},
			where: {
				postCode: Equal(postCode),
				voteType: Equal("down"),
			},
		});

		return contentData;
	}

	/**
	 * 유저 게시판 댓글 목록 가져오기
	 */
	async getReply(request: Request, response: Response, postCode: number, page: number): Promise<[LostArkKnownReply[], number]> {
		const perPage = 50;
		const blacklist = await this.accountService.getMyBlacklistUUID(request, response);

		const blackRepliesData = await this.lostArkKnownReplyRepository.find({
			select: {
				code: true,
			},
			where: {
				postCode: Equal(postCode),
				writerUUID: In(blacklist), //내가 차단한 유저
			},
			withDeleted: true,
		});

		const replyblacklist = blackRepliesData.flatMap((element) => (element.code));

		const repliesData = await this.lostArkKnownReplyRepository.findAndCount({
			relations: ["account"],
			select: {
				account: { profilePictureURL: true },
				code: true,
				parentReplyCode: true,
				level: true,
				writerNickname: true,
				replyOrder: true,
				content: true,
				upvote: true,
				downvote: true,
				createdAt: true,
				deletedAt: true,
			},
			where: {
				postCode: Equal(postCode),
				code: Not(In(replyblacklist)), //내가 차단한 유저는 가져오지 않음
				parentReplyCode: Not(In(replyblacklist)), //내가 차단한 유저는 가져오지 않음
			},
			order: {
				replyOrder: "DESC",
				level: "ASC",
				code: "ASC",
			},
			withDeleted: true,
			skip: (page - 1) * perPage, //시작 인덱스
			take: perPage, //페이지 당 갯수
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
	 * 유저 게시판 댓글 생성
	 */
	async createReply(request: Request, response: Response, createReplyDTO: CreateLostArkKnownReplyDTO, ipData: string): Promise<boolean> {
		//부모 게시글의 코드만 바꿔서 요청이 들어오면 비로그인 유저가 로그인 전용 게시글에 댓글을 익명으로 남길 수 있게됨
		//댓글 저장 전에 부모 게시글의 정보 확인
		if (createReplyDTO.content === ""){
			return false;
		}
		else if (createReplyDTO.content.length > this.REPlY_MAX_LENG) {
			return false;
		}
		else if (createReplyDTO.content.split("\n").length > this.REPlY_MAX_ROW) {
			return false;
		}

		const loginCookie = await this.accountService.checkLoginStatus(request, response);
		const loginUUID = await this.accountService.getMyUUID(request);

		if (loginCookie.status === "login") {
			createReplyDTO.writerUUID = loginUUID;
			createReplyDTO.writerID = loginCookie.id;
			createReplyDTO.writerNickname = loginCookie.nickname;
			createReplyDTO.replyOrder = 0;

			if (createReplyDTO.level === 0) {
				createReplyDTO.parentReplyCode = 0;
			}

			createReplyDTO.ip = ipData;
			createReplyDTO.ip = Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5);

			const contentData = await this.lostArkKnownPostRepository.exist({
				where: {
					code: Equal(createReplyDTO.postCode),
				},
			});

			if (contentData === true) {
				const replyData = await this.lostArkKnownReplyRepository.save(createReplyDTO);

				if (replyData.level === 0) {
					//댓글
					replyData.replyOrder = replyData.code;
				}
				else {
					//답글
					replyData.replyOrder = replyData.parentReplyCode;
				}

				await this.lostArkKnownReplyRepository.save(replyData);
				await this.accountService.updateAccountExp(request, response, "up", this.POINT_WRITE_REPLY);
				await this.accountService.updateAccountReplyCount(request, response, "create");

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
	 * 유저 게시판 댓글 삭제
	 */
	async deleteReply(request: Request, response: Response, deleteReplyDTO: DeleteLostArkKnownReplyDTO): Promise<boolean> {
		const loginCookie = await this.accountService.checkLoginStatus(request, response);
		const loginUUID = await this.accountService.getMyUUID(request);

		if (loginCookie.status !== "login") {
			return false;
		}
		
		const replyData = await this.lostArkKnownReplyRepository.exist({
			where: {
				code: Equal(deleteReplyDTO.code),
				writerUUID: Equal(loginUUID),
			}
		});

		if (replyData === false) {
			return false;
		}
		else {
			await this.lostArkKnownReplyRepository.softDelete({
				code: Equal(deleteReplyDTO.code),
				writerUUID: Equal(loginUUID),
			});
			await this.accountService.updateAccountReplyCount(request, response, "delete");

			return true;
		}
	}

	/**
	 * 유저 댓글 추천
	 */
	async upvoteKnownReply(request: Request, response: Response, replyCode: number, ipData: string): Promise<{ upvote: number, downvote: number, isVotable: boolean }> {
		const loginCookie = await this.accountService.checkLoginStatus(request, response);
		const loginUUID = await this.accountService.getMyUUID(request);

		if (loginCookie.status !== "login") {
			return { upvote: 0, downvote: 0, isVotable: false };
		}

		const isVotable: boolean = await this.isVotableReply(replyCode, loginUUID);

		if (isVotable === true){
			await this.lostArkKnownReplyRepository.increment({ code: Equal(replyCode) }, "upvote", 1);

			const updatedReply = await this.lostArkKnownReplyRepository.findOne({
				select: {
					upvote: true,
					downvote: true,
				},
				where: {
					code: Equal(replyCode),
				},
				withDeleted: true,
			});

			if (updatedReply === null) {
				return { upvote: 0, downvote: 0, isVotable: false };
			}
			else {
				const insertHistory = this.lostArkKnownReplyVoteHistoryRepository.create({
					replyCode: replyCode,
					voteType: "up",
					voterUUID: loginUUID,
					voterID: loginCookie.id,
					voterNickname: loginCookie.nickname,
					ip: ipData,
				});
				await this.lostArkKnownReplyVoteHistoryRepository.insert(insertHistory);

				return { upvote: updatedReply.upvote, downvote: updatedReply.downvote, isVotable: true };
			}
		}
		else {
			return { upvote: 0, downvote: 0, isVotable: false };
		}
	}

	/**
	 * 유저 댓글 비추천
	 */
	async downvoteKnownReply(request: Request, response: Response, replyCode: number, ipData: string): Promise<{ upvote: number, downvote: number, isVotable: boolean }> {
		const loginCookie = await this.accountService.checkLoginStatus(request, response);
		const loginUUID = await this.accountService.getMyUUID(request);

		if (loginCookie.status !== "login") {
			return { upvote: 0, downvote: 0, isVotable: false };
		}

		const isVotable: boolean = await this.isVotableReply(replyCode, loginUUID);

		if (isVotable === true) {
			await this.lostArkKnownReplyRepository.increment({ code: Equal(replyCode) }, "downvote", 1);

			const updatedReply = await this.lostArkKnownReplyRepository.findOne({
				select: {
					upvote: true,
					downvote: true,
				},
				where: {
					code: Equal(replyCode),
				},
				withDeleted: true,
			});

			if (updatedReply === null) {
				return { upvote: 0, downvote: 0, isVotable: false };
			}
			else {
				const insertHistory = this.lostArkKnownReplyVoteHistoryRepository.create({
					replyCode: replyCode,
					voteType: "down",
					voterUUID: loginUUID,
					voterID: loginCookie.id,
					voterNickname: loginCookie.nickname,
					ip: ipData,
				});
				await this.lostArkKnownReplyVoteHistoryRepository.insert(insertHistory);
				
				return { upvote: updatedReply.upvote, downvote: updatedReply.downvote, isVotable: true };
			}
		}
		else {
			return { upvote: 0, downvote: 0, isVotable: false };
		}
	}

	/**
	 * 게시판 글 이미지 삽입
	 */
	async uploadImage(file: Express.Multer.File): Promise<{ url: string } | { error: { message: string } }> {
		// Multer is --save-dev option installed, same as -d option
		// If the upload is successful, the server should return: An object containing [the url property] which points to the uploaded image on the server
		// 이미지 업로드가 성공했으면 서버가 이미지 주소 정보가 담긴 오브젝트(url 프로퍼티를 가진)를 반환해야만 함
		
		// const timeOfNow = new Date();
		// const timeString = timeOfNow.toLocaleDateString("sv-SE").replace(/-/g, "") + timeOfNow.toLocaleTimeString("sv-SE").replace(/:/g, "");
		// const randomName = Array(10).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16).substring(0, 1)).join("");
		file.originalname = Buffer.from(file.originalname, "latin1").toString("utf8"); //한글 파일 이름이 깨져서 인코딩 추가
		console.log("uploadImage : ", file);

		return { url: "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AAZrqDW?w=300&h=157&q=60&m=6&f=jpg&u=t" };
		// return { error: { message: "test error" } };
	}
}