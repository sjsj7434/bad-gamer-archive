import { IsNumber, IsString, IsDate, IsBoolean, IsNotEmpty } from 'class-validator';

//Entity 클래스는 실제 테이블과 매핑되어 만일 변경되게 되면 여러 다른 클래스에 영향을 끼치고, DTO 클래스는 View와 통신하며 자주 변경되므로 분리
export class CreateBoardsDTO {
	category: string;

	@IsString()
	title: string;

	@IsString()
	content: string;

	@IsBoolean()
	hasImage: boolean;

	@IsString()
	password: string;

	writer: string;

	ip: string;
}

export class UpdateBoardsDTO {
	@IsNumber()
	@IsNotEmpty()
	code: number;

	@IsString()
	title: string;

	@IsString()
	content: string;

	@IsBoolean()
	hasImage: boolean;

	@IsString()
	password: string;

	@IsString()
	writer: string;

	updatedAt: Date | null;
}

export class DeleteBoardsDTO {
	@IsNumber()
	@IsNotEmpty()
	code: number;

	@IsString()
	password: string;

	@IsString()
	writer: string;
}