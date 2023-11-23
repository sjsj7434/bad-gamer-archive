import { PartialType, PickType } from "@nestjs/mapped-types";
import { IsNumber, IsString, IsDate, IsOptional } from 'class-validator';
import { LostArkUnknownReply } from "./lostArkUnknownReply.entity";

//Entity 클래스는 실제 테이블과 매핑되어 만일 변경되게 되면 여러 다른 클래스에 영향을 끼치고, DTO 클래스는 View와 통신하며 자주 변경되므로 분리
export class BasicLostArkUnknownReplyDTO extends LostArkUnknownReply {
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

export class CreateLostArkUnknownReplyDTO extends PartialType(BasicLostArkUnknownReplyDTO) { }

export class DeleteLostArkUnknownReplyDTO extends PickType(BasicLostArkUnknownReplyDTO, ["code", "password"] as const) {
	@IsNumber()
	code: number;
	@IsOptional()
	@IsString()
	password: string;
}

export class UpdateLostArkUnknownReplyDTO extends PartialType(BasicLostArkUnknownReplyDTO) { }