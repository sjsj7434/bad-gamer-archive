import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Navigate } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';

import Error404 from './errors/Error404';
import SignUpForm from './accounts/SignUpForm';
import SignInForm from './accounts/SignInForm';
import CommonTopMenu from './CommonTopMenu';
import MyPage from './accounts/MyPage';
import ActivateLostarkScrap from './accounts/ActivateLostarkScrap';
import BlockNoSignin from './accounts/BlockNoSignin';
import * as accountsFetch from '../js/accountsFetch.js'
import LostarkMain from '../../lostark/pages/LostarkMain';
import ContentBoard from './board/ContentBoard';
import ContentView from './board/ContentView';
import ContentWriteAnonymous from './board/ContentWriteAnonymous';
import UsefulSitesLostark from './common/UsefulSitesLostark';
import PasswordChangeForm from './accounts/PasswordChangeForm';
import ForgotPasswordForm from './accounts/ForgotPasswordForm';
import BlockYesSignin from './accounts/BlockYesSignin';
import ResetPasswordForm from './accounts/ResetPasswordForm';
import ContentWriteUser from './board/ContentWriteUser';
// import CharacterInfo from '../../lostark/pages/character/CharacterInfo';

// index.js에서 StrictMode 존재하면 두번 랜더링, 개발 모드에서만 적용됩니다. 생명주기 메서드들은 프로덕션 모드에서 이중으로 호출되지 않습니다.
const RoutesWrapper = () => {
	const [accountData, setAccountData] = useState(null);
	let location = useLocation();
	
	const checkSignInStatus = async () => {
		const statusJSON = await accountsFetch.checkSignInStatus();
		setAccountData(statusJSON);
	}

	useEffect(() => {
		checkSignInStatus();
	}, [location.pathname]); //URL이 바뀔 때 마다 로그인 정보 갱신

	if(accountData !== null){
		return (
			<>
				<Routes>
					{/* Top menu */}
					<Route path="*" element={ <CommonTopMenu accountData={accountData} checkSignInStatus={checkSignInStatus} /> } />
				</Routes>

				<Routes>
					{/* Contents */}
					<Route path="" element={ <Navigate to="lostark/main" replace={true} /> } />
					{/* <Route path="/" element={ <Navigate to="lostark" replace={true} /> } /> */}

					<Route path="lostark">
						<Route path="" element={ <Navigate to="main" replace={true} /> } />
						<Route path="main" element={ <LostarkMain /> } />

						<Route path="useful" element={ <UsefulSitesLostark /> } />
						
						<Route path="board">
							<Route path="anonymous">
								<Route path="" element={ <Navigate to="1" replace={true} /> } />
								<Route path=":page" element={ <ContentBoard boardType="anonymous" boardTitle="익명" /> } />
								<Route path="view/:contentCode" element={ <ContentView boardType="anonymous" boardTitle="익명" accountData={accountData} /> } />
								<Route path="write" element={ <ContentWriteAnonymous boardType="anonymous" /> } />
								<Route path="edit/:contentCode" element={ <ContentWriteAnonymous boardType="anonymous" /> } />
							</Route>
							<Route path="user">
								<Route path="" element={ <Navigate to="1" replace={true} /> } />
								<Route path=":page" element={ <ContentBoard boardType="user" boardTitle="유저" /> } />
								<Route path="view/:contentCode" element={ <ContentView boardType="user" boardTitle="유저" accountData={accountData} /> } />
								<Route path="write" element={ <BlockNoSignin accountData={accountData} ifAllow={<ContentWriteUser boardType="user" accountData={accountData} />} /> } />
								<Route path="edit/:contentCode" element={ <BlockNoSignin accountData={accountData} ifAllow={<ContentWriteUser boardType="user" accountData={accountData} />} /> } />
							</Route>
						</Route>
					</Route>

					<Route path="accounts">
						<Route path="signup" element={ <BlockYesSignin accountData={accountData} ifAllow={<SignUpForm />} /> } />
						<Route path="signin" element={ <BlockYesSignin accountData={accountData} ifAllow={<SignInForm />} /> } />
						<Route path="find/password" element={ <BlockYesSignin accountData={accountData} ifAllow={<ForgotPasswordForm />} /> } />
						<Route path="reset/password" element={ <BlockYesSignin accountData={accountData} ifAllow={<ResetPasswordForm />} /> } />
						
						<Route path="mypage">
							<Route path="" element={ <BlockNoSignin accountData={accountData} ifAllow={<MyPage />} /> } />
							<Route path="activate/lostark" element={ <BlockNoSignin accountData={accountData} ifAllow={<ActivateLostarkScrap />} /> } />
							<Route path="change/password" element={ <BlockNoSignin accountData={accountData} ifAllow={<PasswordChangeForm />} /> } />
						</Route>
					</Route>

					{/* <Route path="/character/:characterName" element={ <CharacterInfo /> } /> */}

					{/* 상단에 위치하는 라우트들의 규칙을 모두 확인, 일치하는 라우트가 없는경우 처리 */}
					<Route path="*" element={ <Error404 /> } />
				</Routes>
			</>
		);
	}
}

export default RoutesWrapper;