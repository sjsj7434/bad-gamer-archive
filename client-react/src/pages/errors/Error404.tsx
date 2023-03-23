import { Link } from 'react-router-dom';
import '../../css/App.css';

const Error_404 = () => {
	return(
		<header className="App-header">
			<h1>ERROR 404</h1>
			<p>Page Not Found</p>

			<Link to="/">To Main</Link>
		</header>
	);
}

export default Error_404;