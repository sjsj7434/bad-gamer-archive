import { Link } from 'react-router-dom';
import logo from '../images/logo192.png';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

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
							<Nav.Link as={Link} to="/pricing">404</Nav.Link>
						</Nav>

						<Form className="d-flex">
							<Nav.Link as={Link} to="/accounts/signup">
								<Button variant="info">Sign Up</Button>
							</Nav.Link>
							&nbsp;
							<Nav.Link as={Link} to="/accounts/signin">
								<Button variant="info">Sign In</Button>
							</Nav.Link>
						</Form>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</>
	);
}

export default TopMenu;