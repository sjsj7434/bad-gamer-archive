import { OmitType, PartialType, PickType } from "@nestjs/mapped-types";
import { IsEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { LostarkHelp } from "./lostarkHelp.entity";

//Entity 클래스는 실제 테이블과 매핑되어 만일 변경되게 되면 여러 다른 클래스에 영향을 끼치고, DTO 클래스는 View와 통신하며 자주 변경되므로 분리
export class CreateLostarkHelpDTO extends OmitType(LostarkHelp, ["code", "createdAt"] as const) {
	@IsString()
	category: string;
	@IsString()
	title: string;
	@IsString()
	content: string;
	@IsEmpty()
	writerUUID: string;
}

export class UpdateLostarkHelpDTO extends PartialType(LostarkHelp) {
	@IsNumber()
	code: number;
	@IsString()
	category: string;
	@IsOptional() @IsString()
	title: string;
	@IsOptional() @IsString()
	content: string;
}

export class DeleteLostarkHelpDTO extends PickType(LostarkHelp, ["code"] as const) {
	@IsNumber()
	code: number;
}