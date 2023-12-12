import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

// This will create following database table
// If table is already exsists there could be error
@Entity()
export class AccountDetail {
	/**
	 * 자동으로 생성되는 코드
	 */
	@PrimaryGeneratedColumn()
	code: number;

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
	 * stove 인증 계정 코드
	 */
	@Column({
		type: "varchar",
		length: 100,
		nullable: true,
		select: false,
	})
	stoveCode: string;

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