import { Entity, Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PersonalBlackList {
	/**
	 * 자동으로 생성되는 코드
	 */
	@PrimaryGeneratedColumn()
	code: number;

	/**
	 * 블랙 리스트 소유자
	 */
	@Column({
		type: "varchar",
		length: 50,
		nullable: false,
		select: false,
	})
	ownerUUID: string;

	/**
	 * 블랙 리스트 사유
	 */
	@Column({
		type: "varchar",
		length: 200,
	})
	blackReason: string;

	/**
	 * 블랙 리스트에 적힌 유저 uuid
	 */
	@Column({
		type: "varchar",
		length: 50,
		nullable: false,
		select: false,
	})
	blackUUID: string;

	/**
	 * 블랙 리스트에 적혔을 때의 유저 닉네임
	 */
	@Column({
		type: "varchar",
		length: 60,
		nullable: false,
	})
	blackNickname: string;

	/**
	 * 블랙 리스트에 적힌 날짜
	 */
	@CreateDateColumn()
	createdAt!: Date;

	/**
	 * 블랙 리스트에서 삭제한 날짜, soft delete
	 */
	@DeleteDateColumn()
	deletedAt!: Date | null;
}