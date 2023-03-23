import { Link } from 'react-router-dom';
import '../../css/TopMenu.css';
import logo from '../../images/logo192.png';

const TopMenu = () => {
	return(
		<>
			<div className="topMenu">
				<div className="menuLogo"><img src={logo} alt="logo" width={36} height={36} /></div>
				<div className="menu">
					<div className="menuDeco"></div>
					<Link to="/">
						Main
					</Link>
				</div>
				<div className="menu">
					<div className="menuDeco"></div>
					<Link to="/CaseRegistration">
						CaseRegistration
					</Link>
				</div>
				<div className="menu">
					<div className="menuDeco"></div>
					<Link to="/sample">
						Sample
					</Link>
				</div>
			</div>
		</>
	);
}

export default TopMenu;