import { Param, Controller, Get, Post, Body, Ip, Req, Res, Delete, Patch, UseInterceptors, UploadedFile, NotFoundException } from '@nestjs/common';
import { Boards } from './boards.entity';
import { Replies } from './replies.entity';
import { CreateBoardsDTO, UpdateBoardsDTO, DeleteBoardsDTO } from './boards.dto';
import { CreateRepliesDTO, DeleteRepliesDTO } from './replies.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccountsService } from 'src/accounts/accounts.service';
import { Request, Response } from 'express';
import { BoardsService } from './boards.service';

/**
 * 게시판 컨트롤러
 */
@Controller("boards")
export class BoardsController {
	constructor(private boardsService: BoardsService, private accountsService: AccountsService) { }

	//추천 트랜드 게시글 목록, page 값이 number가 아니면 호출되지 않음
	@Get("upvote/trend/:type/list/:page")
	async getUpvoteTrend(@Param("type") type: string, @Param("page") page: number): Promise<[Boards[], number] | NotFoundException> {
		return await this.boardsService.getUpvoteTrend(page, type);
	}

	//비추천 트랜드 게시글 목록, page 값이 number가 아니면 호출되지 않음
	@Get("downvote/trend/:type/list/:page")
	async getDownvoteTrend(@Param("type") type: string, @Param("page") page: number): Promise<[Boards[], number] | NotFoundException> {
		return await this.boardsService.getDownvoteTrend(page, type);
	}

	//조회수 트랜드 게시글 목록, page 값이 number가 아니면 호출되지 않음
	@Get("view/trend/:type/list/:page")
	async getViewTrend(@Param("type") type: string, @Param("page") page: number): Promise<[Boards[], number] | NotFoundException> {
		return await this.boardsService.getViewTrend(page, type);
	}

	//================================================================================================================================================= anonymous

	//익명 게시판 목록, page 값이 number가 아니면 호출되지 않음
	@Get("anonymous/list/:page")
	async getAnonymousContentList(@Param("page") page: number): Promise<[Boards[], number]> {
		return await this.boardsService.getAnonymousContentList(page);
	}

	//익명 게시판 글 조회, contentCode 값이 number가 아니면 호출되지 않음
	@Get("anonymous/content/read/:contentCode")
	async readAnonymousContent(@Param("contentCode") contentCode: number): Promise<{ "contentData": Boards, "isWriter": boolean }> {
		return await this.boardsService.readAnonymousContent(contentCode);
	}

	//익명 게시판 글 데이터 가져오기, contentCode 값이 number가 아니면 호출되지 않음
	@Get("anonymous/content/data/:contentCode")
	async getAnonymousContentData(@Param("contentCode") contentCode: number): Promise<{ "contentData": Boards, "isWriter": boolean }> {
		return await this.boardsService.getAnonymousContentData(contentCode);
	}

	//익명 게시판 글 작성
	@Post("anonymous/content")
	async createAnonymousContent(@Ip() ipData: string, @Body() createBoardsDTO: CreateBoardsDTO) {
		await this.boardsService.createAnonymousContent(createBoardsDTO, ipData);
	}

	//익명 게시판 글 수정 진입 시 작성자 확인
	@Post("anonymous/content/check/author")
	async getAnonymousAuthor(@Body() sendData: { code: number, password: string }): Promise<boolean> {
		return await this.boardsService.isAnonymousAuthor(sendData.code, sendData.password);
	}

	//익명 게시판 글 수정
	@Patch("anonymous/content")
	async updateAnonymousContent(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() updateBoardsDTO: UpdateBoardsDTO): Promise<boolean> {
		return await this.boardsService.updateAnonymousContent(updateBoardsDTO);
	}

	//익명 게시판 글 삭제
	@Delete("anonymous/content")
	async deleteAnonymousContent(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() deleteBoardsDTO: DeleteBoardsDTO): Promise<boolean> {
		return await this.boardsService.softDeleteAnonymousContent(deleteBoardsDTO);
	}

	//익명 게시판 글 추천
	@Post("anonymous/content/upvote")
	async upvoteAnonymousContent(@Ip() ipData: string, @Body() sendData: { code: number }): Promise<Boards> {
		return await this.boardsService.upvoteAnonymousContent(sendData.code, ipData);
	}

	//익명 게시판 글 비추천
	@Post("anonymous/content/downvote")
	async downvoteAnonymousContent(@Ip() ipData: string, @Body() sendData: { code: number }): Promise<Boards> {
		return await this.boardsService.downvoteAnonymousContent(sendData.code, ipData);
	}

	//익명 게시판 댓글 조회
	@Get("anonymous/reply/:contentCode/:page")
	async getAnonymousReplies(@Param("contentCode") contentCode: number, @Param("page") page: number): Promise<[Replies[], number]> {
		return await this.boardsService.getAnonymousReplies(contentCode, page);
	}

	//익명 게시판 댓글 작성
	@Post("anonymous/reply")
	async createAnonymousReply(@Ip() ipData: string, @Body() createRepliesDTO: CreateRepliesDTO): Promise<boolean> {
		return await this.boardsService.createAnonymousReply(createRepliesDTO, ipData);
	}

	//익명 게시판 댓글 삭제
	@Delete("anonymous/reply")
	async deleteAnonymousReply(@Body() deleteRepliesDTO: DeleteRepliesDTO): Promise<boolean> {
		return await this.boardsService.deleteAnonymousReply(deleteRepliesDTO);
	}

