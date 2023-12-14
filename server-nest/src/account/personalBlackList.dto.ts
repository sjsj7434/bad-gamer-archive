import { PartialType, PickType } from "@nestjs/mapped-types";
import { IsEmpty, IsNumber, IsString } from 'class-validator';
import { PersonalBlackList } from "./personalBlackList.entity";

//Entity 클래스는 실제 테이블과 매핑되어 만일 변경되게 되면 여러 다른 클래스에 영향을 끼치고, DTO 클래스는 View와 통신하며 자주 변경되므로 분리
export class CreatePersonalBlackListDTO extends PickType(PersonalBlackList, ["ownerUUID", "blackReason", "blackUUID", "blackNickname"] as const) {
	@IsEmpty()
	ownerUUID: string;
	@IsString()
	blackReason: string;
	@IsEmpty()
	blackUUID: string;
	@IsString()
	blackNickname: string;
}

export class UpdatePersonalBlackListDTO extends PartialType(PersonalBlackList) {
	@IsNumber()
	code: number;
	@IsString()
	blackReason: string;
}

export class DeletePersonalBlackListDTO extends PickType(PersonalBlackList, ["code"] as const) {
	@IsNumber()
	code: number;
}