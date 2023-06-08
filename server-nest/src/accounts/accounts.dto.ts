import { IsEmail, IsNumber, IsString, IsDate, IsBoolean, IsNotEmpty } from 'class-validator';

//Entity 클래스는 실제 테이블과 매핑되어 만일 변경되게 되면 여러 다른 클래스에 영향을 끼치고, DTO 클래스는 View와 통신하며 자주 변경되므로 분리
export class AccountsDTO {
	@IsNumber()
	code: number;

	@IsString()
	@IsNotEmpty()
	id: string;

	@IsString()
	nickname: string;
	
	@IsEmail()
	email: string;
	
	@IsString()
	password: string;
	
	@IsString()
	lostarkMainCharacter: string;
	
	@IsDate()
	lastLogin: Date | null;

	@IsDate()
	passwordChangeDate: Date | null;

	@IsString()
	personalQuestion: string;

	@IsString()
	personalAnswer: string;

	@IsString()
	loginSuccessIP: string;

	@IsString()
	loginFailIP: string;

	@IsNumber()
	loginFailCount: number;
	
	@IsBoolean()
	isLocked: boolean;

	@IsBoolean()
	isLost: boolean;

	@IsBoolean()
	isBanned: boolean;

	@IsDate()
	createdAt!: Date;

	@IsDate()
	updatedAt!: Date;

	@IsDate()
	deletedAt!: Date | null;
}