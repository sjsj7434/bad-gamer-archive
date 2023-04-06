import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// This will create following database table
@Entity()
export class Accounts {
	@PrimaryGeneratedColumn()
	code: number;

	@Column("varchar", { length: 200 })
	id: string;

	@Column()
	age: number;
}