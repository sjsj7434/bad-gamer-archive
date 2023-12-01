import { OmitType, PartialType, PickType } from "@nestjs/mapped-types";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";
import { LostArkKnownPost } from "./lostArkKnownPost.entity";

//Entity 클래스는 실제 테이블과 매핑되어 만일 변경되게 되면 여러 다른 클래스에 영향을 끼치고, DTO 클래스는 View와 통신하며 자주 변경되므로 분리
export class CreateLostArkKnownPostDTO extends OmitType(LostArkKnownPost, ["code", "createdAt"] as const) {
	@IsString()
	title: string;
	@IsString()
	content: string;
	@IsString()
	password: string;
	@IsBoolean()
	hasImage: boolean;
	@IsOptional() @IsString()
	writerID: string;
	@IsOptional() @IsString()
	writerNickname: string;
}

export class UpdateLostArkKnownPostDTO extends PartialType(LostArkKnownPost) {
	@IsNumber()
	code: number;
	@IsOptional() @IsString()
	password: string;
	@IsOptional() @IsString()
	title: string;
	@IsOptional() @IsString()
	content: string;
	@IsOptional() @IsBoolean()
	hasImage: boolean;
	@IsOptional() @IsString()
	writerID: string;
	@IsOptional() @IsString()
	writerNickname: string;
}

export class DeleteLostArkKnownPostDTO extends PickType(LostArkKnownPost, ["code", "writerID"] as const) {
	@IsNumber()
	code: number;
}