import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import MainCards from './MainCards';

const MainTabs = () => {
  return (
	<Tab.Container id="left-tabs-example" defaultActiveKey="first">
		<Row>
			<Col sm={3}>
				<Nav variant="pills" className="flex-column">
					<Nav.Item>
						<Nav.Link eventKey="first">Tab 1</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link eventKey="second">Tab 2</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link eventKey="third">Tab 3</Nav.Link>
					</Nav.Item>
				</Nav>
			</Col>
			<Col sm={9}>
				<Tab.Content>
					<Tab.Pane eventKey="first">
						<MainCards cardTitle={"First"} cardText={"First quick quickquickquick on the card title and make up the bulk of the card's content."} />
					</Tab.Pane>
					<Tab.Pane eventKey="second">
						<MainCards cardTitle={"Second"} cardText={"Second quick texttexttexttext to build on the card title and make up the bulk of the card's content."} />
					</Tab.Pane>
					<Tab.Pane eventKey="third">
						<MainCards cardTitle={"Third"} cardText={"Third quick texttexttexttext to build on the card title and make up the bulk of the card's content."} />
					</Tab.Pane>
				</Tab.Content>
			</Col>
		</Row>
	</Tab.Container>
  );
}

export default MainTabs;