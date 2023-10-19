import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

// This will create following database table
// If table is already exsists there could be error
@Entity()
export class Log {
	/**
	 * 자동으로 생성되는 코드
	 */
	@PrimaryGeneratedColumn({
		type: "int",
		unsigned: true,
	})
	code: number;

	/**
	 * 로그 구분
	 */
	@Column({
		type: "varchar",
		length: 100,
		nullable: false,
	})
	type: string;

	/**
	 * 로그 내용
	 */
	@Column({
		type: "varchar",
		length: 500,
		nullable: false,
	})
	data: string;

	/**
	 * ip
	 */
	@Column({
		type: "varchar",
		length: 50,
	})
	ip: string;

	/**
	 * 로그 생성일자(자동)
	 */
	@CreateDateColumn()
	createdAt!: Date;
}