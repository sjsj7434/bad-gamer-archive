import { Param, Controller, Get, Post, Body, Ip, Req, Res, Delete, Patch } from '@nestjs/common';
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

		if (result === null) {
			console.log("getContentByCode is null");
		}
		else{
			result.ip = result.ip.split(".")[0] + (result.ip.split(".")[1] !== undefined ? "." + result.ip.split(".")[1] : "");
		}

		return { data: result };
	}

	@Get("list/:category/:page")
	async getContentListByCategory(@Param("category") category: string, @Param("page") page: number): Promise<{ data: [Boards[], number] }> {
		console.log("[Controller-boards-getContentListByCategory]");

		const result = await this.boardsService.getContentListByCategory(category, page);

		if (result === null) {
			console.log("getContentListByCategory is null");
		}
		else {
			for (let index: number = 0; index < result[0].length; index++){
				result[0][index]["ip"] = result[0][index]["ip"].split(".")[0] + (result[0][index]["ip"].split(".")[1] !== undefined ? "." + result[0][index]["ip"].split(".")[1] : "");
			}
		}

		return { data: result };
	}

	//set cookies/headers 정도만 사용하고, 나머지는 프레임워크에 떠넘기는 식으로 @Res()를 사용하는 거라면 passthrough: true 옵션은 필수! 그렇지 않으면 fetch 요청이 마무리가 안됨
	@Post(":category")
	async createContentAnonymous(@Ip() ipData: string, @Param("category") category: string, @Body() boardData: BoardsDTO, @Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<{ data: BoardsDTO | Boards }>{
		console.log("[Controller-boards-createContentWithCategory]");
		if (["anonymous", "identified"].includes(category) === true){
			boardData.category = category;
			boardData.writer = "";
			// boardData.ip = ipData;
			boardData.ip = Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5);
	
			const createdContent = await this.boardsService.createContent(boardData);
			console.log(createdContent);

			return { data: createdContent };
		}
		else{
			return { data: null };
		}
	}

	@Delete(":contentCode")
	async deleteContent(@Param("contentCode") contentCode: number, @Body() boardData: BoardsDTO): Promise<{data: boolean}> {
		console.log("[Controller-boards-deleteContent]");
		const isDeleted = await this.boardsService.softDeleteContent(contentCode, boardData.contentPassword);
		return { data: isDeleted };
	}

	@Patch("anonymous")
	async updateContentAnonymous(@Ip() ipData: string, @Body() boardData: BoardsDTO, @Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<{ data: number }> {
		console.log("[Controller-boards-updateContentAnonymous]");
		boardData.category = "anonymous";
		boardData.writer = "";
		boardData.ip = ipData;

		await this.boardsService.updateContent(boardData);

		return { data: 1 };
	}
}