/**
 * 자주 사용하는 fetch 템플릿
 * @param {string} destination fetch url, 목적지
 * @returns {object} 가져온 정보 JSON
 */
const parseStringToJson = async (jsonString) => {
	if(jsonString === null){
		return null;
	}
	else if(jsonString.status === 500){
		alert("Error!\nCan not get data");
		return null;
	}
	else{
		const jsonResult = await jsonString.json();

		if(jsonResult.statusCode === 500){
			return null;
		}
		else if(jsonResult.data === null){
			return null;
		}
		else{
			return jsonResult.data;
		}
	}
}

/**
 * 입력한 캐릭터 이름의 기본 정보를 가져온다
 * @returns {object} 가져온 캐릭터 정보 JSON
 */
export const postTest = async (sendData) => {
	const fecthOption = {
		method: "POST"
		, body: JSON.stringify(sendData)
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const jsonString = await fetch(`${process.env.REACT_APP_SERVER}/accounts`, fecthOption);
	const jsonData = await parseStringToJson(jsonString);

	console.log("postTest", jsonData);

	return jsonData;
}

/**
 * 입력한 캐릭터 이름의 기본 정보를 가져온다
 * @returns {object} 가져온 캐릭터 정보 JSON
 */
export const putTest = async (sendData) => {
	const fecthOption = {
		method: "PUT"
		, body: JSON.stringify(sendData)
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const jsonString = await fetch(`${process.env.REACT_APP_SERVER}/accounts`, fecthOption);
	const jsonData = await parseStringToJson(jsonString);

	console.log("putTest", jsonData);

	return jsonData;
}

/**
 * 입력한 캐릭터 이름의 기본 정보를 가져온다
 * @returns {object} 가져온 캐릭터 정보 JSON
 */
export const deleteTest = async (sendData) => {
	const fecthOption = {
		method: "DELETE"
		, body: JSON.stringify(sendData)
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const jsonString = await fetch(`${process.env.REACT_APP_SERVER}/accounts`, fecthOption);
	const jsonData = await parseStringToJson(jsonString);

	console.log("deleteTest", jsonData);

	return jsonData;
}

/**
 * stove 계정 소개란에 적을 인증코드를 생성한다
 * @returns {object} 생성한 인증코드
 */
export const getVerificationCode = async () => {
	const fecthOption = {
		method: "GET"
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const jsonString = await fetch(`${process.env.REACT_APP_SERVER}/accounts/stove/token`, fecthOption);
	const jsonData = await parseStringToJson(jsonString);

	console.log("getVerificationCode", jsonData);

	return jsonData;
}

/**
 * stove 계정 소개란에 적어놓은 인증코드와 비교
 * @returns {object} 가져온 stove 소개란 인증코드
 */
export const checkTokenMatch = async (stoveCode) => {
	const fecthOption = {
		method: "GET"
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const jsonString = await fetch(`${process.env.REACT_APP_SERVER}/accounts/stove/${stoveCode}`, fecthOption);
	const jsonData = await parseStringToJson(jsonString);

	console.log("checkTokenMatch", jsonData);

	return jsonData;
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
	const jsonString = await fetch(`${process.env.REACT_APP_SERVER}/accounts/id/${id}`, fecthOption);
	const jsonData = await parseStringToJson(jsonString);

	console.log("isDuplicatedID", jsonData);

	return jsonData;
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
	const jsonString = await fetch(`${process.env.REACT_APP_SERVER}/accounts/nickname/${nickname}`, fecthOption);
	const jsonData = await parseStringToJson(jsonString);

	console.log("isDuplicatedNickname", jsonData);

	return jsonData;
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
	const jsonString = await fetch(`${process.env.REACT_APP_SERVER}/accounts`, fecthOption);
	const jsonData = await parseStringToJson(jsonString);

	console.log("createAccount", jsonData);

	return jsonData;
}

/**
 * 로그인, Sign In
 * @returns {object} 로그인 처리 결과
 */
export const signInAccount = async (accountInfo) => {
	const fecthOption = {
		method: "POST"
		, body: JSON.stringify(accountInfo)
		, headers: {"Content-Type": "application/json",}
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const jsonString = await fetch(`${process.env.REACT_APP_SERVER}/accounts/signin`, fecthOption);
	const jsonData = await parseStringToJson(jsonString);

	console.log("signInAccount", jsonData);

	return jsonData;
}

/**
 * 로그인, Sign In
 * @returns {object} 로그인 처리 결과
 */
export const checkSignInStatus = async () => {
	const fecthOption = {
		method: "POST"
		, credentials: "include", // Don't forget to specify this if you need cookies
	};
	const jsonString = await fetch(`${process.env.REACT_APP_SERVER}/accounts/signin/status`, fecthOption);
	const jsonData = await parseStringToJson(jsonString);

	console.log("checkSignInStatus", jsonData);

	return jsonData;
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