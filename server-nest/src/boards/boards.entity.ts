import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

// This will create following database table
// If table is already exsists there could be error
@Entity()
export class Boards {
	/**
	 * 자동으로 생성되는 코드
	 */
	@PrimaryGeneratedColumn()
	code: number;

	/**
	 * 게시글 구분
	 */
	@Column({
		type: "varchar"
		, length: 50
		, nullable: false
	})
	category: string;

	/**
	 * 게시글 제목
	 */
	@Column({
		type: "varchar"
		, length: 200
		, nullable: false
	})
	title: string;

	/**
	 * 게시글 내용
	 */
	@Column({
		type: "text"
		, nullable: false
	})
	content: string;

	/**
	 * 작성자 ID
	 */
	@Column({
		type: "varchar"
		, length: 50
		, nullable: false
	})
	writer: string;

	/**
	 * 작성자 ip
	 */
	@Column({
		type: "varchar"
		, length: 50
	})
	ip: string;

	/**
	 * 게시글 생성일자(자동)
	 */
	@CreateDateColumn()
	createdAt!: Date;

	/**
	 * 게시글 변경일자(자동)
	 */
	@UpdateDateColumn()
	updatedAt!: Date;

	/**
	 * 게시글 삭제일자(자동), soft delete
	 */
	@DeleteDateColumn()
	deletedAt!: Date | null;
}