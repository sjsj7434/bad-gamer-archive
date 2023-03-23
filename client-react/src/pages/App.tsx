import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Error404 from './pc/errors/Error404';
import Main from './pc/Main';
import CaseRegistration from './pc/CaseRegistration';
import TopMenu from './pc/TopMenu';
import Wrapper from './pc/Wrapper';

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={
					<Wrapper ren={<><TopMenu /><Main /></>}/>
				}></Route>
				<Route path="/Main" element={
					<Wrapper ren={<><TopMenu /><Main /></>}/>
				}></Route>

				<Route path="/CaseRegistration" element={
					<Wrapper ren={<><TopMenu /><CaseRegistration /></>}/>
				}></Route>

				{/* 상단에 위치하는 라우트들의 규칙을 모두 확인, 일치하는 라우트가 없는경우 처리 */}
				<Route path="*" element={
					<Wrapper ren={<><TopMenu /><Error404 /></>}/>
				}></Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;