import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Equal } from 'typeorm';
import { Boards } from './boards.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Request, Response } from 'express';
import { ErrorLogService } from 'src/log/error.log.service';

@Injectable()
export class BoardsService {
	constructor(
		@InjectRepository(Boards) private boardsRepository: Repository<Boards>,
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