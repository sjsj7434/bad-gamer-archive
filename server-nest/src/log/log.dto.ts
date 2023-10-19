import { OmitType } from "@nestjs/mapped-types";
import { Log } from "./log.entity";
import { IsOptional, IsString } from "class-validator";

//Entity 클래스는 실제 테이블과 매핑되어 만일 변경되게 되면 여러 다른 클래스에 영향을 끼치고, DTO 클래스는 View와 통신하며 자주 변경되므로 분리
export class CreateLogDTO extends OmitType(Log, ["code", "createdAt"] as const) {
	@IsString()
	type: string;
	@IsString()
	data: string;
	@IsOptional() @IsString()
	ip: string;
}