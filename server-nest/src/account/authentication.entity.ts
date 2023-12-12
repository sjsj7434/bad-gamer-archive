import { Entity, Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Account } from './account.entity';

/**
 * 인증 정보 테이블
 */
@Entity()
export class Authentication {
	@ManyToOne(() => Account, (account) => account.authentication)
	@JoinColumn({ name: "uuid", referencedColumnName: "uuid" }) //this code reference the account.code column
	// @JoinColumn() //this decorator is optional for @ManyToOne, This code will create a boardsCode column in the database
	// By default your relation always refers to [the primary column] of the related entity
	// https://typeorm.io/relations#joincolumn-options
	account: Account;

	/**
	 * 유저 uuid, 서버에서 랜덤 생성값을 부여함, 사용자에게 공개하지 않는 것이 중요
	 */
	@PrimaryColumn({
		type: "varchar",
		length: 50,
		nullable: false,
		select: false,
	})
	uuid: string;

	/**
	 * 대분류 : 로스크아크, 데바데...
	 */
	@PrimaryColumn({
		type: "varchar",
		length: 100,
	})
	gameName: string;

	/**
	 * 분류 : stove 인증 계정 코드, lostark 캐릭, 스팀 플레이타임...
	 */
	@PrimaryColumn({
		type: "varchar",
		length: 100,
	})
	type: string;

	/**
	 * 인증 내용
	 */
	@Column({
		type: "varchar",
		length: 100,
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