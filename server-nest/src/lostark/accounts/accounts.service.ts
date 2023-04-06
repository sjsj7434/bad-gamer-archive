import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Accounts } from './accounts.entity';
import { AccountsDTO } from './accounts.dto';

@Injectable()
export class AccountsService {
	constructor(@InjectRepository(Accounts) private accountsRepository: Repository<Accounts>) { }

	findOneByID(findID: string): Promise<Accounts | null> {
		return this.accountsRepository.findOneBy({ "id": findID });
	}

	async createOne(body: AccountsDTO): Promise<Accounts | null> {
		console.log('[Service-user-create] => ', body);
		const test = this.accountsRepository.create({ "id": body.id, "age": body.age });
		await this.accountsRepository.save(body);

		return;
	}
}