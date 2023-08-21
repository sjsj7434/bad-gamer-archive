import { Param, Controller, Get, Post, Body, Ip, Req, Res, Delete, Patch, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AnonymousBoardService } from './anonymousBoard.service';
import { Boards } from './boards.entity';
import { Replies } from './replies.entity';
import { CreateBoardsDTO, UpdateBoardsDTO, DeleteBoardsDTO } from './boards.dto';
import { CreateRepliesDTO, UpdateRepliesDTO, DeleteRepliesDTO } from './replies.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';

/**
 * 익명 게시판 컨트롤러
 */
@Controller("boards/anonymous")
export class AnonymousBoardController {
	constructor(private anonymousBoardService: AnonymousBoardService) { }

	//게시글 목록, page 값이 number가 아니면 호출되지 않음
	@Get("list/:page")
	async getContentList(@Param("page") page: number): Promise<[Boards[], number]> {
		console.log("[AnonymousBoardController-boards-getContentList]");
		const perPage = 20;

		const result = await this.anonymousBoardService.getContentList("anonymous", page, perPage);

		if (result !== null) {
			for (let index: number = 0; index < result[0].length; index++) {
				result[0][index]["ip"] = result[0][index]["ip"].split(".")[0] + (result[0][index]["ip"].split(".")[1] !== undefined ? "." + result[0][index]["ip"].split(".")[1] : "");
			}
		}

		return result;
	}

	//게시글 작성
	@Post("content")
	async createContentAnonymous(@Ip() ipData: string, @Body() boardData: CreateBoardsDTO): Promise<Boards> {
		//set cookies/headers 정도만 사용하고, 나머지는 프레임워크에 떠넘기는 식으로 @Res()를 사용하는 거라면 passthrough: true 옵션은 필수! 그렇지 않으면 fetch 요청이 마무리가 안됨

		console.log("[Controller-boards-createContentAnonymous]");
		boardData.category = "anonymous";
		boardData.writerID = "";
		boardData.writerNickname = "";
		// boardData.ip = ipData;
		boardData.ip = Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5);

		const createdContent = await this.anonymousBoardService.createContent(boardData);

		return createdContent;
	}

	//게시글 조회, contentCode 값이 number가 아니면 호출되지 않음
	@Get("view/:contentCode")
	async getContent(@Param("contentCode") contentCode: number, @Query("type") type: string): Promise<Boards | null> {
		console.log("[Controller-boards-getContent]" + type);

		if (isNaN(contentCode) === true){
			return null;
		}

		const result = await this.anonymousBoardService.getContent(contentCode, type);

		if (result !== null) {
			result.ip = result.ip.split(".")[0] + (result.ip.split(".")[1] !== undefined ? "." + result.ip.split(".")[1] : "");
		}

		return result;
	}

	//게시글 수정
	@Patch("content")
	async updateContentAnonymous(@Body() updateBoardsDTO: UpdateBoardsDTO): Promise<Boards | null> {
		console.log("[Controller-boards-updateContentAnonymous]");

		const updatedContent = await this.anonymousBoardService.updateContent(updateBoardsDTO);

		return updatedContent;
	}

	//게시글 삭제
	@Delete("content")
	async deleteContent(@Body() deleteBoardsDTO: DeleteBoardsDTO): Promise<boolean> {
		console.log("[Controller-boards-deleteContent]");
		const isDeleted = await this.anonymousBoardService.softDeleteContent(deleteBoardsDTO);
		return isDeleted;
	}

	//게시글 이미지 삽입
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

	//게시글 수정 진입 시 작성자 확인
	@Post("content/check/author")
	async isAnonymousAuthorMatch(@Body() sendData: { code: number, password: string }): Promise<boolean> {
		console.log("[Controller-boards-isAnonymousAuthorMatch]");

		const findContent = await this.anonymousBoardService.getContent(sendData.code, "password");

		return findContent.password === sendData.password;
	}

	//게시글 추천
	@Post("content/upvote")
	async upvoteContent(@Ip() ipData: string, @Body() sendData: { code: number }): Promise<Boards> {
		console.log("[Controller-boards-upvoteContent]");

		const isVotable: boolean = this.anonymousBoardService.isVotableContent(sendData.code, ipData);

		if (isVotable === true) {
			const updatedContent = await this.anonymousBoardService.upvoteContent(sendData.code);

			return updatedContent;
		}
		else {
			const emptyElement = new Boards();
			emptyElement.upvote = null;
			emptyElement.downvote = null;
			return emptyElement;
		}
	}

	//게시글 비추천
	@Post("content/downvote")
	async downvoteContent(@Ip() ipData: string, @Body() sendData: { code: number }): Promise<Boards> {
		console.log("[Controller-boards-downvoteContent]");

		const isVotable: boolean = this.anonymousBoardService.isVotableContent(sendData.code, ipData);

		if (isVotable === true) {
			const updatedContent = await this.anonymousBoardService.downvoteContent(sendData.code);

			return updatedContent;
		}
		else {
			const emptyElement = new Boards();
			emptyElement.upvote = null;
			emptyElement.downvote = null;
			return emptyElement;
		}
	}

	//게시글 댓글 조회
	@Get("reply/:contentCode/:page")
	async getReplies(@Param("contentCode") contentCode: number, @Param("page") page: number): Promise<[Replies[], number]> {
		console.log("[Controller-boards-getReplies]");

		const repliesData = await this.anonymousBoardService.getReplies(contentCode, page);

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

	//게시글 댓글 작성
	@Post("reply")
	async createReply(@Ip() ipData: string, @Body() createRepliesDTO: CreateRepliesDTO): Promise<Replies | null> {
		console.log("[Controller-boards-createReply]");
		// createRepliesDTO.ip = ipData;
		createRepliesDTO.ip = Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5);

		const createdReply = await this.anonymousBoardService.createReply(createRepliesDTO);
		return createdReply;
	}

	//게시글 댓글 삭제
	@Delete("reply")
	async deleteReply(@Body() deleteRepliesDTO: DeleteRepliesDTO): Promise<boolean> {
		console.log("[Controller-boards-deleteReply]");

		const deleteResult = await this.anonymousBoardService.deleteReply(deleteRepliesDTO);
		return deleteResult;
	}
}