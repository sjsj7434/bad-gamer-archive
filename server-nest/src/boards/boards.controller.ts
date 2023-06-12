import { Param, Controller, Get, Post, Body, Ip, Req, Res, Delete, Patch, Query } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Boards } from './boards.entity';
import { setInterval } from 'timers';
import { Replies } from './replies.entity';
import { CreateBoardsDTO, UpdateBoardsDTO, DeleteBoardsDTO } from './boards.dto';
import { CreateRepliesDTO, UpdateRepliesDTO, DeleteRepliesDTO } from './replies.dto';

@Controller("boards")
export class BoardsController {
	constructor(private boardsService: BoardsService) { }

	@Get("view/:contentCode")
	async getContentByCode(@Param("contentCode") contentCode: number, @Query("type") type: string): Promise<{ data: Boards | null }> {
		console.log("[Controller-boards-getContentByCode]" + type);

		const result = await this.boardsService.getContentByCode(contentCode, type);

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
		// console.log(result)

		if (result !== null) {
			for (let index: number = 0; index < result[0].length; index++){
				result[0][index]["ip"] = result[0][index]["ip"].split(".")[0] + (result[0][index]["ip"].split(".")[1] !== undefined ? "." + result[0][index]["ip"].split(".")[1] : "");
			}
		}

		return { data: result };
	}

	//set cookies/headers 정도만 사용하고, 나머지는 프레임워크에 떠넘기는 식으로 @Res()를 사용하는 거라면 passthrough: true 옵션은 필수! 그렇지 않으면 fetch 요청이 마무리가 안됨
	@Post("content/anonymous")
	async createContentAnonymous(@Ip() ipData: string, @Body() boardData: CreateBoardsDTO): Promise<{ data: Boards | Boards }> {
		console.log("[Controller-boards-createContentAnonymous]");
		boardData.category = "anonymous";
		boardData.writer = "";
		// boardData.ip = ipData;
		boardData.ip = Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5);

		const createdContent = await this.boardsService.createContent(boardData);

		return { data: createdContent };
	}

	//set cookies/headers 정도만 사용하고, 나머지는 프레임워크에 떠넘기는 식으로 @Res()를 사용하는 거라면 passthrough: true 옵션은 필수! 그렇지 않으면 fetch 요청이 마무리가 안됨
	@Post("content/identified")
	async createContentIdentified(@Ip() ipData: string, @Body() boardData: CreateBoardsDTO): Promise<{ data: Boards | Boards }>{
		console.log("[Controller-boards-createContentIdentified]");
		boardData.category = "identified";
		// boardData.ip = ipData;
		boardData.ip = Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5);

		const createdContent = await this.boardsService.createContent(boardData);

		return { data: createdContent };
	}

	@Post("content/anonymous/check/password")
	async isAnonymousPasswordMatch(@Body() sendData: {code: number, password: string}): Promise<{ data: boolean }> {
		console.log("[Controller-boards-isAnonymousPasswordMatch]");

		const findContent = await this.boardsService.getContentByCode(sendData.code, "password");
		
		return { data: findContent.password === sendData.password };
	}

	@Delete("content/anonymous")
	async deleteContent(@Body() deleteBoardsDTO: DeleteBoardsDTO): Promise<{data: boolean}> {
		console.log("[Controller-boards-deleteContent]");
		const isDeleted = await this.boardsService.softDeleteContent(deleteBoardsDTO);
		return { data: isDeleted };
	}

	@Patch("content/anonymous")
	async updateContentAnonymous(@Body() updateBoardsDTO: UpdateBoardsDTO): Promise<{ data: Boards | null }> {
		console.log("[Controller-boards-updateContentAnonymous]");

		const updatedContent = await this.boardsService.updateContent(updateBoardsDTO);

		return { data: updatedContent };
	}

	@Post("content/anonymous/upvote")
	async upvoteContent(@Ip() ipData: string, @Body() sendData: { code: number }): Promise<{data: Boards | null}> {
		console.log("[Controller-boards-upvoteContent]");

		const isVotable: boolean = this.boardsService.isVotableContent(sendData.code, ipData);

		if (isVotable === true){
			const updatedContent = await this.boardsService.upvoteContent(sendData.code);

			return { data: updatedContent }
		}
		else{
			return { data: null }
		}
	}

	@Post("content/anonymous/downvote")
	async downvoteContent(@Ip() ipData: string, @Body() sendData: { code: number }){
		console.log("[Controller-boards-downvoteContent]");

		const isVotable: boolean = this.boardsService.isVotableContent(sendData.code, ipData);

		if (isVotable === true) {
			const updatedContent = await this.boardsService.downvoteContent(sendData.code);

			return { data: updatedContent }
		}
		else {
			return { data: null }
		}
	}

	@Get("reply/:contentCode/:page")
	async getReplies(@Param("contentCode") contentCode: number, @Param("page") page: number): Promise<{ data: [Replies[], number] }> {
		console.log("[Controller-boards-getReplies]");

		const repliesData = await this.boardsService.getReplies(contentCode, page);

		if (repliesData[1] === 0) {
			console.log("getReplies is nothing");
		}
		else {
			for (let index: number = 0; index < repliesData[0].length; index++) {
				repliesData[0][index]["ip"] = repliesData[0][index]["ip"].split(".")[0] + (repliesData[0][index]["ip"].split(".")[1] !== undefined ? "." + repliesData[0][index]["ip"].split(".")[1] : "");

				if (repliesData[0][index]["deletedAt"] !== null){
					repliesData[0][index]["content"] = new Date(repliesData[0][index]["deletedAt"]).toLocaleString("sv-SE") + " 삭제되었습니다";
				}
			}
		}

		return { data: repliesData }
	}

	@Post("reply")
	async createReply(@Ip() ipData: string, @Body() createRepliesDTO: CreateRepliesDTO): Promise<{ data: Replies | null }> {
		console.log("[Controller-boards-createReply]");
		// createRepliesDTO.ip = ipData;
		createRepliesDTO.ip = Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5);

		const createdReply = await this.boardsService.createReply(createRepliesDTO);
		return { data: createdReply }
	}

	@Delete("reply")
	async deleteReply(@Body() deleteRepliesDTO: DeleteRepliesDTO): Promise<{ data: boolean }> {
		console.log("[Controller-boards-deleteReply]");

		const deleteResult = await this.boardsService.deleteReply(deleteRepliesDTO);
		return { data: deleteResult }
	}
}