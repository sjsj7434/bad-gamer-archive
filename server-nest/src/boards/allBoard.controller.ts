import { Param, Controller, Get } from '@nestjs/common';
import { Boards } from './boards.entity';
import { AllBoardService } from './allBoard.service';

const REPlY_MAX_LENG = 300; //댓글 글자 수 제한

/**
 * 익명 게시판 컨트롤러
 */
@Controller("boards/all")
export class AllBoardController {
	constructor(private allBoardService: AllBoardService) { }

	//게시글 목록, page 값이 number가 아니면 호출되지 않음
	@Get("upvote/list/:page")
	async getContentList(@Param("page") page: number): Promise<[Boards[], number]> {
		console.log("[AllBoardController(Get) - boards/all/upvote/list/:page]");
		const perPage: number = 20;
		const upvoteCutline: number = 1;

		const result = await this.allBoardService.getContentList(upvoteCutline, page, perPage);

		if (result !== null) {
			for (let index: number = 0; index < result[0].length; index++) {
				result[0][index]["ip"] = result[0][index]["ip"].split(".")[0] + (result[0][index]["ip"].split(".")[1] !== undefined ? "." + result[0][index]["ip"].split(".")[1] : "");
			}
		}

		return result;
	}
}