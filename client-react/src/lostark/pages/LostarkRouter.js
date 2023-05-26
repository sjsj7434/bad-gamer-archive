import { Routes, Route, Navigate } from 'react-router-dom';
import Error404 from '../../common/pages/errors/Error404';
import LostarkMain from '../../lostark/pages/LostarkMain';
import BoardList from '../../common/pages/BoardList'
import BoardView from '../../common/pages/BoardView';
import BoardWrite from '../../common/pages/BoardWrite';

import 'bootstrap/dist/css/bootstrap.min.css';


// index.js에서 StrictMode 존재하면 두번 랜더링, 개발 모드에서만 적용됩니다. 생명주기 메서드들은 프로덕션 모드에서 이중으로 호출되지 않습니다.
	// get Login info here and give props to child
	// @ 상위 -> 하위시, props로 데이터 전달
	// @ 하위 -> 상위시, props로 실행할 함수를 하위로 전달하고 하위에서 실행. 이때 무한루프에 빠지지 않도록 주의한다.
const LostarkRouter = () => {
	return (
		<>
				<Routes>
					{/* Contents */}
					<Route path="/" element={<LostarkMain />}></Route>
					
					<Route path="board">
						<Route path=":category" element={<Navigate to={"1"} />}></Route>
						<Route path=":category/:page" element={<BoardList />}></Route>
						<Route path=":category/view/:contentCode" element={<BoardView />}></Route>
						<Route path=":category/write" element={<BoardWrite />}></Route>
					</Route>
					{/* <Route path="board/list/:category/:page" element={<><BoardList></BoardList></>}></Route>
					<Route path="board/view/:contentCode" element={<><BoardView></BoardView></>}></Route> */}

					{/* 상단에 위치하는 라우트들의 규칙을 모두 확인, 일치하는 라우트가 없는경우 처리 */}
					<Route path="*" element={<><Error404 /></>}></Route>
				</Routes>
		</>
	);
}

export default LostarkRouter;