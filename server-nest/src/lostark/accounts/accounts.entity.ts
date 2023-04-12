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
	@Column("varchar", { length: 50 })
	id: string;

	/**
	 * 유저 닉네임
	 */
	@Column("varchar", { length: 60 })
	nickname: string;

	/**
	 * 유저 이메일
	 */
	@Column("varchar", { length: 100 })
	email: string;

	/**
	 * 유저 비밀번호(암호화)
	 */
	@Column("varchar", { length: 50 })
	password: string;

	/**
	 * 유저 비밀번호(암호화에 쓰일 값)
	 */
	@Column("varchar", { length: 100 })
	passwordSalt: string;

	/**
	 * 유저 마지막 로그인 날짜
	 */
	@Column("datetime")
	lastLogin: Date | null;

	/**
	 * 유저 비밀번호 변경 일자
	 */
	@Column("datetime")
	passwordChangeDate: Date | null;

	/**
	 * 유저 아이디 및 비밀번호 찾기 힌트 질문
	 */
	@Column("varchar", { length: 200 })
	personalQuestion: string;

	/**
	 * 유저 아이디 및 비밀번호 찾기 힌트 질문에 대한 답변
	 */
	@Column("varchar", { length: 100 })
	personalAnswer: string;

	/**
	 * 유저 생년월일, 나이
	 */
	@Column("int")
	age: number;

	/**
	 * 유저 로그인할 때 비밀번호 틀린 횟수
	 */
	@Column("int")
	wrongCount: number;

	/**
	 * 유저 계정 잠김
	 */
	@Column("boolean")
	isLocked: boolean;

	/**
	 * 유저 계정 잃어버림
	 */
	@Column("boolean")
	isLost: boolean;

	/**
	 * 유저 계정 정지당함
	 */
	@Column("boolean")
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