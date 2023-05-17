import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

// This will create following database table
// If table is already exsists there could be error
@Entity()
export class Accounts {
	/**
	 * 자동으로 생성되는 코드
	 */
	@PrimaryGeneratedColumn()
	code: number;

	/**
	 * 유저 ID
	 */
	@Column({
		type: "varchar"
		, length: 50
		, nullable: false
		, unique: true
	})
	id: string;

	/**
	 * 유저 닉네임
	 */
	@Column({
		type: "varchar"
		, length: 60
		, nullable: false
		, unique: true
	})
	nickname: string;

	/**
	 * 유저 이메일 / 이메일을 아이디로 사용하여 로그인한다? 왜냐면 비밀번호 찾기할 때 그냥 갖다 쓰니까
	 */
	@Column({
		type: "varchar"
		, length: 100
		, nullable: false
	})
	email: string;

	/**
	 * 유저 비밀번호(암호화), Salt는 암호화된 비밀번호에 포함되어있으니 따로 저장할 필요 없음
	 */
	@Column({
		type: "varchar"
		, length: 100
		, nullable: false
	})
	password: string;

	/**
	 * lostark 인증 캐릭터
	 */
	@Column({
		type: "varchar"
		, length: 100
		, nullable: true
	})
	lostarkMainCharacter: string;

	/**
	 * 유저 마지막 로그인 날짜
	 */
	@Column({
		type: "datetime"
		, nullable: true
	})
	lastLogin: Date | null;

	/**
	 * 유저 비밀번호 변경 일자
	 */
	@Column({
		type: "datetime"
		, nullable: true
	})
	passwordChangeDate: Date | null;

	/**
	 * 유저 아이디 및 비밀번호 찾기 힌트 질문
	 */
	@Column({
		type: "varchar"
		, length: 200
		, nullable: true
	})
	personalQuestion: string;

	/**
	 * 유저 아이디 및 비밀번호 찾기 힌트 질문에 대한 답변
	 */
	@Column({
		type: "varchar"
		, length: 100
		, nullable: true
	})
	personalAnswer: string;

	/**
	 * 로그인 성공한 IP
	 */
	@Column({
		type: "varchar"
		, length: 50
		, nullable: true
	})
	loginSuccessIP: string;

	/**
	 * 로그인 실패한 IP
	 */
	@Column({
		type: "varchar"
		, length: 50
		, nullable: true
	})
	loginFailIP: string;

	/**
	 * 유저 로그인할 때 비밀번호 틀린 횟수
	 */
	@Column({
		type: "tinyint" //0 ~ 255
		, nullable: false
		, default: 0
	})
	loginFailCount: number;

	/**
	 * 유저 계정 잠김
	 */
	@Column({
		type: "boolean"
		, nullable: false
		, default: false
	})
	isLocked: boolean;

	/**
	 * 유저 계정 잃어버림
	 */
	@Column({
		type: "boolean"
		, nullable: false
		, default: false
	})
	isLost: boolean;

	/**
	 * 유저 계정 정지당함
	 */
	@Column({
		type: "boolean"
		, nullable: false
		, default: false
	})
	isBanned: boolean;

	/**
	 * 유저 계정 생성일자(자동)
	 */
	@CreateDateColumn()
	createdAt!: Date;

	/**
	 * 유저 계정 변경일자(자동)
	 */
	@UpdateDateColumn()
	updatedAt!: Date;

	/**
	 * 유저 계정 삭제일자(자동), soft delete
	 */
	@DeleteDateColumn()
	deletedAt!: Date | null;
}