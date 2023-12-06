import { Entity, Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

// This will create following database table
// If table is already exsists there could be error
@Entity()
export class LostarkCharacter {
	/**
	 * 테이블의 키
	 */
	@PrimaryGeneratedColumn({
		unsigned: true
	})
	code: number;

	/**
	 * 유저 uuid, 서버에서 랜덤 생성값을 부여함, 사용자에게 공개하지 않는 것이 중요
	 */
	@Column({
		type: "varchar",
		length: 50,
		nullable: false,
		select: false,
	})
	uuid: string;

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
	 * 서버
	 */
	@Column({
		type: "varchar",
		length: 40,
	})
	serverName: string;

	/**
	 * 닉네임
	 */
	@Column({
		type: "varchar",
		length: 100,
	})
	characterName: string;

	/**
	 * 클래스
	 */
	@Column({
		type: "varchar",
		length: 40,
	})
	characterClass: string;

	/**
	 * 전투 레벨
	 */
	@Column({
		type: "int",
		unsigned: true,
	})
	characterLevel: number;

	/**
	 * 최고 아이템 레벨
	 */
	@Column({
		type: "varchar",
		length: 20,
	})
	maxItemLevel: string;

	/**
	 * 현재 아이템 레벨
	 */
	@Column({
		type: "varchar",
		length: 20,
	})
	avgItemLevel: string;

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