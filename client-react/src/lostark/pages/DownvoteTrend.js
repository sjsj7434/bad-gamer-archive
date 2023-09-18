import Container from 'react-bootstrap/Container';
import { useNavigate } from "react-router-dom";

const DownvoteTrend = (props) => {
	const navigate = useNavigate();

	return(
		<Container style={{maxWidth: "1440px"}}>
			category : {props.category}
			<br/>
			downvote가 10개 이상
		</Container>
	);
}

export default DownvoteTrend;