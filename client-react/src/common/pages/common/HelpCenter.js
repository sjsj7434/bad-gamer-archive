
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';

const HelpCenter = () => {
	return (
		<Container style={{maxWidth: "600px", fontSize: "0.8rem"}}>
			<h4>고객센터</h4>
			<Table striped bordered hover>
				<colgroup>
					<col width="5%" />
					<col width="35%" />
					<col width="" />
				</colgroup>
				<thead>
					<tr style={{textAlign: "center"}}>
						<th>#</th>
						<th>이름</th>
						<th>용도</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>1</td>
					</tr>
				</tbody>
			</Table>
		</Container>
	);
}

export default HelpCenter;