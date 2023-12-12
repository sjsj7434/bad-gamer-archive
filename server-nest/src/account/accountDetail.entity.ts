import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Account } from './account.entity';

/**
 * 수시로 업데이트되는 유저의 정보 저장하는 테이블
 */
@Entity()
export class AccountDetail {
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