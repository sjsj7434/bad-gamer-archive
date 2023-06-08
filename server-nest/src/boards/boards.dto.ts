import { IsNumber, IsString, IsDate, IsBoolean, IsNotEmpty } from 'class-validator';

//Entity 클래스는 실제 테이블과 매핑되어 만일 변경되게 되면 여러 다른 클래스에 영향을 끼치고, DTO 클래스는 View와 통신하며 자주 변경되므로 분리
export class BoardsDTO {
	@IsNumber()
	@IsNotEmpty()
	code: number;

	@IsString()
	category: string;

	@IsString()
	title: string;

	@IsString()
	content: string;

	@IsBoolean()
	hasImage: boolean;

	@IsNumber()
	view: number;

	@IsNumber()
	upvote: number;

	@IsNumber()
	downvote: number;

	@IsString()
	password: string;

	@IsString()
	writer: string;

	@IsString()
	ip: string;

	@IsDate()
	createdAt!: Date;

	@IsDate()
	updatedAt: Date | null;

	@IsDate()
	deletedAt!: Date | null;
}