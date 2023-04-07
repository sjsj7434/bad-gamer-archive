import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Accounts } from './accounts.entity';
import { AccountsDTO } from './accounts.dto';

@Injectable()
export class AccountsService {
	constructor(
		@InjectRepository(Accounts) private accountsRepository: Repository<Accounts>,
	) { }

	/**
	 * ID로 1개의 계정을 찾는다
	 */
	findWithID(accountID: string): Promise<Accounts | null> {
		return this.accountsRepository.findOne({
			where: {
				id: accountID,
			},
		});
	}

	/**
	 * Controller에서 넘겨준 정보를 사용하여 계정을 전부 찾는다
	 */
	findAll(): Promise<Accounts[]> {
		return this.accountsRepository.find({
			// where: whereCondition,
			// take, skip / it is for the pagination
			// order
		});
	}

	/**
	 * 계정을 생성한다
	 */
	async createAccount(dto: AccountsDTO): Promise<Accounts | null> {
		await this.accountsRepository.save(dto)

		return;
	}

	/**
	 * ID에 맞는 계정을 수정한다
	 * find > 정보 수정 > save 처리
	 */
	async updateAccount(dto: AccountsDTO) {
		const account = await this.accountsRepository.findOne({
			where: {
				age: dto.age,
			}
		});

		account.id = dto.id;

		await this.accountsRepository.save(account);
	}

	/**
	 * code에 맞는 계정을 삭제(논리 삭제)
	 * find > 정보 수정 > save 처리
	 */
	async deleteAccount(dto: AccountsDTO) {
		await this.accountsRepository.softDelete({
			code: dto.code
		});
	}
}