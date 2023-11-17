import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

// This will create following database table
// If table is already exsists there could be error
@Entity()
export class Level {
	/**
	 * 자동으로 생성되는 코드
	 */
	@PrimaryGeneratedColumn()
	code: number;

	/**
	 * 등급
	 */
	@Column({
		type: "int",
		nullable: false,
		unsigned: true,
		unique: true,
	})
	level: number;

	/**
	 * 등급 최소 요구치
	 */
	@Column({
		type: "int",
		nullable: false,
		unsigned: true,
		unique: true,
	})
	minumumEXP: number;

	/**
	 * 등급 최대 요구치
	 */
	@Column({
		type: "int",
		nullable: false,
		unsigned: true,
		unique: true,
	})
	maximumEXP: number;

	/**
	 * 등급 활성활
	 */
	@Column({
		type: "boolean",
		nullable: false,
		default: true,
	})
	isActive: boolean;

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