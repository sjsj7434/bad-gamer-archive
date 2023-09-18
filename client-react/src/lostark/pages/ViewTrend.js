import Container from 'react-bootstrap/Container';
import { useNavigate } from "react-router-dom";

const ViewTrend = (props) => {
	const navigate = useNavigate();

	return(
		<Container style={{maxWidth: "1440px"}}>
			category : {props.category}
			<br/>
			view가 100개 이상
		</Container>
	);
}

export default ViewTrend;