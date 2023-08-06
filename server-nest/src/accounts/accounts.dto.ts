import { PartialType, PickType } from "@nestjs/mapped-types";
import { Accounts } from "./accounts.entity";
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

//Entity 클래스는 실제 테이블과 매핑되어 만일 변경되게 되면 여러 다른 클래스에 영향을 끼치고, DTO 클래스는 View와 통신하며 자주 변경되므로 분리
export class CreateAccountsDTO extends PickType(Accounts, ["uuid", "id", "password", "nickname", "email"] as const) {
	uuid: string;
	
	@IsString()
	id: string;
	@IsStrongPassword()
	password: string;
	@IsString()
	nickname: string;
	@IsEmail()
	email: string;
}

export class UpdateAccountsDTO extends PartialType(Accounts) {
	@IsString()
	uuid?: string;
	@IsString()
	id?: string;
	@IsStrongPassword()
	password?: string;
}

export class DeleteAccountsDTO extends PickType(Accounts, ["uuid", "id", "password"] as const) {
	@IsString()
	uuid: string;
	@IsString()
	id: string;
	@IsString()
	password: string;
}