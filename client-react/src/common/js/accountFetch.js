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
	const fetchResponse = await fetch(`/account/stove/verification/code`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchText(fetchResponse);

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
	const fetchResponse = await fetch(`/account/stove/verification/api/${stoveCode}`, fecthOption);
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
 * stove 계정 소개란에 적어놓은 인증코드와 비교(웹 페이지 스크랩한 데이터 사용)
 */
export const checkProfileTokenMatchScrap = async (stoveCode) => {
	const fecthOption = {
		method: "GET"
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/account/stove/verification/scrap/${stoveCode}`, fecthOption);
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
 * 이미 존재하는 ID인지 확인
 */
export const isDuplicatedID = async (id) => {
	const fecthOption = {
		method: "GET"
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/account/id/${id}`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchText(fetchResponse);

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
	const fetchResponse = await fetch(`/account/nickname/${nickname}`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchText(fetchResponse);

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
	const fetchResponse = await fetch(`/account`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchText(fetchResponse);

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
 * 로그인
 */
export const loginAccount = async (accountInfo) => {
	const fecthOption = {
		method: "POST"
		, body: JSON.stringify(accountInfo)
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/account/login`, fecthOption);
	const [isStatusGood] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchText(fetchResponse);

		return fetchData;
	}
	else{
		alert("로그인이 실패하였습니다");

		return null;
	}
}

/**
 * 이미 해당 계정으로 로그인한 사람이 있는지 확인
 */
export const checkLoginStatus = async () => {
	const fecthOption = {
		method: "GET"
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/account/login/status`, fecthOption);
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
 * 로그아웃
 */
export const logoutAccount = async () => {
	const fecthOption = {
		method: "POST"
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	await fetch(`/account/logout`, fecthOption);
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
	const fetchResponse = await fetch(`/account/stove/character/scrap/${characterName}`, fecthOption);
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
 * lostark 캐릭터 설정
 */
export const setLostarkCharacter = async (accountInfo) => {
	const fecthOption = {
		method: "PUT"
		, body: JSON.stringify(accountInfo)
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/account/lostark/character/set`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchText(fetchResponse);

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 인증된 lostark 캐릭터 정보 갱신
 */
export const changeLostarkCharacter = async () => {
	const fecthOption = {
		method: "PUT"
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/account/lostark/character/change`, fecthOption);
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
 * lostark 캐릭터 인증 업데이트
 */
export const renewLostarkCharacter = async () => {
	const fecthOption = {
		method: "PUT"
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/account/lostark/character/renew`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchText(fetchResponse);

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * lostark 캐릭터 설정하지 않고 종료
 */
export const exitLostarkAuthentication = async (accountInfo) => {
	const fecthOption = {
		method: "POST"
		, body: JSON.stringify(accountInfo)
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/account/lostark/character/exit`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchText(fetchResponse);

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 로스트아크 캐릭터 인증 해제
 */
export const deactivateLostarkCharacter = async (sendData) => {
	const fecthOption = {
		method: "DELETE"
		, body: JSON.stringify(sendData)
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/account/lostark/character`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchText(fetchResponse);

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
	const fetchResponse = await fetch(`/account/information/my`, fecthOption);
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
 * 비밀번호 변경
 */
export const renewPassword = async (sendData) => {
	const fecthOption = {
		method: "PATCH"
		, body: JSON.stringify(sendData)
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/account/password`, fecthOption);
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
 * 닉네임 변경
 */
export const renewNickname = async (sendData) => {
	const fecthOption = {
		method: "PATCH"
		, body: JSON.stringify(sendData)
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/account/nickname`, fecthOption);
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
 * 이메일 인증 요청
 */
export const requestVerifyEmail = async () => {
	const fecthOption = {
		method: "POST"
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/account/verify/send/email`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchText(fetchResponse);

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
	const fetchResponse = await fetch(`/account/reset/password/request`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchText(fetchResponse);

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
	const fetchResponse = await fetch(`/account/reset/password/execute`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchText(fetchResponse);

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 비밀번호 잊어버린 사용자, 이메일로 전달받은 코드 확인
 */
export const checkPasswordForgotCode = async (verificationCode) => {
	const fecthOption = {
		method: "GET"
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/account/verify/reset/password/${verificationCode}`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchText(fetchResponse);

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 회원탈퇴
 */
export const deleteAccount = async () => {
	const fecthOption = {
		method: "DELETE"
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/account`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchText(fetchResponse);

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 유저 차단
 */
export const addToBlacklist = async (sendData) => {
	const fecthOption = {
		method: "POST"
		, body: JSON.stringify(sendData)
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/account/blacklist`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchText(fetchResponse);

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 차단 목록 가져오기
 */
export const getMyBlacklist = async (page) => {
	const fecthOption = {
		method: "GET"
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/account/blacklist/${page}`, fecthOption);
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
 * 차단 목록 초기화
 */
export const resetMyBlacklist = async () => {
	const fecthOption = {
		method: "DELETE"
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/account/blacklist/reset`, fecthOption);
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
 * 차단 정보 삭제
 */
export const deleteMyBlacklist = async (sendData) => {
	const fecthOption = {
		method: "DELETE"
		, body: JSON.stringify(sendData)
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/account/blacklist`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchText(fetchResponse);

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 차단 정보 수정
 */
export const updateMyBlacklist = async (sendData) => {
	const fecthOption = {
		method: "PATCH"
		, body: JSON.stringify(sendData)
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/account/blacklist`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchText(fetchResponse);

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 자기소개 정보 저장
 */
export const saveMyIntroduce = async (sendData) => {
	const fecthOption = {
		method: "PATCH"
		, body: JSON.stringify(sendData)
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/account/introduce`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchText(fetchResponse);

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 자기소개 정보 삭제
 */
export const deleteMyIntroduce = async () => {
	const fecthOption = {
		method: "DELETE"
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/account/introduce`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchText(fetchResponse);

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 프로필 사진 저장
 */
export const uploadProfilePicture = async (fileData) => {
	const fecthOption = {
		method: "POST"
		, body: fileData
		, headers: {}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/account/image`, fecthOption);
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
 * 프로필 사진 삭제
 */
export const deleteProfilePicture = async () => {
	const fecthOption = {
		method: "DELETE"
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/account/image`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchText(fetchResponse);

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 내가 작성한 글 가져오기
 */
export const getMyPost = async () => {
	const fecthOption = {
		method: "GET"
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/account/post`, fecthOption);
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
 * 다른 사용자 정보 페이지에서 사용할 정보 가져오기
 */
export const getYourInfo = async (nickname) => {
	const fecthOption = {
		method: "GET"
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`/account/information/${nickname}`, fecthOption);
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