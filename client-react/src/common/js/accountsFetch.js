import { isFetchStatusGood, getFetchText, getFetchJson } from './fetchCommonImport';

/**
 * stove 계정 소개란에 적을 인증코드를 생성한다
 */
export const getVerificationCode = async () => {
	const fecthOption = {
		method: "GET"
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`${process.env.REACT_APP_SERVER}/accounts/stove/verification/code`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchText(fetchResponse);
		console.log('getVerificationCode =>', fetchData)

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * stove 계정 소개란에 적어놓은 인증코드와 비교(공식 API 사용)
 */
export const checkProfileTokenMatchAPI = async (stoveCode) => {
	const fecthOption = {
		method: "GET"
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`${process.env.REACT_APP_SERVER}/accounts/stove/verification/api/${stoveCode}`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchJson(fetchResponse);
		console.log('checkProfileTokenMatchAPI =>', fetchData)

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * stove 계정 소개란에 적어놓은 인증코드와 비교(웹 페이지 스크랩한 데이터 사용)
 */
export const checkProfileTokenMatchScrap = async (stoveCode) => {
	const fecthOption = {
		method: "GET"
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`${process.env.REACT_APP_SERVER}/accounts/stove/verification/scrap/${stoveCode}`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchJson(fetchResponse);
		console.log('checkProfileTokenMatchScrap =>', fetchData)

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 이미 존재하는 ID인지 확인
 */
export const isDuplicatedID = async (id) => {
	const fecthOption = {
		method: "GET"
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`${process.env.REACT_APP_SERVER}/accounts/id/${id}`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchText(fetchResponse);
		console.log('isDuplicatedID =>', fetchData)

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 이미 존재하는 닉네임인지 확인
 */
export const isDuplicatedNickname = async (nickname) => {
	const fecthOption = {
		method: "GET"
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`${process.env.REACT_APP_SERVER}/accounts/nickname/${nickname}`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchText(fetchResponse);
		console.log('isDuplicatedNickname =>', fetchData)

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 회원가입
 * @returns {object} 회원가입 처리 결과
 */
export const createAccount = async (accountInfo) => {
	const fecthOption = {
		method: "POST"
		, body: JSON.stringify(accountInfo)
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`${process.env.REACT_APP_SERVER}/accounts`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchText(fetchResponse);
		console.log('createAccount =>', fetchData)

		if(isNaN(fetchData) === true){
			return null;
		}
		else{
			return parseInt(fetchData, 10);
		}
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 로그인, Sign In
 */
export const signInAccount = async (accountInfo) => {
	const fecthOption = {
		method: "POST"
		, body: JSON.stringify(accountInfo)
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`${process.env.REACT_APP_SERVER}/accounts/signin`, fecthOption);
	const [isStatusGood] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchText(fetchResponse);
		console.log('signInAccount =>', fetchData)

		return fetchData;
	}
	else{
		// alert(checkMessage);
		alert("로그인이 실패하였습니다");

		return null;
	}
}

/**
 * 이미 해당 계정으로 로그인한 사람이 있는지 확인
 */
export const checkSignInStatus = async () => {
	const fecthOption = {
		method: "GET"
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`${process.env.REACT_APP_SERVER}/accounts/signin/status`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchJson(fetchResponse);
		console.log('checkSignInStatus =>', fetchData)

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 로그아웃, sign out
 */
export const setSignOut = async () => {
	const fecthOption = {
		method: "POST"
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	await fetch(`${process.env.REACT_APP_SERVER}/accounts/signout`, fecthOption);
}

/**
 * lostark 캐릭터 정보 가져오기
 */
export const getCharacterInfoScrap = async (characterName) => {
	const fecthOption = {
		method: "GET"
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`${process.env.REACT_APP_SERVER}/accounts/stove/character/scrap/${characterName}`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchJson(fetchResponse);
		console.log('getCharacterInfoScrap =>', fetchData)

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * lostark 캐릭터 설정
 */
export const setLostarkMainCharacter = async (accountInfo) => {
	console.log(accountInfo)
	const fecthOption = {
		method: "PUT"
		, body: JSON.stringify(accountInfo)
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`${process.env.REACT_APP_SERVER}/accounts/lostark/character`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchText(fetchResponse);
		console.log('setLostarkMainCharacter =>', fetchData)

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 내 정보 페이지에서 사용할 정보 가져오기
 */
export const getMyInfo = async () => {
	const fecthOption = {
		method: "GET"
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`${process.env.REACT_APP_SERVER}/accounts/information/my`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchJson(fetchResponse);
		console.log('getMyInfo =>', fetchData)

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 비밀번호 변경
 */
export const renewPassword = async (sendData) => {
	const fecthOption = {
		method: "PATCH"
		, body: JSON.stringify(sendData)
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`${process.env.REACT_APP_SERVER}/accounts/password`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchJson(fetchResponse);
		console.log('renewPassword =>', fetchData)

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 닉네임 변경
 */
export const renewNickname = async (sendData) => {
	const fecthOption = {
		method: "PATCH"
		, body: JSON.stringify(sendData)
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`${process.env.REACT_APP_SERVER}/accounts/nickname`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchJson(fetchResponse);
		console.log('renewNickname =>', fetchData)

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 이메일 인증 요청
 */
export const requestVerifyEmail = async () => {
	const fecthOption = {
		method: "POST"
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`${process.env.REACT_APP_SERVER}/accounts/verify/send/email`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchText(fetchResponse);
		console.log('requestVerifyEmail =>', fetchData)

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 비밀번호를 잊어버려 비밀번호 초기화 요청
 */
export const requestPasswordReset = async (sendData) => {
	const fecthOption = {
		method: "POST"
		, body: JSON.stringify(sendData)
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`${process.env.REACT_APP_SERVER}/accounts/reset/password/request`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchText(fetchResponse);
		console.log('requestPasswordReset =>', fetchData)

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 메일에 적힌 링크 파라미터 값을 서버와 비교
 */
export const compareResetPasswordCode = async (sendData) => {
	const fecthOption = {
		method: "POST"
		, body: JSON.stringify(sendData)
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`${process.env.REACT_APP_SERVER}/accounts/verify/reset/password/code`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchText(fetchResponse);
		console.log('compareResetPasswordCode =>', fetchData)

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 비밀번호 초기화
 */
export const resetPassword = async (sendData) => {
	const fecthOption = {
		method: "PATCH"
		, body: JSON.stringify(sendData)
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`${process.env.REACT_APP_SERVER}/accounts/reset/password/execute`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchText(fetchResponse);
		console.log('compareResetPasswordCode =>', fetchData)

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}