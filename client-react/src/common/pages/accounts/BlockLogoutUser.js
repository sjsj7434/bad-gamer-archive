import { Navigate } from "react-router-dom";

/**
 * 로그인이 필수인 페이지에 포함되는 컴포넌트
 */
const BlockLogoutUser = (props) => {
	if(props.accountData.status !== "login"){
		alert("로그인이 필요합니다");

		return (
			<Navigate to="/accounts/login" />
		);
	}
	else{
		return (
			<>
				{props.ifAllow}
			</>
		);
	}
}

export default BlockLogoutUser;