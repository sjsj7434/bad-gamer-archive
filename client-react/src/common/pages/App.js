import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Error404 from './errors/Error404';
import { useState, useEffect } from 'react';
import { Navigate } from "react-router-dom";

import LostarkMain from '../../lostark/pages/LostarkMain';
import CharacterInfo from '../../lostark/pages/character/CharacterInfo';
import SignUpForm from './accounts/SignUpForm';
import SignInForm from './accounts/SignInForm';
import CommonTopMenu from './CommonTopMenu';
import MyPage from './accounts/MyPage';
import * as accountsAction from '../js/accountsAction.js'

import 'bootstrap/dist/css/bootstrap.min.css';


// index.js에서 StrictMode 존재하면 두번 랜더링, 개발 모드에서만 적용됩니다. 생명주기 메서드들은 프로덕션 모드에서 이중으로 호출되지 않습니다.
	// get Login info here and give props to child
	// @ 상위 -> 하위시, props로 데이터 전달
	// @ 하위 -> 상위시, props로 실행할 함수를 하위로 전달하고 하위에서 실행. 이때 무한루프에 빠지지 않도록 주의한다.
const App = () => {
	const [accountData, setAccountData] = useState({});
	
	const checkSignIn = async () => {
		const statusJSON = await accountsAction.checkSignInStatus();
		console.log("App", statusJSON)
		
		if(statusJSON.status === "locked"){
			alert("somebody keep trying to login your account, so it's locked now");
		}
		else if(statusJSON.status === "banned"){
			alert("sorry, you are banned");
		}
		else if(statusJSON.status === "lost"){
			alert("this account is lost, how can you use this?");
		}
		else if(statusJSON.status === "wrong_cookie"){
			alert("can not read who you are");
		}

		setAccountData(statusJSON);
	}

	useEffect(() => {
		checkSignIn();
	}, []); //처음 페이지 로딩 될때만, useEffect 함수에 종속성이 없으면 무한 루프가 발생한다

	return (
		<>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Navigate to="/lostark" replace={true} />}></Route>
				<Route path="lostark/*" element={<><CommonTopMenu accountData={accountData} renewLogin={checkSignIn} /><LostarkMain /></>}></Route>

				<Route path="accounts">
					<Route path="signup" element={<><CommonTopMenu accountData={accountData} renewLogin={checkSignIn} /><SignUpForm /></>}>
					</Route>

					<Route path="signin" element={<><CommonTopMenu accountData={accountData} renewLogin={checkSignIn} /><SignInForm accountData={accountData} /></>}>
					</Route>

					<Route path="mypage/*" element={<><CommonTopMenu accountData={accountData} renewLogin={checkSignIn} /><MyPage accountData={accountData} /></>}>
					</Route>
				</Route>

				<Route path="/character/:characterName" element={<><CommonTopMenu accountData={accountData} renewLogin={checkSignIn} /><CharacterInfo /></>}></Route>

				{/* 상단에 위치하는 라우트들의 규칙을 모두 확인, 일치하는 라우트가 없는경우 처리 */}
				<Route path="*" element={<><CommonTopMenu accountData={accountData} renewLogin={checkSignIn} /><Error404 /></>}></Route>
			</Routes>
		</BrowserRouter>
		</>
	);
}

export default App;