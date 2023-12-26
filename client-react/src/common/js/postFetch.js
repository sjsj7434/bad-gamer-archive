import { isFetchStatusGood, getFetchJson, getFetchText } from './fetchCommonImport';

/**
 * postType의 게시글 목록을 가져온다
 */
export const getPostList = async (postType, searchType, searchText, page) => {
	const fecthOption = {
		method: "GET"
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/post/${postType}/list/${page}?searchType=${searchType}&searchText=${searchText}`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchJson(fetchResponse);

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * postType의 Trend 게시글 목록을 가져온다
 */
export const getTrendPostList = async (postType, trendType, searchType, searchText, page) => {
	const fecthOption = {
		method: "GET"
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/post/${postType}/trend/${trendType}/list/${page}?searchType=${searchType}&searchText=${searchText}`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchJson(fetchResponse);

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 특정 게시글을 조회
 */
export const readContent = async (postType, postCode) => {
	const fecthOption = {
		method: "GET"
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/post/${postType}/view/${postCode}`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchJson(fetchResponse);

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 특정 게시글 정보를 가져온다
 */
export const getContentData = async (postType, postCode) => {
	const fecthOption = {
		method: "GET"
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/post/${postType}/data/${postCode}`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchJson(fetchResponse);

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 게시글 추천
 */
export const upvoteContent = async (postType, sendData) => {
	const fecthOption = {
		method: "POST"
		, body: JSON.stringify(sendData)
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/post/${postType}/upvote`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchJson(fetchResponse);

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 게시글 비추천
 */
export const downvoteContent = async (postType, sendData) => {
	const fecthOption = {
		method: "POST"
		, body: JSON.stringify(sendData)
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/post/${postType}/downvote`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchJson(fetchResponse);

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 게시판 글 작성
 */
export const createContent = async (postType, sendData) => {
	const fecthOption = {
		method: "POST"
		, body: JSON.stringify(sendData)
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/post/${postType}`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchJson(fetchResponse);

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
export const updateContent = async (postType, sendData) => {
	const fecthOption = {
		method: "PATCH"
		, body: JSON.stringify(sendData)
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/post/${postType}`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchJson(fetchResponse);

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
export const deleteContent = async (postType, sendData) => {
	const fecthOption = {
		method: "DELETE"
		, body: JSON.stringify(sendData)
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/post/${postType}`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchJson(fetchResponse);

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
export const checkBeforeEdit = async (postType, sendData) => {
	const fecthOption = {
		method: "POST"
		, body: JSON.stringify(sendData)
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/post/${postType}/check/author`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchJson(fetchResponse);

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/*
	From here, it is for the Known Board ---------------------------------------------------------------------------------
*/

/**
 * 유저 게시글 추천자 목록
 */
export const showUpvoteUserList = async (postCode) => {
	const fecthOption = {
		method: "GET"
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/post/known/upvote/list/${postCode}`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchJson(fetchResponse);

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 유저 게시글 비추천자 목록
 */
export const showDownvoteUserList = async (postCode) => {
	const fecthOption = {
		method: "GET"
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/post/known/downvote/list/${postCode}`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchJson(fetchResponse);

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 고객센터 문의 작성
 */
export const writeHelpCenter = async (sendData) => {
	const fecthOption = {
		method: "POST"
		, body: JSON.stringify(sendData)
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/post/help`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchText(fetchResponse);
		console.log('writeHelpCenter =>', fetchData);

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}