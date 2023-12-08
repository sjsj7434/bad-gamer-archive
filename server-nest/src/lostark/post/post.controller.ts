import { Param, Controller, Get, Post, Body, Ip, Req, Res, Delete, Patch, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { CreateLostArkUnknownPostDTO, DeleteLostArkUnknownPostDTO, UpdateLostArkUnknownPostDTO } from './unknown/lostArkUnknownPost.dto';
import { LostArkUnknownPost } from './unknown/lostArkUnknownPost.entity';
import { LostArkUnknownReply } from './unknown/lostArkUnknownReply.entity';
import { CreateLostArkUnknownReplyDTO, DeleteLostArkUnknownReplyDTO } from './unknown/lostArkUnknownReply.dto';
import { LostArkKnownPostService } from './known/lostArkKnownPost.service';
import { LostArkUnknownPostService } from './unknown/lostArkUnknownPost.service';
import { LostArkKnownPost } from './known/lostArkKnownPost.entity';
import { LostArkKnownReply } from './known/lostArkKnownReply.entity';
import { CreateLostArkKnownPostDTO, DeleteLostArkKnownPostDTO, UpdateLostArkKnownPostDTO } from './known/lostArkKnownPost.dto';
import { LostarkAnnouncePostService } from './announce/lostarkAnnouncePost.service';
import { CreateLostArkKnownReplyDTO, DeleteLostArkKnownReplyDTO } from './known/lostArkKnownReply.dto';
import { LostArkKnownVoteHistory } from './known/lostArkKnownVoteHistory.entity';
import { LostarkAnnouncePost } from './announce/lostarkAnnouncePost.entity';

/**
 * 게시판 컨트롤러
 */
@SkipThrottle()
@Controller("boards")
export class PostController {
	constructor(
		private lostarkAnnouncePostService: LostarkAnnouncePostService,
		private lostArkUnknownPostService: LostArkUnknownPostService,
		private lostArkKnownPostService: LostArkKnownPostService,
	) { }

	//추천 트랜드 게시글 목록, page 값이 number가 아니면 호출되지 않음
	@Get("trend/upvote/list/:page")
	async getUpvoteTrend(@Param("page") page: number, @Query("searchType") searchType: string, @Query("searchText") searchText: string): Promise<[LostArkUnknownPost[], number]> {
		return await this.lostArkUnknownPostService.getUpvoteTrend(page, searchType, searchText);
	}

	//비추천 트랜드 게시글 목록, page 값이 number가 아니면 호출되지 않음
	@Get("trend/downvote/list/:page")
	async getDownvoteTrend(@Param("page") page: number, @Query("searchType") searchType: string, @Query("searchText") searchText: string): Promise<[LostArkUnknownPost[], number]> {
		return await this.lostArkUnknownPostService.getDownvoteTrend(page, searchType, searchText);
	}

	//조회수 트랜드 게시글 목록, page 값이 number가 아니면 호출되지 않음
	@Get("trend/view/list/:page")
	async getViewTrend(@Param("page") page: number, @Query("searchType") searchType: string, @Query("searchText") searchText: string): Promise<[LostArkUnknownPost[], number]> {
		return await this.lostArkUnknownPostService.getViewTrend(page, searchType, searchText);
	}

	//================================================================================================================================================= anonymous

	//익명 게시판 목록, page 값이 number가 아니면 호출되지 않음
	@Get("anonymous/list/:page")
	async getAnonymousContentList(@Param("page") page: number, @Query("searchType") searchType: string, @Query("searchText") searchText: string): Promise<[LostArkUnknownPost[], number]> {
		return await this.lostArkUnknownPostService.getPostList(page, searchType, searchText);
	}

	//익명 게시판 글 조회, contentCode 값이 number가 아니면 호출되지 않음
	@Get("anonymous/content/read/:contentCode")
	async readAnonymousContent(@Param("contentCode") contentCode: number): Promise<{ contentData: LostArkUnknownPost, isWriter: boolean }> {
		return await this.lostArkUnknownPostService.readPost(contentCode);
	}

	//익명 게시판 글 데이터 가져오기, contentCode 값이 number가 아니면 호출되지 않음
	@Get("anonymous/content/data/:contentCode")
	async getAnonymousContentData(@Param("contentCode") contentCode: number): Promise<{ contentData: LostArkUnknownPost, isWriter: boolean }> {
		return await this.lostArkUnknownPostService.getPost(contentCode);
	}

	//익명 게시판 글 작성
	@Post("anonymous/content")
	async createAnonymousContent(@Ip() ipData: string, @Body() createPostDTO: CreateLostArkUnknownPostDTO): Promise<{ createdCode: number, status: string }> {
		return await this.lostArkUnknownPostService.createPost(createPostDTO, ipData);
	}

	//익명 게시판 글 수정 진입 시 작성자 확인
	@Post("anonymous/content/check/author")
	async getAnonymousAuthor(@Body() sendData: { code: number, password: string }): Promise<boolean> {
		return await this.lostArkUnknownPostService.isAuthor(sendData.code, sendData.password);
	}

	//익명 게시판 글 수정
	@Patch("anonymous/content")
	async updateAnonymousContent(@Body() updatePostDTO: UpdateLostArkUnknownPostDTO): Promise<boolean> {
		return await this.lostArkUnknownPostService.updatePost(updatePostDTO);
	}

	//익명 게시판 글 삭제
	@Delete("anonymous/content")
	async deleteAnonymousContent(@Body() deletePostDTO: DeleteLostArkUnknownPostDTO): Promise<boolean> {
		return await this.lostArkUnknownPostService.softDeletePost(deletePostDTO);
	}

	//익명 게시판 글 추천
	@SkipThrottle({ default: false })
	@Throttle({ default: { limit: 20, ttl: 60000 } }) //1분에 20개 이상 금지
	@Post("anonymous/content/upvote")
	async upvoteAnonymousContent(@Ip() ipData: string, @Body() sendData: { code: number }): Promise<{ upvote: number, downvote: number, isVotable: boolean }> {
		return await this.lostArkUnknownPostService.upvotePost(sendData.code, ipData);
	}

	//익명 게시판 글 비추천
	@SkipThrottle({ default: false })
	@Throttle({ default: { limit: 20, ttl: 60000 } }) //1분에 20개 이상 금지
	@Post("anonymous/content/downvote")
	async downvoteAnonymousContent(@Ip() ipData: string, @Body() sendData: { code: number }): Promise<{ upvote: number, downvote: number, isVotable: boolean }> {
		return await this.lostArkUnknownPostService.downvotePost(sendData.code, ipData);
	}

	//익명 게시판 댓글 조회
	@Get("anonymous/reply/:contentCode/:page")
	async getAnonymousReplies(@Param("contentCode") contentCode: number, @Param("page") page: number): Promise<[LostArkUnknownReply[], number]> {
		return await this.lostArkUnknownPostService.getReply(contentCode, page);
	}

	//익명 게시판 댓글 작성
	@Post("anonymous/reply")
	async createAnonymousReply(@Ip() ipData: string, @Body() createReplyDTO: CreateLostArkUnknownReplyDTO): Promise<boolean> {
		return await this.lostArkUnknownPostService.createReply(createReplyDTO, ipData);
	}

	//익명 게시판 댓글 삭제
	@Delete("anonymous/reply")
	async deleteAnonymousReply(@Body() deleteReplyDTO: DeleteLostArkUnknownReplyDTO): Promise<boolean> {
		return await this.lostArkUnknownPostService.deleteReply(deleteReplyDTO);
	}

	//================================================================================================================================================= user

	//유저 게시판 목록, page 값이 number가 아니면 호출되지 않음
	@Get("user/list/:page")
	async getUserContentList(@Param("page") page: number, @Query("searchType") searchType: string, @Query("searchText") searchText: string): Promise<[LostArkKnownPost[], number]> {
		return await this.lostArkKnownPostService.getPostList(page, searchType, searchText);
	}

	//유저 게시판 글 조회, contentCode 값이 number가 아니면 호출되지 않음
	@Get("user/content/read/:contentCode")
	async readUserContent(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Param("contentCode") contentCode: number): Promise<{ contentData: LostArkKnownPost, isWriter: boolean }> {
		//set cookies/headers 정도만 사용하고, 나머지는 프레임워크에 떠넘기는 식으로 @Res()를 사용하는 거라면 passthrough: true 옵션은 필수! 그렇지 않으면 fetch 요청이 마무리가 안됨
		return await this.lostArkKnownPostService.readPost(request, response, contentCode);
	}

	//유저 게시판 글 데이터 가져오기, contentCode 값이 number가 아니면 호출되지 않음
	@Get("user/content/data/:contentCode")
	async getUserContentData(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Param("contentCode") contentCode: number): Promise<{ contentData: LostArkKnownPost, isWriter: boolean }> {
		return await this.lostArkKnownPostService.getPost(request, response, contentCode);
	}

	//유저 게시판 글 작성
	@Post("user/content")
	async createUserContent(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Ip() ipData: string, @Body() createPostDTO: CreateLostArkKnownPostDTO): Promise<{ createdCode: number, status: string }> {
		return await this.lostArkKnownPostService.createPost(createPostDTO, ipData, request, response);
	}

	//유저 게시글 수정
	@Patch("user/content")
	async updateUserContent(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() updatePostDTO: UpdateLostArkKnownPostDTO): Promise<boolean> {
		return await this.lostArkKnownPostService.updatePost(request, response, updatePostDTO);
	}

	//유저 게시글 삭제
	@Delete("user/content")
	async deleteUserContent(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() deletePostDTO: DeleteLostArkKnownPostDTO): Promise<boolean> {
		return await this.lostArkKnownPostService.softDeletePost(request, response, deletePostDTO);
	}

	//유저 게시글 수정 진입 시 작성자 확인
	@Post("user/content/check/author")
	async getuserAuthor(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() sendData: { code: number }): Promise<boolean> {
		return await this.lostArkKnownPostService.isAuthor(request, response, sendData.code);
	}

	//유저 게시글 추천
	@SkipThrottle({ default: false })
	@Throttle({ default: { limit: 20, ttl: 60000 } }) //1분에 20개 이상 금지
	@Post("user/content/upvote")
	async upvoteUserContent(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Ip() ipData: string, @Body() sendData: { code: number }): Promise<{ upvote: number, downvote: number, isVotable: boolean }> {
		return await this.lostArkKnownPostService.upvotePost(request, response, sendData.code, ipData);
	}

	//유저 게시글 비추천
	@SkipThrottle({ default: false })
	@Throttle({ default: { limit: 20, ttl: 60000 } }) //1분에 20개 이상 금지
	@Post("user/content/downvote")
	async downvoteUserContent(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Ip() ipData: string, @Body() sendData: { code: number }): Promise<{ upvote: number, downvote: number, isVotable: boolean }> {
		return await this.lostArkKnownPostService.downvotePost(request, response, sendData.code, ipData);
	}

	//유저 게시글 추천자 목록
	@SkipThrottle({ default: false })
	@Throttle({ default: { limit: 20, ttl: 60000 } }) //1분에 20개 이상 금지
	@Get("user/content/upvote/list/:contentCode")
	async getUserPostUpvoteList(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Param("contentCode") contentCode: number): Promise<LostArkKnownVoteHistory[]> {
		return await this.lostArkKnownPostService.getPostUpvoteList(request, response, contentCode);
	}

	//유저 게시글 비추천자 목록
	@SkipThrottle({ default: false })
	@Throttle({ default: { limit: 20, ttl: 60000 } }) //1분에 20개 이상 금지
	@Get("user/content/downvote/list/:contentCode")
	async getUserPostDownvoteList(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Param("contentCode") contentCode: number): Promise<LostArkKnownVoteHistory[]> {
		return await this.lostArkKnownPostService.getPostDownvoteList(request, response, contentCode);
	}

	//유저 게시글 댓글 조회
	@Get("user/reply/:contentCode/:page")
	async getUserReplies(@Param("contentCode") contentCode: number, @Param("page") page: number): Promise<[LostArkKnownReply[], number]> {
		return await this.lostArkKnownPostService.getReply(contentCode, page);
	}

	//유저 게시글 댓글 작성
	@Post("user/reply")
	async createUserReply(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Ip() ipData: string, @Body() createReplyDTO: CreateLostArkKnownReplyDTO): Promise<boolean> {
		return await this.lostArkKnownPostService.createReply(request, response, createReplyDTO, ipData);
	}

	//유저 게시글 댓글 삭제
	@Delete("user/reply")
	async deleteUserReply(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() deleteReplyDTO: DeleteLostArkKnownReplyDTO): Promise<boolean> {
		return await this.lostArkKnownPostService.deleteReply(request, response, deleteReplyDTO);
	}

	//================================================================================================================================================= common

	//공지 게시판 목록, page 값이 number가 아니면 호출되지 않음
	@Get("announcement/list/:page")
	async getAnnouncementContentList(@Param("page") page: number): Promise<[LostarkAnnouncePost[], number]> {
		return await this.lostarkAnnouncePostService.getPostList(page);
	}

	//공지 게시판 글 조회, contentCode 값이 number가 아니면 호출되지 않음
	@Get("announcement/content/read/:contentCode")
	async readAnnouncementContent(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Param("contentCode") contentCode: number): Promise<{ contentData: LostarkAnnouncePost, isWriter: boolean }> {
		//set cookies/headers 정도만 사용하고, 나머지는 프레임워크에 떠넘기는 식으로 @Res()를 사용하는 거라면 passthrough: true 옵션은 필수! 그렇지 않으면 fetch 요청이 마무리가 안됨
		return await this.lostarkAnnouncePostService.readPost(request, response, contentCode);
	}

	// //게시글 추천
	// @SkipThrottle({ default: false })
	// @Throttle({ default: { limit: 20, ttl: 60000 } }) //1분에 20개 이상 금지
	// @Post("announcement/content/upvote")
	// async upvoteAnnouncementContent(@Ip() ipData: string, @Body() sendData: { code: number }): Promise<{ upvote: number, downvote: number, isVotable: boolean }> {
	// 	return await this.boardsService.upvoteAnnouncementContent(sendData.code, ipData);
	// }

	// //게시글 비추천
	// @SkipThrottle({ default: false })
	// @Throttle({ default: { limit: 20, ttl: 60000 } }) //1분에 20개 이상 금지
	// @Post("announcement/content/downvote")
	// async downvoteAnnouncementContent(@Ip() ipData: string, @Body() sendData: { code: number }): Promise<{ upvote: number, downvote: number, isVotable: boolean }> {
	// 	return await this.boardsService.downvoteAnnouncementContent(sendData.code, ipData);
	// }

	//게시글 이미지 삽입
	@Post("image")
	@UseInterceptors(FileInterceptor("upload"))
	async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<{ url: string } | { error: { message: string } }> {
		//Multer is --save-dev option installed, same as -d option
		//If the upload is successful, the server should return: An object containing [the url property] which points to the uploaded image on the server
		//이미지 업로드가 성공했으면 서버가 이미지 주소 정보가 담긴 오브젝트(url 프로퍼티를 가진)를 반환해야만 함

		return await this.lostarkAnnouncePostService.uploadImage(file);
	}
}