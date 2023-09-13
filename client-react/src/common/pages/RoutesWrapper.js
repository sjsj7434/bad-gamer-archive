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
import SetActiveMenu from './SetActiveMenu';
// import CharacterInfo from '../../lostark/pages/character/CharacterInfo';

// index.js에서 StrictMode 존재하면 두번 랜더링, 개발 모드에서만 적용됩니다. 생명주기 메서드들은 프로덕션 모드에서 이중으로 호출되지 않습니다.
const RoutesWrapper = () => {
	const [accountData, setAccountData] = useState(null);
	const [currentMenu, setCurrentMenu] = useState(null);
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
				<CommonTopMenu accountData={accountData} currentMenu={currentMenu} checkSignInStatus={checkSignInStatus} />

				<Routes>
					{/* Contents */}
					<Route path="" element={ <Navigate to="/lostark/main" replace={true} /> } />

					<Route path="lostark">
						<Route path="" element={
							<Navigate to="main" replace={true} />
						} />
						<Route path="main" element={
							<>
								<SetActiveMenu setCurrentMenu={setCurrentMenu} menuCode={"/lostark/main"} />
								<LostarkMain />
							</>
						} />

						<Route path="useful" element={
							<>
								<SetActiveMenu setCurrentMenu={setCurrentMenu} menuCode={"/lostark/useful"} />
								<UsefulSitesLostark />
							</>
						} />

						<Route path="board">
							<Route path="anonymous">
								<Route path="" element={
									<Navigate to="1" replace={true} />
								} />

								<Route path=":page" element={
									<>
										<SetActiveMenu setCurrentMenu={setCurrentMenu} menuCode={"/lostark/board/anonymous"} />
										<ContentBoard boardType="anonymous" boardTitle="익명" />
									</>
								} />

								<Route path="view/:contentCode" element={
									<>
										<SetActiveMenu setCurrentMenu={setCurrentMenu} menuCode={"/lostark/board/anonymous"} />
										<ContentView boardType="anonymous" boardTitle="익명" accountData={accountData} />
									</>
								} />

								<Route path="write" element={
									<>
										<SetActiveMenu setCurrentMenu={setCurrentMenu} menuCode={"/lostark/board/anonymous"} />
										<ContentWriteAnonymous boardType="anonymous" />
									</>
								} />

								<Route path="edit/:contentCode" element={
									<>
										<SetActiveMenu setCurrentMenu={setCurrentMenu} menuCode={"/lostark/board/anonymous"} />
										<ContentWriteAnonymous boardType="anonymous" />
									</>
								} />
							</Route>

							<Route path="user">
								<Route path="" element={
									<Navigate to="1" replace={true} />
								} />

								<Route path=":page" element={
									<>
										<SetActiveMenu setCurrentMenu={setCurrentMenu} menuCode={"/lostark/board/user"} />
										<ContentBoard boardType="user" boardTitle="유저" />
									</>
								} />

								<Route path="view/:contentCode" element={
									<>
										<SetActiveMenu setCurrentMenu={setCurrentMenu} menuCode={"/lostark/board/user"} />
										<ContentView boardType="user" boardTitle="유저" accountData={accountData} />
									</>
								} />

								<Route path="write" element={
									<BlockNoSignin
										accountData={accountData}
										ifAllow={
											<>
												<SetActiveMenu setCurrentMenu={setCurrentMenu} menuCode={"/lostark/board/user"} />
												<ContentWriteUser boardType="user" accountData={accountData} />
											</>
										}
									/>
								} />

								<Route path="edit/:contentCode" element={
									<BlockNoSignin
										accountData={accountData}
										ifAllow={
											<>
												<SetActiveMenu setCurrentMenu={setCurrentMenu} menuCode={"/lostark/board/user"} />
												<ContentWriteUser boardType="user" accountData={accountData} />
											</>
										}
									/>
								} />
							</Route>
						</Route>
					</Route>

					<Route path="accounts">
						<Route path="signup" element={
							<BlockYesSignin
								accountData={accountData}
								ifAllow={
									<>
										<SetActiveMenu setCurrentMenu={setCurrentMenu} menuCode={""} />
										<SignUpForm />
									</>
								}
							/>
						} />
						<Route path="signin" element={
							<BlockYesSignin
								accountData={accountData}
								ifAllow={
									<>
										<SetActiveMenu setCurrentMenu={setCurrentMenu} menuCode={""} />
										<SignInForm />
									</>
								}
							/>
						} />

						<Route path="find/password" element={
							<BlockYesSignin
								accountData={accountData}
								ifAllow={
									<>
										<SetActiveMenu setCurrentMenu={setCurrentMenu} menuCode={""} />
										<ForgotPasswordForm />
									</>
								}
							/>
						} />

						<Route path="reset/password" element={
							<BlockYesSignin
								accountData={accountData}
								ifAllow={
									<>
										<SetActiveMenu setCurrentMenu={setCurrentMenu} menuCode={""} />
										<ResetPasswordForm />
									</>
								}
							/>
						} />
						
						<Route path="mypage">
							<Route path="" element={
								<BlockNoSignin
									accountData={accountData}
									ifAllow={
										<>
											<SetActiveMenu setCurrentMenu={setCurrentMenu} menuCode={""} />
											<MyPage />
										</>
									}
								/>
							} />
							
							<Route path="activate/lostark" element={
								<BlockNoSignin
									accountData={accountData}
									ifAllow={
										<>
											<SetActiveMenu setCurrentMenu={setCurrentMenu} menuCode={""} />
											<ActivateLostarkScrap />
										</>
									}
								/>
							} />
							
							<Route path="change/password" element={
								<BlockNoSignin
									accountData={accountData}
									ifAllow={
										<>
											<SetActiveMenu setCurrentMenu={setCurrentMenu} menuCode={""} />
											<PasswordChangeForm />
										</>
									}
								/>
							} />
						</Route>
					</Route>

					{/* <Route path="/character/:characterName" element={ <CharacterInfo /> } /> */}

					{/* 상단에 위치하는 라우트들의 규칙을 모두 확인, 일치하는 라우트가 없는경우 처리 */}
					<Route path="*" element={
						<>
							<SetActiveMenu setCurrentMenu={setCurrentMenu} menuCode={""} />
							<Error404 />
						</>
					} />
				</Routes>
			</>
		);
	}
}

export default RoutesWrapper;