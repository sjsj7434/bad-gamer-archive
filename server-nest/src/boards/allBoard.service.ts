import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, MoreThan, MoreThanOrEqual } from 'typeorm';
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
	async getContentList(upvoteCutline: number, page: number, perPage: number): Promise<[Boards[], number]> {
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
}