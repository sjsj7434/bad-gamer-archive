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
	const fetchResponse = await fetch(`${process.env.REACT_APP_SERVER}/accounts/publish/token`, fecthOption);
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
 * stove 계정 소개란에 적어놓은 인증코드와 비교
 */
export const checkProfileTokenMatch = async (stoveCode) => {
	const fecthOption = {
		method: "GET"
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const fetchResponse = await fetch(`${process.env.REACT_APP_SERVER}/accounts/stove/profile/${stoveCode}`, fecthOption);
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchJson(fetchResponse);
		console.log('checkProfileTokenMatch =>', fetchData)

		return fetchData;
	}
	else{
		alert(checkMessage);

		return null;
	}
}

/**
 * 이미 존재하는 ID인지 확인
 * @returns {object} 가져온 stove 소개란 인증코드
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
 * @returns {object} 가져온 stove 소개란 인증코드
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

		return fetchData;
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
	const [isStatusGood, checkMessage] = isFetchStatusGood(fetchResponse);

	if(isStatusGood === true){
		const fetchData = await getFetchText(fetchResponse);
		console.log('signInAccount =>', fetchData)

		return fetchData;
	}
	else{
		alert(checkMessage);

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
 * @returns {object} 로그아웃 처리 결과
 */
export const setSignOut = async () => {
	const fecthOption = {
		method: "POST"
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	await fetch(`${process.env.REACT_APP_SERVER}/accounts/signout`, fecthOption);
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
 * @returns {object} 내 정보
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