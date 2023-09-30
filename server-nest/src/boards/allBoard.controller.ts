import { Param, Controller, Get } from '@nestjs/common';
import { Boards } from './boards.entity';
import { AllBoardService } from './allBoard.service';

/**
 * 익명 게시판 컨트롤러
 */
@Controller("boards/all")
export class AllBoardController {
	constructor(private allBoardService: AllBoardService) { }

	//게시글 목록, page 값이 number가 아니면 호출되지 않음
	@Get("trend/upvote/:type/list/:page")
	async getUpvoteTrend(@Param("type") type: string, @Param("page") page: number): Promise<[Boards[], number]> {
		console.log("[AllBoardController(Get) - boards/all/trend/upvote/:type/list/:page");
		const perPage: number = 10;
		const upvoteCutline: number = 1;

		const result = await this.allBoardService.getUpvoteTrend(upvoteCutline, page, perPage, type);

		if (result !== null) {
			for (let index: number = 0; index < result[0].length; index++) {
				result[0][index]["ip"] = result[0][index]["ip"].split(".")[0] + (result[0][index]["ip"].split(".")[1] !== undefined ? "." + result[0][index]["ip"].split(".")[1] : "");
			}
		}

		return result;
	}

	//게시글 목록, page 값이 number가 아니면 호출되지 않음
	@Get("trend/downvote/:type/list/:page")
	async getDownvoteTrend(@Param("type") type: string, @Param("page") page: number): Promise<[Boards[], number]> {
		console.log("[AllBoardController(Get) - boards/all/trend/downvote/:type/list/:page");
		const perPage: number = 10;
		const downvoteCutline: number = 1;

		const result = await this.allBoardService.getDownvoteTrend(downvoteCutline, page, perPage, type);

		if (result !== null) {
			for (let index: number = 0; index < result[0].length; index++) {
				result[0][index]["ip"] = result[0][index]["ip"].split(".")[0] + (result[0][index]["ip"].split(".")[1] !== undefined ? "." + result[0][index]["ip"].split(".")[1] : "");
			}
		}

		return result;
	}

	//게시글 목록, page 값이 number가 아니면 호출되지 않음
	@Get("trend/view/:type/list/:page")
	async getViewTrend(@Param("type") type: string, @Param("page") page: number): Promise<[Boards[], number]> {
		console.log("[AllBoardController(Get) - boards/all/trend/view/:type/list/:page");
		const perPage: number = 10;
		const viewCutline: number = 1;

		const result = await this.allBoardService.getViewTrend(viewCutline, page, perPage, type);

		if (result !== null) {
			for (let index: number = 0; index < result[0].length; index++) {
				result[0][index]["ip"] = result[0][index]["ip"].split(".")[0] + (result[0][index]["ip"].split(".")[1] !== undefined ? "." + result[0][index]["ip"].split(".")[1] : "");
			}
		}

		return result;
	}
}