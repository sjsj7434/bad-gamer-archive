import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Navigate } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Common.css';

import Error404 from './errors/Error404';
import RegisterForm from './accounts/RegisterForm';
import LoginForm from './accounts/LoginForm';
import CommonTopMenu from './CommonTopMenu';
import MyPage from './accounts/MyPage';
import * as accountsFetch from '../js/accountsFetch.js'
import LostarkMain from '../../lostark/pages/LostarkMain';
import AnonymousContentWrite from './board/anonymous/AnonymousContentWrite';
import UsefulSitesLostark from './common/UsefulSitesLostark';
import ForgotPasswordForm from './accounts/ForgotPasswordForm';
import BlockLoginUser from './accounts/BlockLoginUser';
import BlockLogoutUser from './accounts/BlockLogoutUser';
import UserContentWrite from './board/user/UserContentWrite';
import SetActiveMenu from './SetActiveMenu';
import RenewNicknameForm from './accounts/RenewNicknameForm';
import ActivateLostarkAPI from './accounts/ActivateLostarkAPI';
import HelpCenter from './common/HelpCenter';
import ResetPasswordForm from './accounts/ResetPasswordForm';
import RenewPasswordForm from './accounts/RenewPasswordForm';
import AnonymousContentList from './board/anonymous/AnonymousContentList';
import UserContentList from './board/user/UserContentList';
import AnonymousContentView from './board/anonymous/AnonymousContentView';
import UserContentView from './board/user/UserContentView';
import AnnounceContentList from './board/announce/AnnounceContentList.js';
import AnnounceContentView from './board/announce/AnnounceContentView.js';
// import CharacterInfo from '../../lostark/pages/character/CharacterInfo';

