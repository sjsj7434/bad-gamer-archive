import { Param, Controller, Get, Post, Body, Ip, Req, Res, Delete, Patch, UseInterceptors, UploadedFile } from '@nestjs/common';
import { Boards } from './boards.entity';
import { Replies } from './replies.entity';
import { CreateBoardsDTO, UpdateBoardsDTO, DeleteBoardsDTO } from './boards.dto';
import { CreateRepliesDTO, DeleteRepliesDTO } from './replies.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { BoardsService } from './boards.service';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

/**
 * 게시판 컨트롤러
 */
@SkipThrottle()
@Controller("boards")
export class BoardsController {
	constructor(private boardsService: BoardsService) { }

	//추천 트랜드 게시글 목록, page 값이 number가 아니면 호출되지 않음
	@Get("upvote/trend/:type/list/:page")
	async getUpvoteTrend(@Param("type") type: string, @Param("page") page: number): Promise<[Boards[], number]> {
		return await this.boardsService.getUpvoteTrend(page, type);
	}

	//비추천 트랜드 게시글 목록, page 값이 number가 아니면 호출되지 않음
	@Get("downvote/trend/:type/list/:page")
	async getDownvoteTrend(@Param("type") type: string, @Param("page") page: number): Promise<[Boards[], number]> {
		return await this.boardsService.getDownvoteTrend(page, type);
	}

