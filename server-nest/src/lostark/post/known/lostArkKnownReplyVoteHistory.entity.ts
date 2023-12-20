import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { LostArkKnownReply } from './lostArkKnownReply.entity';

// This will create following database table
// If table is already exsists there could be error

@Entity()
export class LostArkKnownReplyVoteHistory {
	@ManyToOne(() => LostArkKnownReply, (reply) => reply.voteHistory)
	@JoinColumn({ name: "replyCode", referencedColumnName: "code" })
	reply: LostArkKnownReply;

	/**
	 * 자동으로 생성되는 코드
	 */
	@PrimaryGeneratedColumn({
		type: "int",
		unsigned: true,
	})
	code: number;

	/**
	 * 댓글 코드
	 */
	@Column({
		type: "int",
		unsigned: true,
	})
	replyCode: number;

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
	 * 작성자 UUID
	 */
	@Column({
		type: "varchar",
		length: 50,
		nullable: false,
		select: false,
	})
	voterUUID: string;

	/**
	 * 작성자 ID
	 */
	@Column({
		type: "varchar",
		length: 50,
		nullable: false,
		select: false,
	})
	voterID: string;

	/**
	 * 작성자 Nickname
	 */
	@Column({
		type: "varchar",
		length: 50,
		nullable: false,
	})
	voterNickname: string;

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