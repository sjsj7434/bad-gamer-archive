import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Boards } from './boards.entity';

// This will create following database table
// If table is already exsists there could be error

//이모티콘 때문에 저장 오류가 발생한다면
//ALTER DATABASE game_agora CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
//ALTER TABLE Replies CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_bin

@Entity()
export class Replies {
	@ManyToOne(() => Boards, (boards) => boards.replies)
	@JoinColumn({ name: "parentContentCode", referencedColumnName: "code" }) //this code reference the boards.code column
	// @JoinColumn() //this decorator is optional for @ManyToOne, This code will create a boardsCode column in the database
	// By default your relation always refers to [the primary column] of the related entity
	// https://typeorm.io/relations#joincolumn-options
	boards: Boards;
	
	/**
	 * 자동으로 생성되는 코드
	 */
	@PrimaryGeneratedColumn({
		type: "int",
		unsigned: true,
	})
	code: number;

	/**
	 * 상위 게시글 코드
	 */
	@Column({
		type: "int",
		unsigned: true,
		nullable: false,
	})
	parentContentCode: number;

	/**
	 * 상위 댓글 코드
	 */
	@Column({
		type: "int",
		unsigned: true,
		nullable: false,
	})
	parentReplyCode: number;

	/**
	 * 댓글 깊이(댓글, 대댓글...)
	 */
	@Column({
		type: "smallint",
		unsigned: true,
		nullable: false,
	})
	level: number;

	/**
	 * 댓글 순서
	 */
	@Column({
		type: "int",
		unsigned: true,
		nullable: false,
	})
	replyOrder: number;

	/**
	 * 댓글 내용
	 */
	@Column({
		type: "text",
		nullable: false,
	})
	content: string;

	/**
	 * 댓글 추천수
	 */
	@Column({
		type: "int",
		unsigned: true,
		default: 0,
		nullable: false,
	})
	upvote: number;

	/**
	 * 댓글 비추천수
	 */
	@Column({
		type: "int",
		unsigned: true,
		default: 0,
		nullable: false,
	})
	downvote: number;

	/**
	 * 익명 댓글 수정&삭제 비밀번호
	 */
	@Column({
		type: "varchar",
		length: 20,
		nullable: true,
	})
	password: string;

	/**
	 * 작성자 ID
	 */
	@Column({
		type: "varchar",
		length: 50,
		nullable: false,
	})
	writer: string;

	/**
	 * 작성자 IP
	 */
	@Column({
		type: "varchar",
		length: 50,
	})
	ip: string;

	/**
	 * 댓글 생성일자(자동)
	 */
	@CreateDateColumn()
	createdAt!: Date;

	/**
	 * 댓글 변경일자(수동)
	 */
	@Column({
		type: "datetime",
		nullable: true,
	})
	updatedAt: Date | null;

	/**
	 * 댓글 삭제일자(자동), soft delete
	 */
	@DeleteDateColumn()
	deletedAt!: Date | null;
}