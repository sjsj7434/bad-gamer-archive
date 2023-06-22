import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Navigate } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';

import Error404 from './errors/Error404';
import CharacterInfo from '../../lostark/pages/character/CharacterInfo';
import SignUpForm from './accounts/SignUpForm';
import SignInForm from './accounts/SignInForm';
import CommonTopMenu from './CommonTopMenu';
import MyPage from './accounts/MyPage';
import ActivateLostarkScrap from './accounts/ActivateLostarkScrap';
import BlockNoSignin from './accounts/BlockNoSignin';
import * as accountsFetch from '../js/accountsFetch.js'
import LostarkMain from '../../lostark/pages/LostarkMain';
import AnonymousBoard from './boards/AnonymousList';
import AnonymousView from './boards/AnonymousView';
import AnonymousWrite from './boards/AnonymousWrite';
import UsefulSitesLostark from './common/UsefulSitesLostark';
import PasswordChangeForm from './accounts/PasswordChangeForm';
import ForgotPasswordForm from './accounts/ForgotPasswordForm';
import BlockYesSignin from './accounts/BlockYesSignin';
import ResetPasswordForm from './accounts/ResetPasswordForm';
import CommonInclude from './CommonInclude';

// index.js에서 StrictMode 존재하면 두번 랜더링, 개발 모드에서만 적용됩니다. 생명주기 메서드들은 프로덕션 모드에서 이중으로 호출되지 않습니다.
	// get Login info here and give props to child
	// @ 상위 -> 하위시, props로 데이터 전달
	// @ 하위 -> 상위시, props로 실행할 함수를 하위로 전달하고 하위에서 실행. 이때 무한루프에 빠지지 않도록 주의한다.
const App = () => {
	const [accountData, setAccountData] = useState(null);
	
	const checkSignInStatus = async () => {
		const statusJSON = await accountsFetch.checkSignInStatus();
		setAccountData(statusJSON);
	}

	useEffect(() => {
		checkSignInStatus();
	}, []); //처음 페이지 로딩 될때만, useEffect 함수에 종속성이 없으면 무한 루프가 발생한다

	return (
		<>
			<BrowserRouter>
				{
					accountData === null ?
					<></>
					:
					<>
						<Routes>
							{/* Common include */}
							<Route path="*" element={ <CommonInclude checkSignInStatus={checkSignInStatus} /> }></Route>
						</Routes>

						<Routes>
							{/* Top menu */}
							<Route path="*" element={ <CommonTopMenu accountData={accountData} checkSignInStatus={checkSignInStatus} /> }></Route>
						</Routes>

						<Routes>
							{/* Contents */}
							<Route path="/" element={ <Navigate to="lostark" replace={true} /> }></Route>
							<Route path="lostark">
								<Route path="" element={<LostarkMain />}></Route>

								<Route path="useful" element={ <UsefulSitesLostark /> }></Route>
								
								<Route path="board">
									<Route path="anonymous/:page" element={<AnonymousBoard />}></Route>
									<Route path=":category/view/:contentCode" element={<AnonymousView />}></Route>
									<Route path="anonymous/write" element={<AnonymousWrite />}></Route>
									<Route path="anonymous/edit/:contentCode" element={<AnonymousWrite />}></Route>

									<Route path="identified/:page" element={<AnonymousBoard />}></Route>
									<Route path="identified/write" element={<AnonymousWrite />}></Route>
								</Route>
							</Route>

							<Route path="accounts">
								<Route path="signup" element={ <BlockYesSignin accountData={accountData} ifAllow={<SignUpForm />} /> }></Route>
								<Route path="signin" element={ <BlockYesSignin accountData={accountData} ifAllow={<SignInForm checkSignInStatus={checkSignInStatus} />} /> }></Route>
								<Route path="find/password" element={ <BlockYesSignin accountData={accountData} ifAllow={<ForgotPasswordForm />} /> }></Route>
								<Route path="reset/password" element={ <BlockYesSignin accountData={accountData} ifAllow={<ResetPasswordForm />} /> }></Route>
								
								<Route path="mypage">
									<Route path="" element={ <BlockNoSignin accountData={accountData} ifAllow={<MyPage />} /> }></Route>
									<Route path="activate/lostark" element={ <BlockNoSignin accountData={accountData} ifAllow={<ActivateLostarkScrap />} /> }></Route>
									<Route path="change/password" element={ <BlockNoSignin accountData={accountData} ifAllow={<PasswordChangeForm />} /> }></Route>
								</Route>
							</Route>

							<Route path="/character/:characterName" element={ <CharacterInfo /> }></Route>

							{/* 상단에 위치하는 라우트들의 규칙을 모두 확인, 일치하는 라우트가 없는경우 처리 */}
							<Route path="*" element={ <Error404 /> }></Route>
						</Routes>
					</>
				}
			</BrowserRouter>
		</>
	);
}

export default App;