	//익명 게시판 글 이미지 삽입
	@Post("anonymous/image")
	@UseInterceptors(FileInterceptor("upload"))
	async uploadImageAnonymous(@UploadedFile() file: Express.Multer.File): Promise<{ url: string } | { error: { message: string } }> {
		//Multer is --save-dev option installed, same as -d option
		//If the upload is successful, the server should return: An object containing [the url property] which points to the uploaded image on the server
		//이미지 업로드가 성공했으면 서버가 이미지 주소 정보가 담긴 오브젝트(url 프로퍼티를 가진)를 반환해야만 함
		return await this.boardsService.uploadImageAnonymous(file);
	}

	//================================================================================================================================================= user

	//유저 게시판 목록, page 값이 number가 아니면 호출되지 않음
	@Get("user/list/:page")
	async getUserContentList(@Param("page") page: number): Promise<[Boards[], number]> {
		return await this.boardsService.getUserContentList(page);
	}

	//유저 게시판 글 조회, contentCode 값이 number가 아니면 호출되지 않음
	@Get("user/content/read/:contentCode")
	async readUserContent(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Param("contentCode") contentCode: number): Promise<{ "contentData": Boards, "isWriter": boolean }> {
		//set cookies/headers 정도만 사용하고, 나머지는 프레임워크에 떠넘기는 식으로 @Res()를 사용하는 거라면 passthrough: true 옵션은 필수! 그렇지 않으면 fetch 요청이 마무리가 안됨
		return await this.boardsService.readUserContent(request, response, contentCode);
	}

	//유저 게시판 글 데이터 가져오기, contentCode 값이 number가 아니면 호출되지 않음
	@Get("anonymous/content/data/:contentCode")
	async getUserContentData(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Param("contentCode") contentCode: number): Promise<{ "contentData": Boards, "isWriter": boolean }> {
		return await this.boardsService.getUserContentData(request, response, contentCode);
	}

	//유저 게시판 글 작성
	@Post("user/content")
	async createUserContent(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Ip() ipData: string, @Body() createBoardsDTO: CreateBoardsDTO): Promise<boolean> {
		return await this.boardsService.createUserContent(createBoardsDTO, ipData, request, response);
	}

	//게시글 수정
	@Patch("user/content")
	async updateUserContent(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() updateBoardsDTO: UpdateBoardsDTO): Promise<boolean> {
		return await this.boardsService.updateUserContent(request, response, updateBoardsDTO);
	}

	//게시글 삭제
	@Delete("user/content")
	async deleteUserContent(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() deleteBoardsDTO: DeleteBoardsDTO): Promise<boolean> {
		return await this.boardsService.softDeleteUserContent(request, response, deleteBoardsDTO);
	}

	//게시글 수정 진입 시 작성자 확인
	@Post("user/content/check/author")
	async getuserAuthor(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() sendData: { code: number }): Promise<boolean> {
		return await this.boardsService.isUserAuthor(request, response, sendData.code);
	}

	//게시글 추천
	@Post("user/content/upvote")
	async upvoteUserContent(@Ip() ipData: string, @Body() sendData: { code: number }): Promise<Boards> {
		const isVotable: boolean = this.boardsService.isVotableContent(sendData.code, ipData);

		if (isVotable === true) {
			const updatedContent = await this.boardsService.upvoteUserContent(sendData.code);

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
		const isVotable: boolean = this.boardsService.isVotableContent(sendData.code, ipData);

		if (isVotable === true) {
			const updatedContent = await this.boardsService.downvoteUserContent(sendData.code);

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
		const repliesData = await this.boardsService.getUserReplies(contentCode, page);

		if (repliesData[1] === 0) {
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
	async createUserReply(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Ip() ipData: string, @Body() createRepliesDTO: CreateRepliesDTO): Promise<boolean> {
		if (createRepliesDTO.content.length > 300) {
			return false;
		}

		const loginCookie = await this.accountsService.checkLoginStatus(request, response);

		if (loginCookie.status === "login") {
			createRepliesDTO.writerID = loginCookie.id;
			createRepliesDTO.writerNickname = loginCookie.nickname;
			createRepliesDTO.replyOrder = 0;

			if (createRepliesDTO.level === 0) {
				createRepliesDTO.parentReplyCode = 0;
			}

			// createRepliesDTO.ip = ipData;
			createRepliesDTO.ip = Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5) + "." + Math.random().toString().substring(2, 5);

			await this.boardsService.createUserReply(createRepliesDTO, "user");

			return true;
		}
		else {
			return false;
		}
	}

	//게시글 댓글 삭제
	@Delete("user/reply")
	async deleteUserReply(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() deleteRepliesDTO: DeleteRepliesDTO): Promise<boolean> {
		const loginCookie = await this.accountsService.checkLoginStatus(request, response);

		if (loginCookie.status !== "login") {
			return false;
		}

		const deleteResult = await this.boardsService.deleteUserReply(deleteRepliesDTO, loginCookie.id);

		return deleteResult;
	}

	//게시글 이미지 삽입
	@Post("user/image")
	@UseInterceptors(FileInterceptor("upload"))
	async uploadImageUser(@UploadedFile() file: Express.Multer.File): Promise<{ url: string } | { error: { message: string } }> {
		//Multer is --save-dev option installed, same as -d option
		//If the upload is successful, the server should return: An object containing [the url property] which points to the uploaded image on the server
		//이미지 업로드가 성공했으면 서버가 이미지 주소 정보가 담긴 오브젝트(url 프로퍼티를 가진)를 반환해야만 함
		return await this.boardsService.uploadImageUser(file);
	}
}