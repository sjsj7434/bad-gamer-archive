import { Routes, Route } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

const LostarkMain = () => {
	return(
		<Container style={{maxWidth: "1440px"}}>
			<h2>Here is LA</h2>
			<Routes>
				<Route path="" element={<><div>main</div></>}></Route>
				<Route path="test1" element={<><div>1</div></>}></Route>
				<Route path="test2" element={<><div>2</div></>}></Route>
				<Route path="*" element={<><div>nothing</div></>}></Route>
			</Routes>
		</Container>
	);
}

export default LostarkMain;