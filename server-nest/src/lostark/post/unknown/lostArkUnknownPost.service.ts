import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, MoreThanOrEqual, Equal, Like } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ErrorLogService } from 'src/log/error.log.service';
import { LostArkUnknownPost } from './lostArkUnknownPost.entity';
import { LostArkUnknownReply } from './lostArkUnknownReply.entity';
import { CreateLostArkUnknownPostDTO, DeleteLostArkUnknownPostDTO, UpdateLostArkUnknownPostDTO } from './lostArkUnknownPost.dto';
import { CreateLostArkUnknownReplyDTO, DeleteLostArkUnknownReplyDTO } from './lostArkUnknownReply.dto';

@Injectable()
export class LostArkUnknownPostService {
	constructor(
		@InjectRepository(LostArkUnknownPost) private lostArkUnknownPostRepository: Repository<LostArkUnknownPost>,
		@InjectRepository(LostArkUnknownReply) private lostArkUnknownReplyRepository: Repository<LostArkUnknownReply>,
		private errorLogService: ErrorLogService,
	) { }

	private VOTE_HISTORY: Map<number, Array<string>> = new Map();
	private REPlY_MAX_LENG: number = 300; //댓글 글자 수 제한
	private REPlY_MAX_ROW: number = 10; //댓글 줄 수 제한
	private HOW_MANY_POST_ON_LIST: number = 20; //목록에 표시할 최대 게시글 수

