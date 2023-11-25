import { PartialType, PickType } from "@nestjs/mapped-types";
import { IsNumber, IsString, IsDate, IsOptional } from 'class-validator';
import { Replies } from "./replies.entity";

//Entity 클래스는 실제 테이블과 매핑되어 만일 변경되게 되면 여러 다른 클래스에 영향을 끼치고, DTO 클래스는 View와 통신하며 자주 변경되므로 분리
export class BasicRepliesDTO extends Replies {
	@IsNumber()
	code: number;
	@IsNumber()
	parentContentCode: number;
	@IsNumber()
	parentReplyCode: number;
	@IsNumber()
	level: number;
	@IsNumber()
	replyOrder: number;
	@IsString()
	content: string;
	@IsNumber()
	upvote: number;
	@IsNumber()
	downvote: number;
	@IsString()
	password: string;
	@IsString()
	ip: string;
	@IsString()
	writerID: string;
	@IsString()
	writerNickname: string;
	@IsDate()
	createdAt: Date;
	@IsDate()
	updatedAt: Date | null;
	@IsDate()
	deletedAt: Date | null;
}

export class CreateRepliesDTO extends PartialType(BasicRepliesDTO) { }

export class DeleteRepliesDTO extends PickType(BasicRepliesDTO, ["code", "password"] as const) {
	@IsNumber()
	code: number;
	@IsOptional()
	@IsString()
	password: string;
}

export class UpdateRepliesDTO extends PartialType(BasicRepliesDTO) { }

// export class CreateRepliesDTO extends OmitType(Replies, ["code", "upvote", "downvote", "createdAt", "updatedAt", "deletedAt"] as const) {
// 	@IsNumber()
// 	parentReplyCode: number;
// 	@IsNumber()
// 	parentContentCode: number;
// 	@IsNumber()
// 	level: number;
// 	@IsNumber()
// 	replyOrder: number;
// 	@IsString()
// 	content: string;
// 	// @IsString()
// 	ip: string;
// 	@IsString()
// 	password: string;
// 	@IsString()
// 	writerID: string;
// 	@IsString()
// 	writerNickname: string;
// }

// export class UpdateRepliesDTO extends PartialType(Replies) {
// 	@IsNumber()
// 	code: number;
// 	@IsNumber()
// 	parentReplyCode: number;
// 	@IsNumber()
// 	parentContentCode: number;
// 	@IsString()
// 	content: string;
// 	@IsNumber()
// 	upvote: number;
// 	@IsNumber()
// 	downvote: number;
// 	@IsString()
// 	password: string;
// 	@IsString()
// 	writerID: string;
// 	@IsString()
// 	writerNickname: string;
// 	@IsString()
// 	ip: string;
// 	@IsDate()
// 	createdAt!: Date;
// 	@IsDate()
// 	updatedAt: Date | null;
// 	@IsDate()
// 	deletedAt!: Date | null;
// }

// export class DeleteRepliesDTO extends PickType(Replies, ["code", "password", "writerID"] as const) {
// 	@IsNumber()
// 	code: number;
// 	@IsString()
// 	password: string;
// 	@IsString()
// 	writerID: string;
// }