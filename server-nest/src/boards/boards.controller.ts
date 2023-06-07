import { Param, Controller, Get, Post, Body, Ip, Req, Res, Delete, Patch, Query } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Boards } from './boards.entity';
import { BoardsDTO } from './boards.dto';
import { setInterval } from 'timers';

const voteData: Map<number, Array<string>> = new Map();
let dateOfVote: string = new Date().toLocaleDateString("sv-SE", { year: "numeric", month: "2-digit", day: "2-digit" });
const clearVoteInterval = setInterval(() => {
	//1분 마다 확인하여 날짜가 바뀌면 추천 중복 방지 데이터를 초기화
	const dateOfNow: string = new Date().toLocaleDateString("sv-SE", { year: "numeric", month: "2-digit", day: "2-digit" });
	const timeOfNow = new Date().toLocaleTimeString("sv-SE", { hour: "numeric", minute: "2-digit" });

	if (dateOfVote !== dateOfNow) {
		voteData.clear();
		dateOfVote = dateOfNow;
	}
}, (1000 * 60));

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

	@Post("check/password/:contentCode")
	async checkContentPassword(@Param("contentCode") contentCode: number, @Body() boardData: BoardsDTO): Promise<{ data: boolean}> {
		console.log("[Controller-boards-checkContentPassword]");

		boardData.code = contentCode;

		const result = await this.boardsService.checkContentPassword(boardData);

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

			return { data: createdContent };
		}
		else{
			return { data: null };
		}
	}

	@Delete(":contentCode")
	async deleteContent(@Param("contentCode") contentCode: number, @Body() boardData: BoardsDTO): Promise<{data: boolean}> {
		console.log("[Controller-boards-deleteContent]");
		const isDeleted = await this.boardsService.softDeleteContent(contentCode, boardData.password);
		return { data: isDeleted };
	}

	@Patch("anonymous")
	async updateContentAnonymous(@Ip() ipData: string, @Body() boardData: BoardsDTO, @Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<{ data: Boards | null }> {
		console.log("[Controller-boards-updateContentAnonymous]" + boardData.password);
		boardData.ip = ipData;

		const updatedContent = await this.boardsService.updateContent(boardData);

		return { data: updatedContent };
	}

	@Post("upvote/:contentCode")
	async upvoteContent(@Ip() ipData: string, @Param("contentCode") contentCode: number, @Query("type") type: string, @Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<{data: Boards | null}> {
		console.log("[Controller-boards-upvoteContent]");
		console.log(voteData)
		console.log(`upvoteContent: ${ipData}`)

		const ipArray: Array<string> | undefined = voteData.get(contentCode);
		if (ipArray === undefined){
			voteData.set(contentCode, [ipData]);
			const updatecontent = await this.boardsService.upvoteContent(contentCode, type);

			return { data: updatecontent }
		}
		else if (ipArray.includes(ipData) === false){
			ipArray.push(ipData);
			voteData.set(contentCode, ipArray);
			const updatecontent = await this.boardsService.upvoteContent(contentCode, type);

			return { data: updatecontent }
		}
		else{
			return { data: null }
		}
	}

	@Post("downvote/:contentCode")
	async downvoteContent(@Ip() ipData: string, @Param("contentCode") contentCode: number, @Query("type") type: string, @Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<{ data: Boards | null }> {
		console.log("[Controller-boards-downvoteContent]");
		console.log(voteData)
		console.log(`downvoteContent: ${ipData}`)

		const ipArray: Array<string> | undefined = voteData.get(contentCode);
		if (ipArray === undefined) {
			voteData.set(contentCode, [ipData]);
			const updatecontent = await this.boardsService.downvoteContent(contentCode, type);

			return { data: updatecontent }
		}
		else if (ipArray.includes(ipData) === false) {
			ipArray.push(ipData);
			voteData.set(contentCode, ipArray);
			const updatecontent = await this.boardsService.downvoteContent(contentCode, type);

			return { data: updatecontent }
		}
		else {
			return { data: null }
		}
	}
}