	//서울 시간 기준으로 [매일 00:00]에 데이터 초기화
	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
		name: "resetVoteData",
		timeZone: "Asia/Seoul",
	})
	resetVoteData() {
		this.VOTE_HISTORY.clear();
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
	async getUpvoteTrend(page: number, searchType: string, searchText: string): Promise<[LostArkUnknownPost[], number]> {
		try {
			const perPage: number = 5;
			const upvoteCutline: number = 1;

			const result = await this.lostArkUnknownPostRepository.findAndCount({
				relations: ["reply"], //댓글 정보 join
				select: {
					reply: { code: true },
					code: true,
					category: true,
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
	 * 비추천 트랜드 게시글 목록 가져오기
	 */
	async getDownvoteTrend(page: number, searchType: string, searchText: string): Promise<[LostArkUnknownPost[], number]> {
		try {
			const perPage: number = 5;
			const downvoteCutline: number = 1;

			const result = await this.lostArkUnknownPostRepository.findAndCount({
				relations: ["reply"], //댓글 정보 join
				select: {
					reply: { code: true },
					code: true,
					category: true,
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
	 * 조회 트랜드 게시글 목록 가져오기
	 */
	async getViewTrend(page: number, searchType: string, searchText: string): Promise<[LostArkUnknownPost[], number]> {
		try {
			const perPage: number = 5;
			const viewCutline: number = 1;

			const result = await this.lostArkUnknownPostRepository.findAndCount({
				relations: ["reply"], //댓글 정보 join
				select: {
					reply: { code: true },
					code: true,
					category: true,
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

	//=================================================================================================================================================================================

	/**
	 * 익명 게시판 목록 가져오기
	 */
	async getPostList(page: number, searchType: string, searchText: string): Promise<[LostArkUnknownPost[], number]> {
		try {
			let whereClause = {};

			if (searchText !== ""){
				if (searchType === "title") {
					whereClause = {
						deletedAt: IsNull(),
						title: Like(`%${searchText}%`),
					}
				}
				else if (searchType === "content") {
					whereClause = {
						deletedAt: IsNull(),
						content: Like(`%${searchText}%`),
					}
				}
				else if (searchType === "titleAndContent") {
					whereClause = [
						{
							deletedAt: IsNull(),
							title: Like(`%${searchText}%`),
						},
						{
							deletedAt: IsNull(),
							content: Like(`%${searchText}%`),
						},
					]
				}
			}
			else {
				whereClause = {
					deletedAt: IsNull(),
				}
			}

			const result = await this.lostArkUnknownPostRepository.findAndCount({
				relations: ["reply"], //댓글 정보 join
				select: {
					reply: { code: true },
					code: true,
					title: true,
					view: true,
					upvote: true,
					downvote: true,
					ip: true,
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
	 * 익명 게시판 글 읽기, 조회수 + 1
	 */
	async readPost(contentCode: number): Promise<{ contentData: LostArkUnknownPost, isWriter: boolean }> {
		if (isNaN(contentCode) === true) {
			return null;
		}

		let isAuthor: boolean = false;

		await this.lostArkUnknownPostRepository.increment({ code: contentCode }, "view", 1);

		const lostArkUnknownPost = await this.lostArkUnknownPostRepository.findOne({
			select: {
				code: true,
				category: true,
				title: true,
				content: true,
				view: true,
				upvote: true,
				downvote: true,
				ip: true,
				createdAt: true,
				updatedAt: true,
			},
			where: {
				code: Equal(contentCode),
			},
		});

		if (lostArkUnknownPost !== null) {
			lostArkUnknownPost.ip = lostArkUnknownPost.ip.split(".")[0] + (lostArkUnknownPost.ip.split(".")[1] !== undefined ? "." + lostArkUnknownPost.ip.split(".")[1] : "");
			isAuthor = true;
		}

		return { contentData: lostArkUnknownPost, isWriter: isAuthor };
	}

	/**
	 * 익명 게시판 글 데이터 가져오기
	 */
	async getPost(contentCode: number): Promise<{ contentData: LostArkUnknownPost, isWriter: boolean }> {
		if (isNaN(contentCode) === true) {
			return null;
		}

		let isAuthor: boolean = false;

		const lostArkUnknownPost = await this.lostArkUnknownPostRepository.findOne({
			select: {
				code: true,
				category: true,
				title: true,
				content: true,
				view: true,
				upvote: true,
				downvote: true,
				ip: true,
				createdAt: true,
				updatedAt: true,
			},
			where: {
				code: Equal(contentCode),
			},
		});

		if (lostArkUnknownPost !== null) {
			lostArkUnknownPost.ip = lostArkUnknownPost.ip.split(".")[0] + (lostArkUnknownPost.ip.split(".")[1] !== undefined ? "." + lostArkUnknownPost.ip.split(".")[1] : "");
			isAuthor = true;
		}

		return { contentData: lostArkUnknownPost, isWriter: isAuthor };
	}

	/**
	 * 익명 게시글 작성자 확인
	 */
	async isAuthor(inputCode: number, inputPassword: string): Promise<boolean> {
		if (isNaN(inputCode) === true) {
			return false;
		}

		const isExists = await this.lostArkUnknownPostRepository.exist({
			select: {
				code: true,
			},
			where: {
				code: Equal(inputCode),
				password: Equal(inputPassword),
			},
		});

		return isExists;
	}

	/**
	 * 익명 게시판에 게시글을 생성한다
	 */
	async createPost(createPostDTO: CreateLostArkUnknownPostDTO, ipData: string): Promise<{ createdCode: number, status: string }> {
		if (createPostDTO.title.length > 200) {
			return { createdCode: 0, status: "long_title" };
		}
		else if (this.getKiloByteSize(createPostDTO.content) > 30) {
			return { createdCode: 0, status: "long_content" };
		}

		createPostDTO.category = "";
		createPostDTO.ip = ipData; //개발서버에서는 로컬만 찍혀서 임시로 비활성
		createPostDTO.ip = Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5);

		const createdPost = await this.lostArkUnknownPostRepository.save(createPostDTO);
		return { createdCode: createdPost.code, status: "" };
	}

	/**
	 * 익명 게시판에 글을 수정한다
	 */
	async updatePost(updatePostDTO: UpdateLostArkUnknownPostDTO): Promise<boolean> {
		const isExists = await this.lostArkUnknownPostRepository.exist({
			where: {
				code: Equal(updatePostDTO.code),
				password: Equal(updatePostDTO.password),
			}
		});

		if (isExists === true) {
			updatePostDTO.updatedAt = new Date(); //update 날짜 수정

			// await this.lostArkUnknownPostRepository.save(updatePostDTO);
			await this.lostArkUnknownPostRepository.update({ code: updatePostDTO.code }, updatePostDTO)
		}

		return isExists;
	}

	/**
	 * 익명 게시판 글을 softDelete한다
	 */
	async softDeletePost(deletePostDTO: DeleteLostArkUnknownPostDTO): Promise<boolean> {
		const isExists = await this.lostArkUnknownPostRepository.exist({
			where: {
				code: Equal(deletePostDTO.code),
				password: Equal(deletePostDTO.password),
			}
		});

		if (isExists === true) {
			await this.lostArkUnknownPostRepository.softDelete({
				code: Equal(deletePostDTO.code)
			});
		}

		return isExists;
	}

	/**
	 * 익명 게시판 글 추천
	 */
	async upvotePost(contentCode: number, ipData: string): Promise<{ upvote: number, downvote: number, isVotable: boolean }> {
		const isVotable: boolean = this.isVotableContent(contentCode, ipData);

		if (isVotable === true) {
			await this.lostArkUnknownPostRepository.increment({ code: Equal(contentCode) }, "upvote", 1);
		}

		const contentData = await this.lostArkUnknownPostRepository.findOne({
			select: {
				upvote: true,
				downvote: true,
			},
			where: {
				code: Equal(contentCode),
			},
		});

		return { upvote: contentData.upvote, downvote: contentData.downvote, isVotable: isVotable };
	}

	/**
	 * 익명 게시판 글 비추천
	 */
	async downvotePost(contentCode: number, ipData: string): Promise<{ upvote: number, downvote: number, isVotable: boolean }> {
		const isVotable: boolean = this.isVotableContent(contentCode, ipData);

		if (isVotable === true) {
			await this.lostArkUnknownPostRepository.increment({ code: Equal(contentCode) }, "downvote", 1);
		}

		const contentData = await this.lostArkUnknownPostRepository.findOne({
			select: {
				upvote: true,
				downvote: true,
			},
			where: {
				code: Equal(contentCode),
			},
		});

		return { upvote: contentData.upvote, downvote: contentData.downvote, isVotable: isVotable };
	}

	/**
	 * 익명 게시판 댓글 목록 가져오기
	 */
	async getReply(contentCode: number, page: number): Promise<[LostArkUnknownReply[], number]> {
		const perPage = 50;

		const repliesData = await this.lostArkUnknownReplyRepository.findAndCount({
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
	async createReply(createReplyDTO: CreateLostArkUnknownReplyDTO, ipData: string): Promise<boolean> {
		//부모 게시글의 코드만 바꿔서 요청이 들어오면 비로그인 유저가 로그인 전용 게시글에 댓글을 익명으로 남길 수 있게됨
		//댓글 저장 전에 부모 게시글의 정보 확인
		if (createReplyDTO.content === "") {
			return false;
		}
		else if (createReplyDTO.content.length > this.REPlY_MAX_LENG) {
			return false;
		}
		else if (createReplyDTO.content.split("\n").length > this.REPlY_MAX_ROW) {
			return false;
		}
		
		if (createReplyDTO.level === 0) {
			createReplyDTO.parentReplyCode = 0;
		}
		createReplyDTO.writerID = "";
		createReplyDTO.writerNickname = "";
		createReplyDTO.replyOrder = 0;
		createReplyDTO.ip = ipData;
		createReplyDTO.ip = Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5);

		const contentData = await this.lostArkUnknownPostRepository.exist({
			where: {
				code: Equal(createReplyDTO.parentContentCode),
			},
		});

		if (contentData === true) {
			const replyData = await this.lostArkUnknownReplyRepository.save(createReplyDTO);

			if (replyData.level === 0) {
				//댓글
				replyData.replyOrder = replyData.code;
			}
			else {
				//답글
				replyData.replyOrder = replyData.parentReplyCode;
			}

			await this.lostArkUnknownReplyRepository.save(replyData);

			return true;
		}
		else {
			return false;
		}
	}

	/**
	 * 익명 게시판 댓글 삭제
	 */
	async deleteReply(deleteReplyDTO: DeleteLostArkUnknownReplyDTO): Promise<boolean> {
		const isExists = await this.lostArkUnknownReplyRepository.exist({
			where: {
				code: Equal(deleteReplyDTO.code),
				writerID: Equal(""),
				password: Equal(deleteReplyDTO.password),
			}
		});

		if (isExists === true) {
			await this.lostArkUnknownReplyRepository.softDelete({
				code: Equal(deleteReplyDTO.code),
				writerID: Equal(""),
				password: Equal(deleteReplyDTO.password),
			});
		}

		return isExists;
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