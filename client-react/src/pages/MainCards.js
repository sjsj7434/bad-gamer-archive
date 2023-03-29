import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import TEST_IMAGE from '../images/logo192.png'

const MainCards = (props) => {
	return (
		<Card style={{ width: '15rem' }}>
			<Card.Img variant="top" src={TEST_IMAGE} />
			<Card.Body>
				<Card.Title>{props.cardTitle}</Card.Title>
				<Card.Text>
					{props.cardText}
				</Card.Text>
				<Button variant="primary">Go somewhere</Button>
			</Card.Body>
		</Card>
	);
}

export default MainCards;