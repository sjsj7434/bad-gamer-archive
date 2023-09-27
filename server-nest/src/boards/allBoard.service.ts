import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, MoreThan, MoreThanOrEqual, Between } from 'typeorm';
import { Boards } from './boards.entity';
import { Replies } from './replies.entity';

@Injectable()
export class AllBoardService {
	constructor(
		@InjectRepository(Boards) private boardsRepository: Repository<Boards>,
		@InjectRepository(Replies) private repliesRepository: Repository<Replies>,
	) { }

	/**
	 * 글 목록 가져오기
	 */
	async getContentList(upvoteCutline: number, page: number, perPage: number, type: string): Promise<[Boards[], number]> {
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
				downvote: "ASC",
				createdAt: "DESC",
			},
			withDeleted: true,
			skip: (page - 1) * perPage,
			take: perPage,
		})

		return result;
	}
}