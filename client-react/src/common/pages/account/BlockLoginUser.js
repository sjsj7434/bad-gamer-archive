import { Navigate } from "react-router-dom";

/**
 * 로그인하지 않은 상태에서만 접근 가능한 페이지에 포함되는 컴포넌트
 */
const BlockLoginUser = (props) => {
	if(props.accountData.status === "login"){
		alert("로그인한 상태로는 이용할 수 없습니다");

		return (
			<Navigate to="/" />
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

export default BlockLoginUser;