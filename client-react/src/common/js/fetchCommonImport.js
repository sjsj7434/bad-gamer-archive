/**
 * fetch 응답이 정상인지 확인
 * @param {string} fetchResponse fetch 응답
 * @returns {[boolean, string]}
 */
export const isFetchStatusGood = (fetchResponse) => {
	if(fetchResponse === null){
		return [false, "서버로부터 응답이 없습니다"];
	}
	else if(fetchResponse.status === 500){
		return [false, "요청을 처리하는 중 오류가 발생하였습니다"];
	}
	else if(fetchResponse.status === 429){
		return [false, "너무 많은 요청이 전송되어 요청이 차단되었습니다\n잠시 후 다시 시도해주세요"];
	}
	else if(fetchResponse.status === 404){
		return [false, "올바른 요청이 아닙니다"];
	}
	else if(fetchResponse.status === 400){
		return [false, "올바른 요청이 아닙니다"];
	}
	else{
		return [true, ""];
	}
}

/**
 * fetch 결과를 string으로 반환
 * @param {Response} fetchResponse fetch 응답
 * @returns {Promise<string>}
 */
export const getFetchText = async (fetchResponse) => {
	const jsonResult = await fetchResponse.text();

	return jsonResult;
}

/**
 * fetch 결과를 JSON으로 반환
 * @param {Response} fetchResponse fetch 응답
 * @returns {Promise<JSON>}
 */
export const getFetchJson = async (fetchResponse) => {
	const textData = await fetchResponse.text();

	if(textData === "" || textData === undefined || textData === null || textData === "undefined" || textData === "null"){
		return null;
	}
	else{
		// const jsonResult = await fetchResponse.json(); //null 값이 오면 오류 발생
		const jsonResult = await JSON.parse(textData);
	
		return jsonResult;
	}
}