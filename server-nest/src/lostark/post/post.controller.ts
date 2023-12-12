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
@Controller("post")
export class PostController {
	constructor(
		private lostarkAnnouncePostService: LostarkAnnouncePostService,
		private lostArkUnknownPostService: LostArkUnknownPostService,
		private lostArkKnownPostService: LostArkKnownPostService,
	) { }
	//================================================================================================================================================= unknown

	//익명 게시판 목록, page 값이 number가 아니면 호출되지 않음
	@Get("unknown/list/:page")
	async getUnknownPostList(@Param("page") page: number, @Query("searchType") searchType: string, @Query("searchText") searchText: string): Promise<[LostArkUnknownPost[], number]> {
		return await this.lostArkUnknownPostService.getPostList(page, searchType, searchText);
	}

	//익명 게시판 글 조회, contentCode 값이 number가 아니면 호출되지 않음
	@Get("unknown/view/:contentCode")
	async readUnknownPost(@Param("contentCode") contentCode: number): Promise<{ contentData: LostArkUnknownPost, isWriter: boolean }> {
		return await this.lostArkUnknownPostService.readPost(contentCode);
	}

	//익명 게시판 글 데이터 가져오기, contentCode 값이 number가 아니면 호출되지 않음
	@Get("unknown/data/:contentCode")
	async getUnknownPost(@Param("contentCode") contentCode: number): Promise<{ contentData: LostArkUnknownPost, isWriter: boolean }> {
		return await this.lostArkUnknownPostService.getPost(contentCode);
	}

	//익명 게시판 글 작성
	@Post("unknown")
	async createUnknownPost(@Ip() ipData: string, @Body() createPostDTO: CreateLostArkUnknownPostDTO): Promise<{ createdCode: number, status: string }> {
		return await this.lostArkUnknownPostService.createPost(createPostDTO, ipData);
	}

	//익명 게시판 글 수정
	@Patch("unknown")
	async updateUnknownPost(@Body() updatePostDTO: UpdateLostArkUnknownPostDTO): Promise<boolean> {
		return await this.lostArkUnknownPostService.updatePost(updatePostDTO);
	}

	//익명 게시판 글 삭제
	@Delete("unknown")
	async deleteUnknownPost(@Body() deletePostDTO: DeleteLostArkUnknownPostDTO): Promise<boolean> {
		return await this.lostArkUnknownPostService.softDeletePost(deletePostDTO);
	}

	//익명 게시판 글 수정 진입 시 작성자 확인
	@Post("unknown/check/author")
	async getUnknownAuthor(@Body() sendData: { code: number, password: string }): Promise<boolean> {
		return await this.lostArkUnknownPostService.isAuthor(sendData.code, sendData.password);
	}

	//익명 게시판 글 추천
	@SkipThrottle({ default: false })
	@Throttle({ default: { limit: 20, ttl: 60000 } }) //1분에 20개 이상 금지
	@Post("unknown/upvote")
	async upvoteUnknownPost(@Ip() ipData: string, @Body() sendData: { code: number }): Promise<{ upvote: number, downvote: number, isVotable: boolean }> {
		return await this.lostArkUnknownPostService.upvotePost(sendData.code, ipData);
	}

	//익명 게시판 글 비추천
	@SkipThrottle({ default: false })
	@Throttle({ default: { limit: 20, ttl: 60000 } }) //1분에 20개 이상 금지
	@Post("unknown/downvote")
	async downvoteUnknownPost(@Ip() ipData: string, @Body() sendData: { code: number }): Promise<{ upvote: number, downvote: number, isVotable: boolean }> {
		return await this.lostArkUnknownPostService.downvotePost(sendData.code, ipData);
	}

	//익명 게시판 댓글 조회
	@Get("unknown/reply/:contentCode/:page")
	async getUnknownReply(@Param("contentCode") contentCode: number, @Param("page") page: number): Promise<[LostArkUnknownReply[], number]> {
		return await this.lostArkUnknownPostService.getReply(contentCode, page);
	}

	//익명 게시판 댓글 작성
	@Post("unknown/reply")
	async createUnknownReply(@Ip() ipData: string, @Body() createReplyDTO: CreateLostArkUnknownReplyDTO): Promise<boolean> {
		return await this.lostArkUnknownPostService.createReply(createReplyDTO, ipData);
	}

	//익명 게시판 댓글 삭제
	@Delete("unknown/reply")
	async deleteUnknownReply(@Body() deleteReplyDTO: DeleteLostArkUnknownReplyDTO): Promise<boolean> {
		return await this.lostArkUnknownPostService.deleteReply(deleteReplyDTO);
	}

