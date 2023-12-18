import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { Authentication } from './authentication.entity';
import { LostArkKnownPost } from 'src/lostark/post/known/lostArkKnownPost.entity';

// This will create following database table
// If table is already exsists there could be error
@Entity()
export class Account {
	@OneToMany(() => Authentication, (authentication) => authentication.account)
	authentication: Authentication[];

	@OneToMany(() => LostArkKnownPost, (lostArkKnownPost) => lostArkKnownPost.account)
	lostArkKnownPost: LostArkKnownPost[];

	/**
	 * 자동으로 생성되는 코드
	 */
	@PrimaryGeneratedColumn()
	code: number;

	/**
	 * 유저 uuid, 서버에서 랜덤 생성값을 부여함, 사용자에게 공개하지 않는 것이 중요
	 */
	@Column({
		type: "varchar",
		length: 50,
		nullable: false,
		unique: true,
		select: false,
	})
	uuid: string;

	/**
	 * 유저 아이디 / 아이디로 로그인
	 */
	@Column({
		type: "varchar",
		length: 50,
		nullable: false,
		unique: true,
		select: false,
	})
	id: string;

	/**
	 * 유저 이메일
	 */
	@Column({
		type: "varchar",
		length: 50,
		nullable: false,
		select: false,
	})
	email: string;

	/**
	 * 유저 닉네임
	 */
	@Column({
		type: "varchar",
		length: 60,
		nullable: false,
		unique: true,
	})
	nickname: string;

	/**
	 * 유저 비밀번호(암호화), Salt는 암호화된 비밀번호에 포함되어있으니 따로 저장할 필요 없음
	 */
	@Column({
		type: "varchar",
		length: 100,
		nullable: false,
		select: false,
	})
	password: string;

	/**
	 * 유저 경험치(커뮤력), 최대에 도달하면 진화 가능
	 */
	@Column({
		type: "int",
		unsigned: true,
		nullable: false,
		default: 0,
	})
	exp: number;

	/**
	 * 유저 진화 회수
	 */
	@Column({
		type: "smallint",
		unsigned: true,
		nullable: false,
		default: 0,
	})
	evolution: number;

	/**
	 * 작성한 글 개수
	 */
	@Column({
		type: "int",
		unsigned: true,
		nullable: false,
		default: 0,
	})
	postWriteCount: number;

	/**
	 * 작성한 댓글 개수
	 */
	@Column({
		type: "int",
		unsigned: true,
		nullable: false,
		default: 0,
	})
	replyWriteCount: number;

	/**
	 * 삭제한 글 개수
	 */
	@Column({
		type: "int",
		unsigned: true,
		nullable: false,
		default: 0,
	})
	postDeleteCount: number;

	/**
	 * 삭제한 댓글 개수
	 */
	@Column({
		type: "int",
		unsigned: true,
		nullable: false,
		default: 0,
	})
	replyDeleteCount: number;

	/**
	 * 프로필 사진 url
	 */
	@Column({
		type: "varchar",
		length: 200,
		nullable: true,
		select: false,
	})
	profilePictureURL: string;

	/**
	 * 프로필 내용
	 */
	@Column({
		type: "text",
		nullable: true,
		select: false,
	})
	introduce: string;

	/**
	 * 유저 비밀번호 변경 일자
	 */
	@Column({
		type: "datetime",
		nullable: true,
		select: false,
	})
	passwordChangeDate: Date | null;

	/**
	 * 유저 마지막 로그인 날짜
	 */
	@Column({
		type: "datetime",
		nullable: true,
		select: false,
	})
	lastLogin: Date | null;

	/**
	 * 로그인 성공한 IP
	 */
	@Column({
		type: "varchar",
		length: 50,
		nullable: true,
		select: false,
	})
	loginSuccessIP: string;

	/**
	 * 로그인 실패한 IP
	 */
	@Column({
		type: "varchar",
		length: 50,
		nullable: true,
		select: false,
	})
	loginFailIP: string;

	/**
	 * 유저 로그인할 때 비밀번호 틀린 횟수
	 */
	@Column({
		type: "tinyint", //0 ~ 255
		nullable: false,
		default: 0,
		select: false,
	})
	loginFailCount: number;

	/**
	 * 유저 계정 잠김
	 */
	@Column({
		type: "boolean",
		nullable: false,
		default: false,
		select: false,
	})
	isLocked: boolean;

	/**
	 * 잠긴 날짜
	 */
	@Column({
		type: "datetime",
		nullable: true,
		select: false,
	})
	lockedAt!: Date;

	/**
	 * 휴면 계정
	 */
	@Column({
		type: "boolean",
		nullable: false,
		default: false,
		select: false,
	})
	isSleep: boolean;

	/**
	 * 휴면 날짜
	 */
	@Column({
		type: "datetime",
		nullable: true,
		select: false,
	})
	sleepdAt!: Date;

	/**
	 * 유저 계정 정지당함
	 */
	@Column({
		type: "boolean",
		nullable: false,
		default: false,
		select: false,
	})
	isBanned: boolean;

	/**
	 * 정지 날짜
	 */
	@Column({
		type: "datetime",
		nullable: true,
		select: false,
	})
	bannedAt!: Date;

	/**
	 * 유저 계정 생성일자(자동)
	 */
	@CreateDateColumn()
	createdAt!: Date;

	/**
	 * 유저 계정 탈퇴일자(자동), soft delete
	 */
	@DeleteDateColumn()
	deletedAt!: Date | null;
}