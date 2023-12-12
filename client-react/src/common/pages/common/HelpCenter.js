
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

const HelpCenter = () => {
	const navigate = useNavigate();

	const submitHelp = () => {
		alert("죄송합니다. 아직 고객센터는 구현이 완료되지 않았습니다");
		navigate("/");
		// if(window.confirm("문의 사항을 제출하시겠습니까?") === true){
		// 	// alert("문의 사항이 접수되었습니다");
		// 	navigate("/");
		// }
	}

	return (
		<Container style={{maxWidth: "600px", fontSize: "0.8rem"}}>
			<h3>고객센터</h3>
			<br></br>
			
			<Form>
				<Form.Group className="mb-3">
					<Form.Label htmlFor="helpType">문의 구분</Form.Label>
					<Form.Select id="helpType" defaultValue="general" style={{ fontSize: "0.85rem" }}>
						<option value="general">일반</option>
						<option value="error">오류</option>
						<option value="uncomfortable">불편사항</option>
					</Form.Select>
				</Form.Group>

				<Form.Group className="mb-3">
					<Form.Label>문의 제목</Form.Label>
					<Form.Control type="text" id="helpTitle" autoComplete="off" placeholder="제목을 적어주세요" style={{ fontSize: "0.8rem" }} />
				</Form.Group>

				<Form.Group className="mb-3">
					<Form.Label>문의 내용</Form.Label>
					<Form.Control as="textarea" id="helpContent" rows={5} style={{ fontSize: "0.8rem" }} />
				</Form.Group>

				<div className="d-grid gap-2">
					<Button variant="success" size="lg" style={{ fontSize: "0.85rem" }} onClick={() => {submitHelp()}}>
						제출하기
					</Button>
					{/* <br></br>
					<Button variant="success" size="lg" style={{ fontSize: "0.85rem" }} onClick={() => { if(window.confirm("작성 중인 내용은 저장되지 않습니다\n내 문의 내역을 확인하시겠습니까?") === true){navigate("/account/mypage")} }}>
						내 문의 내역 확인하기
					</Button> */}
				</div>
			</Form>
		</Container>
	);
}

export default HelpCenter;