	//익명 게시글 추천 트랜드 게시글 목록, page 값이 number가 아니면 호출되지 않음
	@Get("unknown/trend/upvote/list/:page")
	async getUnknownUpvoteTrend(@Param("page") page: number, @Query("searchType") searchType: string, @Query("searchText") searchText: string): Promise<[LostArkUnknownPost[], number]> {
		return await this.lostArkUnknownPostService.getUpvoteTrend(page, searchType, searchText);
	}

	//익명 게시글 비추천 트랜드 게시글 목록, page 값이 number가 아니면 호출되지 않음
	@Get("unknown/trend/downvote/list/:page")
	async getUnknownDownvoteTrend(@Param("page") page: number, @Query("searchType") searchType: string, @Query("searchText") searchText: string): Promise<[LostArkUnknownPost[], number]> {
		return await this.lostArkUnknownPostService.getDownvoteTrend(page, searchType, searchText);
	}

	//익명 게시글 조회수 트랜드 게시글 목록, page 값이 number가 아니면 호출되지 않음
	@Get("unknown/trend/view/list/:page")
	async getUnknownViewTrend(@Param("page") page: number, @Query("searchType") searchType: string, @Query("searchText") searchText: string): Promise<[LostArkUnknownPost[], number]> {
		return await this.lostArkUnknownPostService.getViewTrend(page, searchType, searchText);
	}

	//================================================================================================================================================= known

	//유저 게시판 목록, page 값이 number가 아니면 호출되지 않음
	@Get("known/list/:page")
	async getKnownPostList(@Param("page") page: number, @Query("searchType") searchType: string, @Query("searchText") searchText: string): Promise<[LostArkKnownPost[], number]> {
		return await this.lostArkKnownPostService.getPostList(page, searchType, searchText);
	}

	//유저 게시판 글 조회, contentCode 값이 number가 아니면 호출되지 않음
	@Get("known/view/:contentCode")
	async readKnownPost(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Param("contentCode") contentCode: number): Promise<{ contentData: LostArkKnownPost, isWriter: boolean }> {
		//set cookies/headers 정도만 사용하고, 나머지는 프레임워크에 떠넘기는 식으로 @Res()를 사용하는 거라면 passthrough: true 옵션은 필수! 그렇지 않으면 fetch 요청이 마무리가 안됨
		return await this.lostArkKnownPostService.readPost(request, response, contentCode);
	}

	//유저 게시판 글 데이터 가져오기, contentCode 값이 number가 아니면 호출되지 않음
	@Get("known/data/:contentCode")
	async getKnownPost(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Param("contentCode") contentCode: number): Promise<{ contentData: LostArkKnownPost, isWriter: boolean }> {
		return await this.lostArkKnownPostService.getPost(request, response, contentCode);
	}

	//유저 게시판 글 작성
	@Post("known")
	async createKnownPost(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Ip() ipData: string, @Body() createPostDTO: CreateLostArkKnownPostDTO): Promise<{ createdCode: number, status: string }> {
		return await this.lostArkKnownPostService.createPost(createPostDTO, ipData, request, response);
	}

	//유저 게시글 수정
	@Patch("known")
	async updateKnownPost(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() updatePostDTO: UpdateLostArkKnownPostDTO): Promise<boolean> {
		return await this.lostArkKnownPostService.updatePost(request, response, updatePostDTO);
	}

	//유저 게시글 삭제
	@Delete("known")
	async deleteKnownPost(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() deletePostDTO: DeleteLostArkKnownPostDTO): Promise<boolean> {
		return await this.lostArkKnownPostService.softDeletePost(request, response, deletePostDTO);
	}

	//유저 게시글 수정 진입 시 작성자 확인
	@Post("known/check/author")
	async getuserAuthor(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() sendData: { code: number }): Promise<boolean> {
		return await this.lostArkKnownPostService.isAuthor(request, response, sendData.code);
	}

	//유저 게시글 추천
	@SkipThrottle({ default: false })
	@Throttle({ default: { limit: 20, ttl: 60000 } }) //1분에 20개 이상 금지
	@Post("known/upvote")
	async upvoteKnownPost(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Ip() ipData: string, @Body() sendData: { code: number }): Promise<{ upvote: number, downvote: number, isVotable: boolean }> {
		return await this.lostArkKnownPostService.upvotePost(request, response, sendData.code, ipData);
	}

	//유저 게시글 비추천
	@SkipThrottle({ default: false })
	@Throttle({ default: { limit: 20, ttl: 60000 } }) //1분에 20개 이상 금지
	@Post("known/downvote")
	async downvoteKnownPost(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Ip() ipData: string, @Body() sendData: { code: number }): Promise<{ upvote: number, downvote: number, isVotable: boolean }> {
		return await this.lostArkKnownPostService.downvotePost(request, response, sendData.code, ipData);
	}

