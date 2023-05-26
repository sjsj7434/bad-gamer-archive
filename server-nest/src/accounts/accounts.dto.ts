export class AccountsDTO {
	code: number;
	id: string;
	nickname: string;
	email: string;
	password: string;
	lostarkMainCharacter: string;
	loginFailCount: number;
	lastLogin: Date;
	passwordChangeDate: Date;
	personalQuestion: string;
	personalAnswer: string;
}