import { isFetchStatusGood, getFetchJson } from './fetchCommonImport';

/**
 * 댓글 삭제
 */
export const deleteReply = async (boardType, sendData) => {
	const fecthOption = {
		method: "DELETE"
		, body: JSON.stringify(sendData)
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/post/${boardType}/reply`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchJson(fetchResponse);
		console.log('deleteReply =>', fetchData)

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 댓글 가져오기
 */
export const getReplies = async (boardType, postCode, currentPage) => {
	const fecthOption = {
		method: "GET"
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/post/${boardType}/reply/${postCode}/${currentPage}`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchJson(fetchResponse);
		console.log('getReplies =>', fetchData)

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 댓글 작성
 */
export const createReply = async (boardType, sendData) => {
	const fecthOption = {
		method: "POST"
		, body: JSON.stringify(sendData)
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/post/${boardType}/reply`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchJson(fetchResponse);
		console.log('createReply =>', fetchData)

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}