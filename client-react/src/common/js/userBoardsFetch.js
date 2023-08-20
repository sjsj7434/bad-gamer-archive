import { isFetchStatusGood, getFetchJson } from './fetchCommonImport';

/**
 * 게시판의 게시글 목록을 가져온다
 */
export const readContentList = async (page) => {
	const fecthOption = {
		method: "GET"
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`${process.env.REACT_APP_SERVER}/boards/user/list/${page}`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchJson(fetchResponse);
		console.log('readContentList =>', fetchData)

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 특정 게시글 정보를 가져온다
 * view, read, edit
 */
export const readContent = async (contentCode, type) => {
	const fecthOption = {
		method: "GET"
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`${process.env.REACT_APP_SERVER}/boards/user/view/${contentCode}?type=${type}`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchJson(fetchResponse);
		console.log('readContent =>', fetchData)

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 특정 게시글을 삭제한다
 */
export const deleteContent = async (sendData) => {
	const fecthOption = {
		method: "DELETE"
		, body: JSON.stringify(sendData)
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`${process.env.REACT_APP_SERVER}/boards/user/content`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchJson(fetchResponse);
		console.log('deleteContent =>', fetchData)

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 특정 게시글에 추천, 비추천
 */
export const voteContent = async (voteType, sendData) => {
	const fecthOption = {
		method: "POST"
		, body: JSON.stringify(sendData)
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`${process.env.REACT_APP_SERVER}/boards/user/content/${voteType}`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchJson(fetchResponse);
		console.log('voteContent =>', fetchData)

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 게시글 생성
 */
export const createContent = async (sendData) => {
	const fecthOption = {
		method: "POST"
		, body: JSON.stringify(sendData)
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`${process.env.REACT_APP_SERVER}/boards/user/content`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchJson(fetchResponse);
		console.log('createContent =>', fetchData)

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 게시글 수정
 */
export const updateContent = async (sendData) => {
	const fecthOption = {
		method: "PATCH"
		, body: JSON.stringify(sendData)
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`${process.env.REACT_APP_SERVER}/boards/user/content`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchJson(fetchResponse);
		console.log('updateContent =>', fetchData)

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 수정 진입 전에 게시글 비밀번호 확인
 */
export const checkBeforeEdit = async (sendData) => {
	const fecthOption = {
		method: "POST"
		, body: JSON.stringify(sendData)
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`${process.env.REACT_APP_SERVER}/boards/user/content/check/writer`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchJson(fetchResponse);
		console.log('checkBeforeEdit =>', fetchData)

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}