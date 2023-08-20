import { OmitType, PartialType, PickType } from "@nestjs/mapped-types";
import { Boards } from "./boards.entity";
import { IsBoolean, IsNumber, IsString } from "class-validator";

//Entity 클래스는 실제 테이블과 매핑되어 만일 변경되게 되면 여러 다른 클래스에 영향을 끼치고, DTO 클래스는 View와 통신하며 자주 변경되므로 분리
export class CreateBoardsDTO extends OmitType(Boards, ["code", "createdAt"] as const) {
	@IsString()
	title: string;
	@IsString()
	content: string;
	@IsString()
	password: string;
	@IsBoolean()
	hasImage: boolean;
}

export class UpdateBoardsDTO extends PartialType(Boards) {
	@IsNumber()
	code?: number;
	@IsString()
	password?: string;
	@IsString()
	title?: string;
	@IsString()
	content?: string;
	@IsBoolean()
	hasImage?: boolean;
	@IsString()
	writerID?: string;
}

export class DeleteBoardsDTO extends PickType(Boards, ["code", "password"] as const) {
	@IsNumber()
	code: number;
	@IsString()
	password: string;
}