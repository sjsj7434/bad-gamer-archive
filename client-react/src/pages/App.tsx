import '../css/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './Main';
import Error404 from './errors/Error404';
import CaseRegistration from './CaseRegistration';
import TopMenu from './TopMenu';
import Body from './Body';

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={
					<Body ren={<><TopMenu /><Main /></>}></Body>
				}></Route>
				<Route path="/Main" element={
					<Body ren={<><TopMenu /><Main /></>}></Body>
				}></Route>

				<Route path="/CaseRegistration" element={<CaseRegistration></CaseRegistration>}></Route>

				{/* 상단에 위치하는 라우트들의 규칙을 모두 확인, 일치하는 라우트가 없는경우 처리 */}
				<Route path="*" element={<Error404></Error404>}></Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;