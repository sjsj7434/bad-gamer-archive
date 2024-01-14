import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Common.css';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

const Footer = () => {
	const navigate = useNavigate();

	return (
		<footer>
			<div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", height: "300px", marginTop: "15px", marginBottom: "15px", padding: "5px" }}>
				<div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
					<Button onClick={() => { navigate("/intro"); }} variant="link" style={{ fontSize: "0.75rem", textDecoration: "none", color: "gray" }}>소개</Button>
					<span style={{ fontSize: "0.65rem", color: "gray" }}>|</span>
					<Button onClick={() => { navigate("/help"); }} variant="link" style={{ fontSize: "0.75rem", textDecoration: "none", color: "gray" }}>고객센터</Button>
					{/* <span style={{ fontSize: "0.65rem", color: "gray" }}>|</span>
					<Button onClick={() => { navigate("/privacy"); }} variant="link" style={{ fontSize: "0.75rem", textDecoration: "none", color: "gray" }}>개인정보처리방침</Button> */}
				</div>
			</div>
		</footer>
	);
}

export default Footer;