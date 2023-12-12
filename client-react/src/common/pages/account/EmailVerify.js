import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Stack from 'react-bootstrap/Stack';

import * as accountsFetch from '../../js/accountsFetch.js'

const EmailVerify = (props) => {
	return (
		<Container style={{maxWidth: "600px"}}>
			<div style={{paddingLeft: "10px", paddingRight: "10px", fontSize: "0.8rem"}}>
				<Table hover>
					<colgroup>
						<col width="25%" style={{fontSize: "20px"}} />
						<col width="5%" />
						<col width="*" />
					</colgroup>
					<tbody>
						<tr>
							<th>이메일</th>
							<td><div className="vr"></div></td>
							<td>{accountData.email}</td>
						</tr>
						<tr>
							<th>닉네임</th>
							<td><div className="vr"></div></td>
							<td>{accountData.nickname}</td>
						</tr>
						<tr>
							<th>LA</th>
							<td><div className="vr"></div></td>
							<td>
								{accountData.lostarkMainCharacter === null ? "정보 없음" : accountData.lostarkMainCharacter}
								&nbsp;&nbsp;
								<Button onClick={() => { navigate("activate/lostark") }} variant="outline-danger" style={{width: "30%", maxWidth: "130px", padding: "2px", fontSize: "0.8rem"}}>LA Get</Button>
								<br/>
								* 더 다양한 정보를 저장하기 위해 테이블을 따로 구성해야 할 듯
							</td>
						</tr>
					</tbody>
				</Table>

				<Stack direction="horizontal" gap={3}>
					<Button variant={"outline-primary"} onClick={() => {navigate("change/password")}} style={{width: "30%", maxWidth: "130px", padding: "2px", fontSize: "0.8rem"}}>비밀번호 변경</Button>
					<Button variant={"outline-primary"} onClick={() => {navigate("lostark")}} style={{width: "30%", maxWidth: "130px", padding: "2px", fontSize: "0.8rem"}}>닉네임 변경</Button>
					<Button variant={"outline-warning"} onClick={() => {navigate("lostark")}} style={{width: "30%", maxWidth: "130px", padding: "2px", fontSize: "0.8rem"}}>회원탈퇴</Button>
				</Stack>
			</div>
		</Container>
	);
}

export default EmailVerify;