	//유저 게시글 추천자 목록
	@SkipThrottle({ default: false })
	@Throttle({ default: { limit: 20, ttl: 60000 } }) //1분에 20개 이상 금지
	@Get("known/upvote/list/:contentCode")
	async getKnownPostUpvoteList(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Param("contentCode") contentCode: number): Promise<LostArkKnownVoteHistory[]> {
		return await this.lostArkKnownPostService.getPostUpvoteList(request, response, contentCode);
	}

	//유저 게시글 비추천자 목록
	@SkipThrottle({ default: false })
	@Throttle({ default: { limit: 20, ttl: 60000 } }) //1분에 20개 이상 금지
	@Get("known/downvote/list/:contentCode")
	async getKnownPostDownvoteList(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Param("contentCode") contentCode: number): Promise<LostArkKnownVoteHistory[]> {
		return await this.lostArkKnownPostService.getPostDownvoteList(request, response, contentCode);
	}

	//유저 게시글 댓글 조회
	@Get("known/reply/:contentCode/:page")
	async getKnownReply(@Param("contentCode") contentCode: number, @Param("page") page: number): Promise<[LostArkKnownReply[], number]> {
		return await this.lostArkKnownPostService.getReply(contentCode, page);
	}

	//유저 게시글 댓글 작성
	@Post("known/reply")
	async createKnownReply(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Ip() ipData: string, @Body() createReplyDTO: CreateLostArkKnownReplyDTO): Promise<boolean> {
		return await this.lostArkKnownPostService.createReply(request, response, createReplyDTO, ipData);
	}

	//유저 게시글 댓글 삭제
	@Delete("known/reply")
	async deleteKnownReply(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() deleteReplyDTO: DeleteLostArkKnownReplyDTO): Promise<boolean> {
		return await this.lostArkKnownPostService.deleteReply(request, response, deleteReplyDTO);
	}

	//유저 게시글 추천 트랜드 게시글 목록, page 값이 number가 아니면 호출되지 않음
	@Get("known/trend/upvote/list/:page")
	async getKnownUpvoteTrend(@Param("page") page: number, @Query("searchType") searchType: string, @Query("searchText") searchText: string): Promise<[LostArkKnownPost[], number]> {
		return await this.lostArkKnownPostService.getUpvoteTrend(page, searchType, searchText);
	}

	//유저 게시글 비추천 트랜드 게시글 목록, page 값이 number가 아니면 호출되지 않음
	@Get("known/trend/downvote/list/:page")
	async getKnownDownvoteTrend(@Param("page") page: number, @Query("searchType") searchType: string, @Query("searchText") searchText: string): Promise<[LostArkKnownPost[], number]> {
		return await this.lostArkKnownPostService.getDownvoteTrend(page, searchType, searchText);
	}

	//유저 게시글 조회수 트랜드 게시글 목록, page 값이 number가 아니면 호출되지 않음
	@Get("known/trend/view/list/:page")
	async getKnownViewTrend(@Param("page") page: number, @Query("searchType") searchType: string, @Query("searchText") searchText: string): Promise<[LostArkKnownPost[], number]> {
		return await this.lostArkKnownPostService.getViewTrend(page, searchType, searchText);
	}

	//================================================================================================================================================= common

	//공지 게시판 목록, page 값이 number가 아니면 호출되지 않음
	@Get("announcement/list/:page")
	async getAnnouncementPostList(@Param("page") page: number): Promise<[LostarkAnnouncePost[], number]> {
		return await this.lostarkAnnouncePostService.getPostList(page);
	}

	//공지 게시판 글 조회, contentCode 값이 number가 아니면 호출되지 않음
	@Get("announcement/content/view/:contentCode")
	async readAnnouncementPost(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Param("contentCode") contentCode: number): Promise<{ contentData: LostarkAnnouncePost, isWriter: boolean }> {
		//set cookies/headers 정도만 사용하고, 나머지는 프레임워크에 떠넘기는 식으로 @Res()를 사용하는 거라면 passthrough: true 옵션은 필수! 그렇지 않으면 fetch 요청이 마무리가 안됨
		return await this.lostarkAnnouncePostService.readPost(request, response, contentCode);
	}

	// //게시글 추천
	// @SkipThrottle({ default: false })
	// @Throttle({ default: { limit: 20, ttl: 60000 } }) //1분에 20개 이상 금지
	// @Post("announcement/upvote")
	// async upvoteAnnouncementContent(@Ip() ipData: string, @Body() sendData: { code: number }): Promise<{ upvote: number, downvote: number, isVotable: boolean }> {
	// 	return await this.boardsService.upvoteAnnouncementContent(sendData.code, ipData);
	// }

	// //게시글 비추천
	// @SkipThrottle({ default: false })
	// @Throttle({ default: { limit: 20, ttl: 60000 } }) //1분에 20개 이상 금지
	// @Post("announcement/downvote")
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