	//조회수 트랜드 게시글 목록, page 값이 number가 아니면 호출되지 않음
	@Get("view/trend/:type/list/:page")
	async getViewTrend(@Param("type") type: string, @Param("page") page: number): Promise<[Boards[], number]> {
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
	async readAnonymousContent(@Param("contentCode") contentCode: number): Promise<{ contentData: Boards, isWriter: boolean }> {
		return await this.boardsService.readAnonymousContent(contentCode);
	}

	//익명 게시판 글 데이터 가져오기, contentCode 값이 number가 아니면 호출되지 않음
	@Get("anonymous/content/data/:contentCode")
	async getAnonymousContentData(@Param("contentCode") contentCode: number): Promise<{ contentData: Boards, isWriter: boolean }> {
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
	@SkipThrottle({ default: false })
	@Throttle({ default: { limit: 20, ttl: 60000 } }) //1분에 20개 이상 금지
	@Post("anonymous/content/upvote")
	async upvoteAnonymousContent(@Ip() ipData: string, @Body() sendData: { code: number }): Promise<{ upvote: number, downvote: number, isVotable: boolean }> {
		return await this.boardsService.upvoteAnonymousContent(sendData.code, ipData);
	}

	//익명 게시판 글 비추천
	@SkipThrottle({ default: false })
	@Throttle({ default: { limit: 20, ttl: 60000 } }) //1분에 20개 이상 금지
	@Post("anonymous/content/downvote")
	async downvoteAnonymousContent(@Ip() ipData: string, @Body() sendData: { code: number }): Promise<{ upvote: number, downvote: number, isVotable: boolean }> {
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

	//================================================================================================================================================= user

	//유저 게시판 목록, page 값이 number가 아니면 호출되지 않음
	@Get("user/list/:page")
	async getUserContentList(@Param("page") page: number): Promise<[Boards[], number]> {
		return await this.boardsService.getUserContentList(page);
	}

	//유저 게시판 글 조회, contentCode 값이 number가 아니면 호출되지 않음
	@Get("user/content/read/:contentCode")
	async readUserContent(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Param("contentCode") contentCode: number): Promise<{ contentData: Boards, isWriter: boolean }> {
		//set cookies/headers 정도만 사용하고, 나머지는 프레임워크에 떠넘기는 식으로 @Res()를 사용하는 거라면 passthrough: true 옵션은 필수! 그렇지 않으면 fetch 요청이 마무리가 안됨
		return await this.boardsService.readUserContent(request, response, contentCode);
	}

	//유저 게시판 글 데이터 가져오기, contentCode 값이 number가 아니면 호출되지 않음
	@Get("user/content/data/:contentCode")
	async getUserContentData(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Param("contentCode") contentCode: number): Promise<{ contentData: Boards, isWriter: boolean }> {
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
	@SkipThrottle({ default: false })
	@Throttle({ default: { limit: 20, ttl: 60000 } }) //1분에 20개 이상 금지
	@Post("user/content/upvote")
	async upvoteUserContent(@Ip() ipData: string, @Body() sendData: { code: number }): Promise<{ upvote: number, downvote: number, isVotable: boolean }> {
		return await this.boardsService.upvoteUserContent(sendData.code, ipData);
	}

	//게시글 비추천
	@SkipThrottle({ default: false })
	@Throttle({ default: { limit: 20, ttl: 60000 } }) //1분에 20개 이상 금지
	@Post("user/content/downvote")
	async downvoteUserContent(@Ip() ipData: string, @Body() sendData: { code: number }): Promise<{ upvote: number, downvote: number, isVotable: boolean }> {
		return await this.boardsService.downvoteUserContent(sendData.code, ipData);
	}

	//게시글 댓글 조회
	@Get("user/reply/:contentCode/:page")
	async getUserReplies(@Param("contentCode") contentCode: number, @Param("page") page: number): Promise<[Replies[], number]> {
		return await this.boardsService.getUserReplies(contentCode, page);
	}

	//게시글 댓글 작성
	@Post("user/reply")
	async createUserReply(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Ip() ipData: string, @Body() createRepliesDTO: CreateRepliesDTO): Promise<boolean> {
		return await this.boardsService.createUserReply(request, response, createRepliesDTO, ipData);
	}

	//게시글 댓글 삭제
	@Delete("user/reply")
	async deleteUserReply(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() deleteRepliesDTO: DeleteRepliesDTO): Promise<boolean> {
		return await this.boardsService.deleteUserReply(request, response, deleteRepliesDTO);
	}

	//================================================================================================================================================= common

	//공지 게시판 목록, page 값이 number가 아니면 호출되지 않음
	@Get("announcement/list/:page")
	async getAnnouncementContentList(@Param("page") page: number): Promise<[Boards[], number]> {
		return await this.boardsService.getAnnouncementContentList(page);
	}

	//공지 게시판 글 조회, contentCode 값이 number가 아니면 호출되지 않음
	@Get("announcement/content/read/:contentCode")
	async readAnnouncementContent(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Param("contentCode") contentCode: number): Promise<{ contentData: Boards, isWriter: boolean }> {
		//set cookies/headers 정도만 사용하고, 나머지는 프레임워크에 떠넘기는 식으로 @Res()를 사용하는 거라면 passthrough: true 옵션은 필수! 그렇지 않으면 fetch 요청이 마무리가 안됨
		return await this.boardsService.readAnnouncementContent(request, response, contentCode);
	}

	//게시글 추천
	@SkipThrottle({ default: false })
	@Throttle({ default: { limit: 20, ttl: 60000 } }) //1분에 20개 이상 금지
	@Post("announcement/content/upvote")
	async upvoteAnnouncementContent(@Ip() ipData: string, @Body() sendData: { code: number }): Promise<{ upvote: number, downvote: number, isVotable: boolean }> {
		return await this.boardsService.upvoteAnnouncementContent(sendData.code, ipData);
	}

	//게시글 비추천
	@SkipThrottle({ default: false })
	@Throttle({ default: { limit: 20, ttl: 60000 } }) //1분에 20개 이상 금지
	@Post("announcement/content/downvote")
	async downvoteAnnouncementContent(@Ip() ipData: string, @Body() sendData: { code: number }): Promise<{ upvote: number, downvote: number, isVotable: boolean }> {
		return await this.boardsService.downvoteAnnouncementContent(sendData.code, ipData);
	}

	//게시글 이미지 삽입
	@Post("image")
	@UseInterceptors(FileInterceptor("upload"))
	async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<{ url: string } | { error: { message: string } }> {
		//Multer is --save-dev option installed, same as -d option
		//If the upload is successful, the server should return: An object containing [the url property] which points to the uploaded image on the server
		//이미지 업로드가 성공했으면 서버가 이미지 주소 정보가 담긴 오브젝트(url 프로퍼티를 가진)를 반환해야만 함

		return await this.boardsService.uploadImage(file);
	}
}