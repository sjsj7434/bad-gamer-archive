import { Link } from 'react-router-dom';
import '../css/App.css';

const TopMenu = () => {
	return(
		<div className="App">
			<h2>This is TopMenu</h2>

			<Link to="/">Main</Link>
			<Link to="/CaseRegistration">CaseRegistration</Link>
			<Link to="/sample">sample</Link>
		</div>
	);
}

export default TopMenu;