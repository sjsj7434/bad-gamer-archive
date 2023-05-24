import { Param, Controller, Get, Post, Body, Ip, Req, Res } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Boards } from './boards.entity';
import { BoardsDTO } from './boards.dto';

@Controller("boards")
export class BoardsController {
	constructor(private boardsService: BoardsService) { }

	@Get("code/:contentCode")
	async findWithCode(@Param("contentCode") contentCode: number): Promise<{ data: Boards | null }> {
		console.log("[Controller-boards-findWithCode]");

		const result = await this.boardsService.findWithCode(contentCode);
		console.log(result);

		if (result === null) {
			console.log("findWithCode is null");
		}

		return { data: result };
	}

	//set cookies/headers 정도만 사용하고, 나머지는 프레임워크에 떠넘기는 식으로 @Res()를 사용하는 거라면 passthrough: true 옵션은 필수! 그렇지 않으면 fetch 요청이 마무리가 안됨
	@Post("content")
	async createContent(@Ip() ipData: string, @Body() boardData: BoardsDTO, @Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<{ data: BoardsDTO | Boards }>{
		console.log("[Controller-boards-createContent]");
		boardData.ip = ipData;

		const createdContent = await this.boardsService.createContent(boardData);
		console.log(createdContent);

		return { data: createdContent };
	}
}