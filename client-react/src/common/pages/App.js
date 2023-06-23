import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import RoutesWrapper from './RoutesWrapper';

const App = () => {
	return (
		<>
			<BrowserRouter>
				<RoutesWrapper />
			</BrowserRouter>
		</>
	);
}

export default App;