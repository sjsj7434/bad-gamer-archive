import { Link } from 'react-router-dom';
import '../css/App.css';

type SettingsMenuType = {
	ren: React.ReactNode;
}

const Body: React.FC<SettingsMenuType> = ({ ren }) => {
	return(
		<div className="App">
			<header className="App-header">
				<h2>Body</h2>

				{ren}

				<Link to="/">Main</Link>
				<Link to="/CaseRegistration">CaseRegistration</Link>
				<Link to="/sample">sample</Link>
			</header>
		</div>
	);
}

export default Body;