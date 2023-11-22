import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Boards } from './boards.entity';

// This will create following database table
// If table is already exsists there could be error

//이모티콘 때문에 저장 오류가 발생한다면
//ALTER DATABASE game_agora CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
//ALTER TABLE boards CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_bin

@Entity()
export class VoteHistory {
	@ManyToOne(() => Boards, (boards) => boards.voteHistory)
	@JoinColumn({ name: "parentContentCode", referencedColumnName: "code" })
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
	})
	parentContentCode: number;

	/**
	 * 추천인지 비추천인지
	 */
	@Column({
		type: "varchar",
		length: 4,
		nullable: false,
	})
	voteType: string;

	/**
	 * 작성자 ID
	 */
	@Column({
		type: "varchar",
		length: 50,
		nullable: false,
		select: false,
	})
	writerID: string;

	/**
	 * 작성자 Nickname
	 */
	@Column({
		type: "varchar",
		length: 50,
		nullable: false,
	})
	writerNickname: string;

	/**
	 * 작성자 ip
	 */
	@Column({
		type: "varchar",
		length: 50,
		select: false,
	})
	ip: string;

	/**
	 * 게시글 생성일자(자동)
	 */
	@CreateDateColumn()
	createdAt!: Date;

	/**
	 * 게시글 삭제일자(자동), soft delete
	 */
	@DeleteDateColumn()
	deletedAt!: Date | null;
}