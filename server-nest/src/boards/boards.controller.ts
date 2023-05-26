import { Param, Controller, Get, Post, Body, Ip, Req, Res } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Boards } from './boards.entity';
import { BoardsDTO } from './boards.dto';

@Controller("boards")
export class BoardsController {
	constructor(private boardsService: BoardsService) { }

	@Get("view/:contentCode")
	async getContentByCode(@Param("contentCode") contentCode: number): Promise<{ data: Boards | null }> {
		console.log("[Controller-boards-getContentByCode]");

		const result = await this.boardsService.getContentByCode(contentCode);
		console.log(result);

		if (result === null) {
			console.log("getContentByCode is null");
		}

		return { data: result };
	}

	@Get("list/:category/:page")
	async getContentListByCategory(@Param("category") category: string, @Param("page") page: number): Promise<{ data: [Boards[], number] }> {
		console.log("[Controller-boards-getContentListByCategory]");

		const result = await this.boardsService.getContentListByCategory(category, page);
		console.log(result);

		if (result === null) {
			console.log("getContentListByCategory is null");
		}

		return { data: result };
	}

	//set cookies/headers 정도만 사용하고, 나머지는 프레임워크에 떠넘기는 식으로 @Res()를 사용하는 거라면 passthrough: true 옵션은 필수! 그렇지 않으면 fetch 요청이 마무리가 안됨
	@Post("anonymous")
	async createContentAnonymous(@Ip() ipData: string, @Body() boardData: BoardsDTO, @Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<{ data: BoardsDTO | Boards }>{
		console.log("[Controller-boards-createContentAnonymous]");
		boardData.category = "anonymous";
		boardData.writer = "";
		boardData.ip = ipData;

		const createdContent = await this.boardsService.createContent(boardData);
		console.log(createdContent);

		return { data: createdContent };
	}
}