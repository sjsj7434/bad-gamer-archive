import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

// This will create following database table
// If table is already exsists there could be error
@Entity()
export class ErrorLog {
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
	 * 에러 이름
	 */
	@Column({
		type: "varchar",
		length: 100,
		nullable: false,
	})
	name: string;

	/**
	 * 에러 내용
	 */
	@Column({
		type: "varchar",
		length: 2000,
		nullable: false,
	})
	message: string;

	/**
	 * ip
	 */
	@Column({
		type: "varchar",
		length: 50,
	})
	ip: string;

	/**
	 * id
	 */
	@Column({
		type: "varchar",
		length: 50,
	})
	id: string;

	/**
	 * 로그 생성일자(자동)
	 */
	@CreateDateColumn()
	createdAt!: Date;
}