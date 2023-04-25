import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Error404 from './errors/Error404';

import LostarkMain from '../../lostark/pages/LostarkMain';
import CaseRegistration from './CaseRegistration';
import CharacterInfo from '../../lostark/pages/character/CharacterInfo';
import SignUpForm from './accounts/SignUpForm';
import SignInForm from './accounts/SignInForm';
import CommonTopMenu from './CommonTopMenu';
import Wrapper from './Wrapper';
import MyPage from './accounts/MyPage';

import 'bootstrap/dist/css/bootstrap.min.css';

import { Navigate } from "react-router-dom";

// index.js에서 StrictMode 존재하면 두번 랜더링, 개발 모드에서만 적용됩니다. 생명주기 메서드들은 프로덕션 모드에서 이중으로 호출되지 않습니다.
const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Navigate to="/lostark" replace={true} />}></Route>
				<Route path="lostark" element={<><CommonTopMenu /><LostarkMain /></>}>
				</Route>

				<Route path="accounts">
					<Route path="signup" element={<><CommonTopMenu /><SignUpForm /></>}>
					</Route>

					<Route path="signin" element={<><CommonTopMenu /><SignInForm /></>}>
					</Route>

					<Route path="mypage" element={<><CommonTopMenu /><MyPage /></>}>
					</Route>
				</Route>

				{/* <Route path="/accounts/signup" element={<Wrapper innerNode={<></>}><CommonTopMenu /><SignUpForm /></Wrapper>}></Route> */}
				{/* <Route path="/accounts/signin" element={<Wrapper innerNode={<></>}><CommonTopMenu /><SignInForm /></Wrapper>}></Route> */}
				{/* <Route path="/accounts/mypage" element={<Wrapper innerNode={<></>}><CommonTopMenu /><MyPage /></Wrapper>}></Route> */}

				<Route path="/registration" element={<Wrapper innerNode={<></>}><CommonTopMenu /><CaseRegistration /></Wrapper>}></Route>
				<Route path="/character/:characterName" element={<Wrapper><CommonTopMenu /><CharacterInfo /></Wrapper>}></Route>

				{/* 상단에 위치하는 라우트들의 규칙을 모두 확인, 일치하는 라우트가 없는경우 처리 */}
				<Route path="*" element={<Wrapper innerNode={<></>}><CommonTopMenu /><Error404 /></Wrapper>}></Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;