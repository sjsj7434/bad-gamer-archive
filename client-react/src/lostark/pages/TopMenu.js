import { Link } from 'react-router-dom';
import logo from '../images/logo192.png';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const TopMenu = () => {
	return(
		<>
			<Navbar bg="primary" variant="primary" expand="lg">
				<Container fluid>
					<Navbar.Brand as={Link} to="/">
						<img
							alt=""
							src={logo}
							width="30"
							height="30"
							className="d-inline-block align-top"
						/>{' '}
						TOP-MENU
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="navbarScroll" />
					<Navbar.Collapse id="navbarScroll">
						<Nav
							className="me-auto my-2 my-lg-0"
							style={{ maxHeight: '100px' }}
							navbarScroll
						>
							<Nav.Link as={Link} to="/">Main</Nav.Link>
							<Nav.Link as={Link} to="/registration">CaseRegistration</Nav.Link>
							<Nav.Link as={Link} to="/pricing">Pricing</Nav.Link>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</>
	);
}

export default TopMenu;