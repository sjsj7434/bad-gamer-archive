export class AccountsDTO {
	code: number;
	id: string;
	nickname: string;
	email: string;
	password: string;
	encryptSalt: string;
	loginFailCount: number;
	lastLogin: Date;
	passwordChangeDate: Date;
	personalQuestion: string;
	personalAnswer: string;
}