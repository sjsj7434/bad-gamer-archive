import { IsNumber, IsString, IsDate } from 'class-validator';

//Entity 클래스는 실제 테이블과 매핑되어 만일 변경되게 되면 여러 다른 클래스에 영향을 끼치고, DTO 클래스는 View와 통신하며 자주 변경되므로 분리
export class CreateRepliesDTO {
	@IsNumber()
	parentReplyCode: number;

	@IsNumber()
	parentContentCode: number;

	@IsNumber()
	level: number;

	@IsNumber()
	replyOrder: number;

	@IsString()
	content: string;

	@IsString()
	password: string;

	@IsString()
	writer: string;

	ip: string;
}

export class UpdateRepliesDTO {
	@IsNumber()
	code: number;

	@IsNumber()
	parentReplyCode: number;

	@IsNumber()
	parentContentCode: number;

	@IsString()
	content: string;

	@IsNumber()
	upvote: number;

	@IsNumber()
	downvote: number;

	@IsString()
	password: string;

	@IsString()
	writer: string;

	@IsString()
	ip: string;

	@IsDate()
	createdAt!: Date;

	@IsDate()
	updatedAt: Date | null;

	@IsDate()
	deletedAt!: Date | null;
}

export class DeleteRepliesDTO {
	@IsNumber()
	code: number;

	@IsString()
	password: string;

	@IsString()
	writer: string;
}