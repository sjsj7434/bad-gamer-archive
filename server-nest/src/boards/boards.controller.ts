import { Param, Controller, Get, Post, Body, Ip, Req, Res, Delete, Patch, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Boards } from './boards.entity';
import { setInterval } from 'timers';
import { Replies } from './replies.entity';
import { CreateBoardsDTO, UpdateBoardsDTO, DeleteBoardsDTO } from './boards.dto';
import { CreateRepliesDTO, UpdateRepliesDTO, DeleteRepliesDTO } from './replies.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';

@Controller("boards")
export class BoardsController {
	constructor(private boardsService: BoardsService) { }

	@Get("view/:contentCode")
	async getContentByCode(@Param("contentCode") contentCode: number, @Query("type") type: string): Promise<Boards | null> {
		console.log("[Controller-boards-getContentByCode]" + type);

		const result = await this.boardsService.getContentByCode(contentCode, type);

		if (result !== null) {
			result.ip = result.ip.split(".")[0] + (result.ip.split(".")[1] !== undefined ? "." + result.ip.split(".")[1] : "");
		}

		return result;
	}

	@Get("list/:category/:page")
	async getContentListByCategory(@Param("category") category: string, @Param("page") page: number): Promise<[Boards[], number]> {
		console.log("[Controller-boards-getContentListByCategory]");
		const perPage = 20;

		const result = await this.boardsService.getContentListByCategory(category, page, perPage);

		if (result !== null) {
			for (let index: number = 0; index < result[0].length; index++){
				result[0][index]["ip"] = result[0][index]["ip"].split(".")[0] + (result[0][index]["ip"].split(".")[1] !== undefined ? "." + result[0][index]["ip"].split(".")[1] : "");
			}
		}

		return result;
	}

	//set cookies/headers 정도만 사용하고, 나머지는 프레임워크에 떠넘기는 식으로 @Res()를 사용하는 거라면 passthrough: true 옵션은 필수! 그렇지 않으면 fetch 요청이 마무리가 안됨
	@Post("content/anonymous")
	async createContentAnonymous(@Ip() ipData: string, @Body() boardData: CreateBoardsDTO): Promise<Boards> {
		console.log("[Controller-boards-createContentAnonymous]");
		boardData.category = "anonymous";
		boardData.writer = "";
		// boardData.ip = ipData;
		boardData.ip = Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5);

		const createdContent = await this.boardsService.createContent(boardData);

		return createdContent;
	}

	//set cookies/headers 정도만 사용하고, 나머지는 프레임워크에 떠넘기는 식으로 @Res()를 사용하는 거라면 passthrough: true 옵션은 필수! 그렇지 않으면 fetch 요청이 마무리가 안됨
	@Post("content/identified")
	async createContentIdentified(@Ip() ipData: string, @Body() boardData: CreateBoardsDTO): Promise<Boards>{
		console.log("[Controller-boards-createContentIdentified]");
		boardData.category = "identified";
		// boardData.ip = ipData;
		boardData.ip = Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5);

		const createdContent = await this.boardsService.createContent(boardData);

		return createdContent;
	}

	@Post("content/anonymous/check/password")
	async isAnonymousPasswordMatch(@Body() sendData: {code: number, password: string}): Promise<boolean> {
		console.log("[Controller-boards-isAnonymousPasswordMatch]");

		const findContent = await this.boardsService.getContentByCode(sendData.code, "password");
		
		return findContent.password === sendData.password;
	}

	@Delete("content/anonymous")
	async deleteContent(@Body() deleteBoardsDTO: DeleteBoardsDTO): Promise<boolean> {
		console.log("[Controller-boards-deleteContent]");
		const isDeleted = await this.boardsService.softDeleteContent(deleteBoardsDTO);
		return isDeleted;
	}

	@Patch("content/anonymous")
	async updateContentAnonymous(@Body() updateBoardsDTO: UpdateBoardsDTO): Promise<Boards | null> {
		console.log("[Controller-boards-updateContentAnonymous]");

		const updatedContent = await this.boardsService.updateContent(updateBoardsDTO);

		return updatedContent;
	}

	@Post("content/anonymous/upvote")
	async upvoteContent(@Ip() ipData: string, @Body() sendData: { code: number }): Promise<Boards> {
		console.log("[Controller-boards-upvoteContent]");

		const isVotable: boolean = this.boardsService.isVotableContent(sendData.code, ipData);

		if (isVotable === true){
			const updatedContent = await this.boardsService.upvoteContent(sendData.code);

			return updatedContent;
		}
		else{
			const emptyElement = new Boards();
			emptyElement.upvote = null;
			emptyElement.downvote = null;
			return emptyElement;
		}
	}

	@Post("content/anonymous/downvote")
	async downvoteContent(@Ip() ipData: string, @Body() sendData: { code: number }): Promise<Boards> {
		console.log("[Controller-boards-downvoteContent]");

		const isVotable: boolean = this.boardsService.isVotableContent(sendData.code, ipData);

		if (isVotable === true) {
			const updatedContent = await this.boardsService.downvoteContent(sendData.code);

			return updatedContent;
		}
		else {
			const emptyElement = new Boards();
			emptyElement.upvote = null;
			emptyElement.downvote = null;
			return emptyElement;
		}
	}

	@Get("reply/:contentCode/:page")
	async getReplies(@Param("contentCode") contentCode: number, @Param("page") page: number): Promise<[Replies[], number]> {
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

		return repliesData;
	}

	@Post("reply")
	async createReply(@Ip() ipData: string, @Body() createRepliesDTO: CreateRepliesDTO): Promise<Replies | null> {
		console.log("[Controller-boards-createReply]");
		// createRepliesDTO.ip = ipData;
		createRepliesDTO.ip = Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5);

		const createdReply = await this.boardsService.createReply(createRepliesDTO);
		return createdReply;
	}

	@Delete("reply")
	async deleteReply(@Body() deleteRepliesDTO: DeleteRepliesDTO): Promise<boolean> {
		console.log("[Controller-boards-deleteReply]");

		const deleteResult = await this.boardsService.deleteReply(deleteRepliesDTO);
		return deleteResult;
	}

	@Post("image")
	@UseInterceptors(FileInterceptor("upload"))
	uploadImage(@UploadedFile() file: Express.Multer.File): { url: string } | { error: { message: string } } {
		// Multer is --save-dev option installed, same as -d option
		// If the upload is successful, the server should return: An object containing [the url property] which points to the uploaded image on the server
		const timeOfNow = new Date();
		const timeString = timeOfNow.toLocaleDateString("sv-SE").replace(/-/g, "") + timeOfNow.toLocaleTimeString("sv-SE").replace(/:/g, "");
		console.log(timeString);

		const randomName = Array(10).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16).substring(0, 1)).join("");
		console.log("[Controller-boards-uploadImage]", timeString + "_" + randomName, extname(file.originalname));
		console.log(file);
		// return { "url": "https://docs.nestjs.com/assets/logo-small.svg" };
		return { "url": "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AAZrqDW?w=300&h=157&q=60&m=6&f=jpg&u=t" };
		// return { "error": { "message": "test error" } };
	}
}