/**
 * fetch 응답이 정상인지 확인
 * @param {string} fetchResponse fetch 응답
 * @returns {[boolean, string]}
 */
export const isFetchStatusGood = (fetchResponse) => {
	if(fetchResponse === null){
		return [false, "응답이 없습니다"];
	}
	else if(fetchResponse.status === 500){
		return [false, "데이터를 가져오는 중 오류가 발생하였습니다"];
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
	const jsonResult = await fetchResponse.json();

	return jsonResult;
}