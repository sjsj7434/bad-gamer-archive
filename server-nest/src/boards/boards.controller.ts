import { Param, Controller, Get } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Boards } from './boards.entity';

@Controller("boards")
export class  BoardsController {
	constructor(private boardsService: BoardsService) { }

	@Get("code/:contentCode")
	async findWithCode(@Param("contentCode") contentCode: number): Promise<{ data: Boards | null }> {
		console.log("[Controller-boards-findWithCode]");
		
		const result = await this.boardsService.findWithCode(contentCode);
		console.log(result);

		if(result === null){
			console.log("findWithCode is null");
		}

		return {data: result};
	}
}