// index.js에서 StrictMode 존재하면 두번 랜더링, 개발 모드에서만 적용됩니다. 생명주기 메서드들은 프로덕션 모드에서 이중으로 호출되지 않습니다.
const RoutesWrapper = () => {
	const [accountData, setAccountData] = useState(null);
	const [currentMenu, setCurrentMenu] = useState(null);
	let location = useLocation();
	
	const checkLoginStatus = async () => {
		const statusJSON = await accountsFetch.checkLoginStatus();
		setAccountData(statusJSON);
	}

	useEffect(() => {
		checkLoginStatus();
	}, [location.pathname]); //URL이 바뀔 때 마다 로그인 정보 갱신

	if(accountData !== null){
		return (
			<>
				<CommonTopMenu accountData={accountData} currentMenu={currentMenu} checkLoginStatus={checkLoginStatus} />

				<Routes>
					{/* Contents */}
					<Route path="" element={ <Navigate to="/lostark/main" replace={true} /> } />

					<Route path="lostark">
						<Route path="" element={
							<Navigate to="main" replace={true} />
						} />
						<Route path="main" element={
							<>
								<SetActiveMenu pageTitle="Agora(LA)" setCurrentMenu={setCurrentMenu} menuCode={"/lostark/main"} />
								<LostarkMain />
							</>
						} />

						<Route path="useful" element={
							<>
								<SetActiveMenu pageTitle="Agora(LA)" setCurrentMenu={setCurrentMenu} menuCode={"/lostark/useful"} />
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
										<SetActiveMenu pageTitle="Agora(LA)" setCurrentMenu={setCurrentMenu} menuCode={"/lostark/board/anonymous"} />
										<AnonymousContentList />
									</>
								} />

								<Route path="view/:contentCode" element={
									<>
										<SetActiveMenu pageTitle="Agora(LA)" setCurrentMenu={setCurrentMenu} menuCode={"/lostark/board/anonymous"} />
										<AnonymousContentView />
									</>
								} />

								<Route path="write" element={
									<>
										<SetActiveMenu pageTitle="Agora(LA)" setCurrentMenu={setCurrentMenu} menuCode={"/lostark/board/anonymous"} />
										<AnonymousContentWrite />
									</>
								} />

								<Route path="edit/:contentCode" element={
									<>
										<SetActiveMenu pageTitle="Agora(LA)" setCurrentMenu={setCurrentMenu} menuCode={"/lostark/board/anonymous"} />
										<AnonymousContentWrite />
									</>
								} />
							</Route>

							<Route path="user">
								<Route path="" element={
									<Navigate to="1" replace={true} />
								} />

								<Route path=":page" element={
									<>
										<SetActiveMenu pageTitle="Agora(LA)" setCurrentMenu={setCurrentMenu} menuCode={"/lostark/board/user"} />
										<UserContentList />
									</>
								} />

								<Route path="view/:contentCode" element={
									<>
										<SetActiveMenu pageTitle="Agora(LA)" setCurrentMenu={setCurrentMenu} menuCode={"/lostark/board/user"} />
										<UserContentView accountData={accountData} />
									</>
								} />

								<Route path="write" element={
									<BlockLogoutUser
										accountData={accountData}
										ifAllow={
											<>
												<SetActiveMenu pageTitle="Agora(LA)" setCurrentMenu={setCurrentMenu} menuCode={"/lostark/board/user"} />
												<UserContentWrite boardType="user" accountData={accountData} />
											</>
										}
									/>
								} />

								<Route path="edit/:contentCode" element={
									<BlockLogoutUser
										accountData={accountData}
										ifAllow={
											<>
												<SetActiveMenu pageTitle="Agora(LA)" setCurrentMenu={setCurrentMenu} menuCode={"/lostark/board/user"} />
												<UserContentWrite boardType="user" accountData={accountData} />
											</>
										}
									/>
								} />
							</Route>
						</Route>
					</Route>

					<Route path="accounts">
						<Route path="register" element={
							<BlockLoginUser
								accountData={accountData}
								ifAllow={
									<>
										<SetActiveMenu pageTitle="" setCurrentMenu={setCurrentMenu} menuCode={"/accounts/register"} />
										<RegisterForm />
									</>
								}
							/>
						} />
						<Route path="login" element={
							<BlockLoginUser
								accountData={accountData}
								ifAllow={
									<>
										<SetActiveMenu pageTitle="" setCurrentMenu={setCurrentMenu} menuCode={"/accounts/login"} />
										<LoginForm />
									</>
								}
							/>
						} />

						<Route path="find/password" element={
							<BlockLoginUser
								accountData={accountData}
								ifAllow={
									<>
										<SetActiveMenu pageTitle="" setCurrentMenu={setCurrentMenu} menuCode={"/accounts/find/password"} />
										<ForgotPasswordForm />
									</>
								}
							/>
						} />

						<Route path="reset/password/:verificationCode" element={
							<BlockLoginUser
								accountData={accountData}
								ifAllow={
									<>
										<ResetPasswordForm />
									</>
								}
							/>
						} />
						
						<Route path="mypage">
							<Route path="" element={
								<BlockLogoutUser
									accountData={accountData}
									ifAllow={
										<>
											<SetActiveMenu pageTitle="Agora(My)" setCurrentMenu={setCurrentMenu} menuCode={"/accounts/mypage"} />
											<MyPage />
										</>
									}
								/>
							} />
							
							<Route path="activate/lostark" element={
								<BlockLogoutUser
									accountData={accountData}
									ifAllow={
										<>
											<SetActiveMenu pageTitle="Agora(LA 인증)" setCurrentMenu={setCurrentMenu} menuCode={"/accounts/activate/lostark"} />
											{/* <ActivateLostarkScrap /> */}
											<ActivateLostarkAPI />
										</>
									}
								/>
							} />
							
							<Route path="renew/password" element={
								<BlockLogoutUser
									accountData={accountData}
									ifAllow={
										<>
											<SetActiveMenu pageTitle="Agora(LA)" setCurrentMenu={setCurrentMenu} menuCode={"/accounts/renew/password"} />
											<RenewPasswordForm checkLoginStatus={checkLoginStatus} />
										</>
									}
								/>
							} />
							
							<Route path="renew/nickname" element={
								<BlockLogoutUser
									accountData={accountData}
									ifAllow={
										<>
											<SetActiveMenu pageTitle="Agora(LA)" setCurrentMenu={setCurrentMenu} menuCode={"/accounts/renew/nickname"} />
											<RenewNicknameForm />
										</>
									}
								/>
							} />
						</Route>
					</Route>

					{/* <Route path="/character/:characterName" element={ <CharacterInfo /> } /> */}

					<Route path="board/announcement">
						<Route path="" element={
							<Navigate to="1" replace={true} />
						} />

						<Route path=":page" element={
							<>
								<SetActiveMenu pageTitle="Agora(LA)" setCurrentMenu={setCurrentMenu} menuCode={"/board/announcement"} />
								<AnnounceContentList />
							</>
						} />

						<Route path="view/:contentCode" element={
							<>
								<SetActiveMenu pageTitle="Agora(LA)" setCurrentMenu={setCurrentMenu} menuCode={"/board/announcement"} />
								<AnnounceContentView accountData={accountData} />
							</>
						} />
					</Route>
					
					<Route path="help" element={
						<BlockLogoutUser
							accountData={accountData}
							ifAllow={
								<>
									<SetActiveMenu pageTitle="Agora(LA)" setCurrentMenu={setCurrentMenu} menuCode={"/help"} />
									<HelpCenter />
								</>
							}
						/>
					} />

					{/* 상단에 위치하는 라우트들의 규칙을 모두 확인, 일치하는 라우트가 없는경우 처리 */}
					<Route path="*" element={
						<>
							<SetActiveMenu pageTitle="Agora(LA)" setCurrentMenu={setCurrentMenu} menuCode={""} />
							<Error404 />
						</>
					} />
				</Routes>
			</>
		);
	}
}

export default RoutesWrapper;