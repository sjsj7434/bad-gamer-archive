import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Accounts } from './accounts.entity';

// This will create following database table
// If table is already exsists there could be error
@Entity()
export class Authentication {
	@ManyToOne(() => Accounts, (accounts) => accounts.authentication)
	@JoinColumn({ name: "uuid", referencedColumnName: "uuid" }) //this code reference the accounts.code column
	// @JoinColumn() //this decorator is optional for @ManyToOne, This code will create a boardsCode column in the database
	// By default your relation always refers to [the primary column] of the related entity
	// https://typeorm.io/relations#joincolumn-options
	accounts: Accounts;

	/**
	 * 자동으로 생성되는 코드
	 */
	@PrimaryGeneratedColumn()
	code: number;

	/**
	 * 유저 uuid, 서버에서 랜덤 생성값을 부여함, 사용자에게 공개하지 않는 것이 중요
	 */
	@Column({
		type: "varchar"
		, length: 50
		, nullable: false
	})
	uuid: string;

	/**
	 * 분류 : stove 인증 계정 코드, lostark 캐릭, 스팀 플레이타임...
	 */
	@Column({
		type: "varchar"
		, length: 100
	})
	type: string;

	/**
	 * 인증 내용
	 */
	@Column({
		type: "varchar"
		, length: 100
	})
	data: string;

	/**
	 * 생성일자(자동)
	 */
	@CreateDateColumn()
	createdAt!: Date;

	/**
	 * 변경일자(자동)
	 */
	@UpdateDateColumn()
	updatedAt!: Date | null;

	/**
	 * 삭제일자(자동), soft delete
	 */
	@DeleteDateColumn()
	deletedAt!: Date | null;
}