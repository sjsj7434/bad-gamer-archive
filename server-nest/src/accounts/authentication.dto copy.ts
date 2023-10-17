import { PartialType, PickType } from "@nestjs/mapped-types";
import { IsString } from 'class-validator';
import { Authentication } from "./authentication.entity";

//Entity 클래스는 실제 테이블과 매핑되어 만일 변경되게 되면 여러 다른 클래스에 영향을 끼치고, DTO 클래스는 View와 통신하며 자주 변경되므로 분리
export class CreateAuthenticationDTO extends PickType(Authentication, ["uuid", "type", "data"] as const) {
	@IsString()
	uuid: string;
	@IsString()
	type: string;
	@IsString()
	data: string;
}

export class UpdateAuthenticationDTO extends PartialType(Authentication) {
	@IsString()
	uuid?: string;
	@IsString()
	type?: string;
	@IsString()
	data?: string;
}

export class DeleteAuthenticationDTO extends PickType(Authentication, ["uuid", "type", "data"] as const) {
	@IsString()
	uuid: string;
	@IsString()
	type: string;
	@IsString()
	data: string;
}