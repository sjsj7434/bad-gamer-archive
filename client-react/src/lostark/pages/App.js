import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Error404 from './errors/Error404';
import Main from './Main';
import CaseRegistration from './CaseRegistration';
import TopMenu from './TopMenu';
import Wrapper from './Wrapper';
import CharacterInfo from './character/CharacterInfo';
import SignUpForm from './accounts/SignUpForm';
import SignInForm from './accounts/SignInForm';

import 'bootstrap/dist/css/bootstrap.min.css';

// index.js에서 StrictMode 존재하면 두번 랜더링, 개발 모드에서만 적용됩니다. 생명주기 메서드들은 프로덕션 모드에서 이중으로 호출되지 않습니다.
const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={
					<Wrapper innerNode={<><TopMenu /><Main /></>} />
				}></Route>
				<Route path="/main" element={
					<Wrapper innerNode={<><TopMenu /><Main /></>} />
				}></Route>

				<Route path="/character/:characterName" element={
					<Wrapper innerNode={<><TopMenu /><CharacterInfo /></>} />
				}></Route>

				<Route path="/accounts/signup" element={
					<Wrapper innerNode={<><TopMenu /><SignUpForm /></>} />
				}></Route>

				<Route path="/accounts/signin" element={
					<Wrapper innerNode={<><TopMenu /><SignInForm /></>} />
				}></Route>

				<Route path="/registration" element={
					<Wrapper innerNode={<><TopMenu /><CaseRegistration /></>} />
				}></Route>

				{/* 상단에 위치하는 라우트들의 규칙을 모두 확인, 일치하는 라우트가 없는경우 처리 */}
				<Route path="*" element={
					<Wrapper innerNode={<><TopMenu /><Error404 /></>} />
				}></Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;