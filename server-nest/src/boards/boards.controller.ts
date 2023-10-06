import { Param, Controller, Get, Post, Body, Ip, Req, Res, Delete, Patch, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { Boards } from './boards.entity';
import { Replies } from './replies.entity';
import { CreateBoardsDTO, UpdateBoardsDTO, DeleteBoardsDTO } from './boards.dto';
import { CreateRepliesDTO, DeleteRepliesDTO } from './replies.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { AccountsService } from 'src/accounts/accounts.service';
import { Request, Response } from 'express';
import { BoardsService } from './boards.service';

const REPlY_MAX_LENG = 300; //댓글 글자 수 제한

/**
 * 익명 게시판 컨트롤러
 */
@Controller("boards")
export class BoardsController {
	constructor(
		private boardsService: BoardsService,
		private accountsService: AccountsService,
	) { }

	//게시글 목록, page 값이 number가 아니면 호출되지 않음
	@Get("all/trend/upvote/:type/list/:page")
	async getUpvoteTrend(@Param("type") type: string, @Param("page") page: number): Promise<[Boards[], number]> {
		console.log("[AllBoardController(Get) - boards/all/trend/upvote/:type/list/:page");
		const perPage: number = 10;
		const upvoteCutline: number = 1;

		const result = await this.boardsService.getUpvoteTrend(upvoteCutline, page, perPage, type);

		if (result !== null) {
			for (let index: number = 0; index < result[0].length; index++) {
				result[0][index]["ip"] = result[0][index]["ip"].split(".")[0] + (result[0][index]["ip"].split(".")[1] !== undefined ? "." + result[0][index]["ip"].split(".")[1] : "");
			}
		}

		return result;
	}

	//게시글 목록, page 값이 number가 아니면 호출되지 않음
	@Get("all/trend/downvote/:type/list/:page")
	async getDownvoteTrend(@Param("type") type: string, @Param("page") page: number): Promise<[Boards[], number]> {
		console.log("[AllBoardController(Get) - boards/all/trend/downvote/:type/list/:page");
		const perPage: number = 10;
		const downvoteCutline: number = 1;

		const result = await this.boardsService.getDownvoteTrend(downvoteCutline, page, perPage, type);

		if (result !== null) {
			for (let index: number = 0; index < result[0].length; index++) {
				result[0][index]["ip"] = result[0][index]["ip"].split(".")[0] + (result[0][index]["ip"].split(".")[1] !== undefined ? "." + result[0][index]["ip"].split(".")[1] : "");
			}
		}

		return result;
	}

	//게시글 목록, page 값이 number가 아니면 호출되지 않음
	@Get("all/trend/view/:type/list/:page")
	async getViewTrend(@Param("type") type: string, @Param("page") page: number): Promise<[Boards[], number]> {
		console.log("[AllBoardController(Get) - boards/all/trend/view/:type/list/:page");
		const perPage: number = 10;
		const viewCutline: number = 1;

		const result = await this.boardsService.getViewTrend(viewCutline, page, perPage, type);

		if (result !== null) {
			for (let index: number = 0; index < result[0].length; index++) {
				result[0][index]["ip"] = result[0][index]["ip"].split(".")[0] + (result[0][index]["ip"].split(".")[1] !== undefined ? "." + result[0][index]["ip"].split(".")[1] : "");
			}
		}

		return result;
	}

	//====================================================================================== anonymous

	//게시글 목록, page 값이 number가 아니면 호출되지 않음
	@Get("anonymous/list/:page")
	async getAnonymousContentList(@Param("page") page: number): Promise<[Boards[], number]> {
		console.log("[AnonymousBoardController(Get) - boards/anonymous/list/:page]");
		const perPage = 20;

		const result = await this.boardsService.getContentList("anonymous", page, perPage);

		if (result !== null) {
			for (let index: number = 0; index < result[0].length; index++) {
				result[0][index]["ip"] = result[0][index]["ip"].split(".")[0] + (result[0][index]["ip"].split(".")[1] !== undefined ? "." + result[0][index]["ip"].split(".")[1] : "");
			}
		}

		return result;
	}

	//게시글 작성
	@Post("anonymous/content")
	async createAnonymousContent(@Ip() ipData: string, @Body() boardData: CreateBoardsDTO): Promise<Boolean> {
		//set cookies/headers 정도만 사용하고, 나머지는 프레임워크에 떠넘기는 식으로 @Res()를 사용하는 거라면 passthrough: true 옵션은 필수! 그렇지 않으면 fetch 요청이 마무리가 안됨
		console.log("[AnonymousBoardController(Post) - boards/anonymous/content]");

		boardData.category = "anonymous";
		boardData.writerID = "";
		boardData.writerNickname = "";
		// boardData.ip = ipData;
		boardData.ip = Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5);

		await this.boardsService.createContent(boardData);

		return true;
	}

	//게시글 조회, contentCode 값이 number가 아니면 호출되지 않음
	@Get("anonymous/view/:contentCode")
	async getAnonymousContent(@Param("contentCode") contentCode: number, @Query("type") type: string): Promise<{ "contentData": Boards, "isWriter": Boolean }> {
		console.log("[AnonymousBoardController(Get) - boards/anonymous/view/:contentCode]");

		if (isNaN(contentCode) === true) {
			return null;
		}

		const result = await this.boardsService.getContent(contentCode, "anonymous", type);

		if (result !== null) {
			result.ip = result.ip.split(".")[0] + (result.ip.split(".")[1] !== undefined ? "." + result.ip.split(".")[1] : "");
		}

		result.writerID = null;

		return { "contentData": result, "isWriter": true };
	}

	//게시글 수정
	@Patch("anonymous/content")
	async updateAnonymousContent(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() updateBoardsDTO: UpdateBoardsDTO): Promise<Boolean> {
		console.log("[AnonymousBoardController(Patch) - boards/anonymous/content]");

		const updatedContent = await this.boardsService.updateContent(updateBoardsDTO);

		return updatedContent;
	}

	//게시글 삭제
	@Delete("anonymous/content")
	async deleteAnonymousContent(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() deleteBoardsDTO: DeleteBoardsDTO): Promise<Boolean> {
		console.log("[AnonymousBoardController(Delete) - boards/anonymous/content]");
		const isDeleted = await this.boardsService.softDeleteContent(deleteBoardsDTO, "anonymous", "");
		return isDeleted;
	}

	//게시글 이미지 삽입
	@Post("anonymous/image")
	@UseInterceptors(FileInterceptor("upload"))
	uploadImageAnonymous(@UploadedFile() file: Express.Multer.File): { url: string } | { error: { message: string } } {
		// Multer is --save-dev option installed, same as -d option
		// If the upload is successful, the server should return: An object containing [the url property] which points to the uploaded image on the server
		const timeOfNow = new Date();
		const timeString = timeOfNow.toLocaleDateString("sv-SE").replace(/-/g, "") + timeOfNow.toLocaleTimeString("sv-SE").replace(/:/g, "");
		console.log(timeString);

		const randomName = Array(10).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16).substring(0, 1)).join("");
		console.log("[AnonymousBoardController(Post) - boards/anonymous/image]", timeString + "_" + randomName, extname(file.originalname));
		console.log(file);
		// return { "url": "https://docs.nestjs.com/assets/logo-small.svg" };
		return { "url": "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AAZrqDW?w=300&h=157&q=60&m=6&f=jpg&u=t" };
		// return { "error": { "message": "test error" } };
	}

	//게시글 수정 진입 시 작성자 확인
	@Post("anonymous/content/check/author")
	async isAnonymousAuthorMatch(@Body() sendData: { code: number, password: string }): Promise<Boolean> {
		console.log("[AnonymousBoardController(Post) - boards/anonymous/content/check/author]");

		const findContent = await this.boardsService.getContent(sendData.code, "anonymous", "author");

		if (findContent === null) {
			return false;
		}

		return findContent.password === sendData.password;
	}

	//게시글 추천
	@Post("anonymous/content/upvote")
	async upvoteAnonymousContent(@Ip() ipData: string, @Body() sendData: { code: number }): Promise<Boards> {
		console.log("[AnonymousBoardController(Post) - boards/anonymous/content/upvote]");

		const isVotable: boolean = this.boardsService.isVotableContent(sendData.code, ipData);

		if (isVotable === true) {
			const updatedContent = await this.boardsService.upvoteContent(sendData.code);

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
	@Post("anonymous/content/downvote")
	async downvoteAnonymousContent(@Ip() ipData: string, @Body() sendData: { code: number }): Promise<Boards> {
		console.log("[AnonymousBoardController(Post) - boards/anonymous/content/downvote]");

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

	//게시글 댓글 조회
	@Get("anonymous/reply/:contentCode/:page")
	async getAnonymousReplies(@Param("contentCode") contentCode: number, @Param("page") page: number): Promise<[Replies[], number]> {
		console.log("[AnonymousBoardController(Get) - boards/anonymous/reply/:contentCode/:page]");

		const repliesData = await this.boardsService.getReplies(contentCode, page);

		if (repliesData[1] !== 0) {
			for (let index: number = 0; index < repliesData[0].length; index++) {
				repliesData[0][index]["ip"] = repliesData[0][index]["ip"].split(".")[0] + (repliesData[0][index]["ip"].split(".")[1] !== undefined ? "." + repliesData[0][index]["ip"].split(".")[1] : "");

				if (repliesData[0][index]["deletedAt"] !== null) {
					repliesData[0][index]["content"] = new Date(repliesData[0][index]["deletedAt"]).toLocaleString("sv-SE") + " 삭제되었습니다";
				}
			}
		}

		return repliesData;
	}

	//게시글 댓글 작성
	@Post("anonymous/reply")
	async createAnonymousReply(@Ip() ipData: string, @Body() createRepliesDTO: CreateRepliesDTO): Promise<Boolean> {
		console.log("[AnonymousBoardController(Post) - boards/anonymous/reply]");

		if (createRepliesDTO.content.length > REPlY_MAX_LENG) {
			return false;
		}

		createRepliesDTO.writerID = "";
		createRepliesDTO.writerNickname = "";
		createRepliesDTO.replyOrder = 0;

		if (createRepliesDTO.level === 0) {
			createRepliesDTO.parentReplyCode = 0;
		}

		// createRepliesDTO.ip = ipData;
		createRepliesDTO.ip = Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5);

		const createResult: Boolean = await this.boardsService.createReply(createRepliesDTO, "anonymous");

		return createResult;
	}

	//게시글 댓글 삭제
	@Delete("anonymous/reply")
	async deleteAnonymousReply(@Body() deleteRepliesDTO: DeleteRepliesDTO): Promise<Boolean> {
		console.log("[AnonymousBoardController(Delete) - boards/anonymous/reply]");

		const deleteResult = await this.boardsService.deleteReply(deleteRepliesDTO, "");
		return deleteResult;
	}

	//====================================================================================== user

	//게시글 목록, page 값이 number가 아니면 호출되지 않음
	@Get("user/list/:page")
	async getUserContentList(@Param("page") page: number): Promise<[Boards[], number]> {
		console.log("[UserBoardController(Get) - boards/user/list/:page]");
		const perPage = 20;

		const result = await this.boardsService.getContentList("user", page, perPage);

		if (result !== null) {
			for (let index: number = 0; index < result[0].length; index++) {
				result[0][index]["ip"] = result[0][index]["ip"].split(".")[0] + (result[0][index]["ip"].split(".")[1] !== undefined ? "." + result[0][index]["ip"].split(".")[1] : "");
			}
		}

		return result;
	}

	//게시글 작성
	@Post("user/content")
	async createUserContent(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Ip() ipData: string, @Body() boardData: CreateBoardsDTO): Promise<Boolean> {
		//set cookies/headers 정도만 사용하고, 나머지는 프레임워크에 떠넘기는 식으로 @Res()를 사용하는 거라면 passthrough: true 옵션은 필수! 그렇지 않으면 fetch 요청이 마무리가 안됨
		console.log("[UserBoardController(Post) - boards/user/content]");
		const signInCookie = await this.accountsService.checkSignInStatus(request, response);

		if (signInCookie.status === "signin") {
			boardData.category = "user";
			boardData.writerID = signInCookie.id;
			boardData.writerNickname = signInCookie.nickname;
			// boardData.ip = ipData;
			boardData.ip = Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5);

			await this.boardsService.createContent(boardData);

			return true;
		}
		else {
			return false;
		}
	}

	//게시글 조회, contentCode 값이 number가 아니면 호출되지 않음
	@Get("user/view/:contentCode")
	async getUserContent(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Param("contentCode") contentCode: number, @Query("type") type: string): Promise<{ "contentData": Boards, "isWriter": Boolean }> {
		console.log("[UserBoardController(Get) - boards/user/view/:contentCode]");

		if (isNaN(contentCode) === true) {
			return null;
		}

		const result = await this.boardsService.getContent(contentCode, "user", type);

		const signInCookie = await this.accountsService.checkSignInStatus(request, response);
		const isWriter: Boolean = result.writerID === signInCookie.id
		result.writerID = null;

		return { "contentData": result, "isWriter": isWriter };
	}

	//게시글 수정
	@Patch("user/content")
	async updateUserContent(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() updateBoardsDTO: UpdateBoardsDTO): Promise<Boolean> {
		console.log("[UserBoardController(Patch) - boards/user/content]");

		const signInCookie = await this.accountsService.checkSignInStatus(request, response);

		if (signInCookie.status === "signin") {
			if (signInCookie.id !== updateBoardsDTO.writerID) {
				//위의 값이 아니면 누군가 값을 조작하여 전송했을 가능성이 있으므로 게시글 저장 차단
				return false;
			}

			updateBoardsDTO.writerID = signInCookie.id;

			const updatedContent = await this.boardsService.updateContent(updateBoardsDTO);
			return updatedContent;
		}
		else {
			return false;
		}
	}

	//게시글 삭제
	@Delete("user/content")
	async deleteUserContent(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() deleteBoardsDTO: DeleteBoardsDTO): Promise<Boolean> {
		console.log("[UserBoardController(Delete) - boards/user/content]");

		const signInCookie = await this.accountsService.checkSignInStatus(request, response);

		if (signInCookie.status === "signin") {
			const isDeleted = await this.boardsService.softDeleteContent(deleteBoardsDTO, "user", signInCookie.id);
			return isDeleted;
		}
		else {
			return false;
		}
	}

	//게시글 이미지 삽입
	@Post("user/image")
	@UseInterceptors(FileInterceptor("upload"))
	uploadImageUser(@UploadedFile() file: Express.Multer.File): { url: string } | { error: { message: string } } {
		// Multer is --save-dev option installed, same as -d option
		// If the upload is successful, the server should return: An object containing [the url property] which points to the uploaded image on the server
		const timeOfNow = new Date();
		const timeString = timeOfNow.toLocaleDateString("sv-SE").replace(/-/g, "") + timeOfNow.toLocaleTimeString("sv-SE").replace(/:/g, "");
		console.log(timeString);

		const randomName = Array(10).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16).substring(0, 1)).join("");
		console.log("[UserBoardController(Post) - boards/user/image]", timeString + "_" + randomName, extname(file.originalname));
		console.log(file);
		// return { "url": "https://docs.nestjs.com/assets/logo-small.svg" };
		return { "url": "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AAZrqDW?w=300&h=157&q=60&m=6&f=jpg&u=t" };
		// return { "error": { "message": "test error" } };
	}

	//게시글 수정 진입 시 작성자 확인
	@Post("user/content/check/author")
	async isUserAuthorMatch(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() sendData: { code: number }): Promise<Boolean> {
		console.log("[UserBoardController(Post) - boards/user/content/check/author]");

		const signInCookie = await this.accountsService.checkSignInStatus(request, response);

		if (signInCookie.status === "signin") {
			//위의 값이 아니면 누군가 값을 조작하여 전송했을 가능성이 있으므로 게시글 저장 차단

			const findContent = await this.boardsService.getContent(sendData.code, "user", "author");

			if (findContent === null) {
				return false;
			}

			return findContent.writerID === signInCookie.id;
		}
		else {
			return false;
		}
	}

	//게시글 추천
	@Post("user/content/upvote")
	async upvoteUserContent(@Ip() ipData: string, @Body() sendData: { code: number }): Promise<Boards> {
		console.log("[UserBoardController(Post) - boards/user/content/upvote]");

		const isVotable: boolean = this.boardsService.isVotableContent(sendData.code, ipData);

		if (isVotable === true) {
			const updatedContent = await this.boardsService.upvoteContent(sendData.code);

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
	@Post("user/content/downvote")
	async downvoteUserContent(@Ip() ipData: string, @Body() sendData: { code: number }): Promise<Boards> {
		console.log("[UserBoardController(Post) - boards/user/content/downvote]");

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

	//게시글 댓글 조회
	@Get("user/reply/:contentCode/:page")
	async getUserReplies(@Param("contentCode") contentCode: number, @Param("page") page: number): Promise<[Replies[], number]> {
		console.log("[UserBoardController(Get) - boards/user/reply/:contentCode/:page]");

		const repliesData = await this.boardsService.getReplies(contentCode, page);

		if (repliesData[1] === 0) {
			console.log("getReplies is nothing");
		}
		else {
			for (let index: number = 0; index < repliesData[0].length; index++) {
				repliesData[0][index]["ip"] = repliesData[0][index]["ip"].split(".")[0] + (repliesData[0][index]["ip"].split(".")[1] !== undefined ? "." + repliesData[0][index]["ip"].split(".")[1] : "");

				if (repliesData[0][index]["deletedAt"] !== null) {
					repliesData[0][index]["content"] = new Date(repliesData[0][index]["deletedAt"]).toLocaleString("sv-SE") + " 삭제되었습니다";
				}
			}
		}

		return repliesData;
	}

	//게시글 댓글 작성
	@Post("user/reply")
	async createUserReply(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Ip() ipData: string, @Body() createRepliesDTO: CreateRepliesDTO): Promise<Boolean> {
		console.log("[UserBoardController(Post) - boards/user/reply]");

		if (createRepliesDTO.content.length > REPlY_MAX_LENG) {
			return false;
		}

		const signInCookie = await this.accountsService.checkSignInStatus(request, response);

		if (signInCookie.status === "signin") {
			createRepliesDTO.writerID = signInCookie.id;
			createRepliesDTO.writerNickname = signInCookie.nickname;
			createRepliesDTO.replyOrder = 0;

			if (createRepliesDTO.level === 0) {
				createRepliesDTO.parentReplyCode = 0;
			}

			// createRepliesDTO.ip = ipData;
			createRepliesDTO.ip = Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5);

			await this.boardsService.createReply(createRepliesDTO, "user");

			return true;
		}
		else {
			return false;
		}
	}

	//게시글 댓글 삭제
	@Delete("user/reply")
	async deleteUserReply(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() deleteRepliesDTO: DeleteRepliesDTO): Promise<boolean> {
		console.log("[UserBoardController(Delete) - boards/user/reply]");

		const signInCookie = await this.accountsService.checkSignInStatus(request, response);

		if (signInCookie.status !== "signin") {
			return false;
		}

		const deleteResult = await this.boardsService.deleteReply(deleteRepliesDTO, signInCookie.id);

		return deleteResult;
	}
}