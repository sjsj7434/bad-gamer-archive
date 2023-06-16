import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { useNavigate } from "react-router-dom";
import Table from 'react-bootstrap/Table';
import Stack from 'react-bootstrap/Stack';

import * as accountsFetch from '../../../common/js/accountsFetch.js'

const MyPage = () => {
	const [accountData, setAccountData] = useState(null);
	const [renderData, setRenderData] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const callMyInfo = async () => {
			setAccountData(await accountsFetch.getMyInfo());
		}

		callMyInfo();
	}, [])

	useEffect(() => {
		if(accountData !== null){
			setRenderData(
				<Container style={{maxWidth: "600px"}}>
					<div style={{paddingLeft: "10px", paddingRight: "10px", fontSize: "0.8rem"}}>
						<h3>here is your personal page</h3>

						<Table hover>
							<colgroup>
								<col width="25%" style={{fontSize: "20px"}} />
								<col width="5%" />
								<col width="*" />
							</colgroup>
							<tbody>
								<tr>
									<th>아이디</th>
									<td><div className="vr"></div></td>
									<td>{accountData.id}</td>
								</tr>
								<tr>
									<th>닉네임</th>
									<td><div className="vr"></div></td>
									<td>{accountData.nickname}</td>
								</tr>
								<tr>
									<th>이메일</th>
									<td><div className="vr"></div></td>
									<td>{accountData.email}</td>
								</tr>
								<tr>
									<th>LA</th>
									<td><div className="vr"></div></td>
									<td>
										{accountData.lostarkMainCharacter === null ? "정보 없음" : accountData.lostarkMainCharacter}
										&nbsp;&nbsp;
										<Button onClick={() => { navigate("lostark") }} variant="outline-danger" style={{width: "30%", maxWidth: "130px", padding: "2px"}}>LA Get</Button>
										<br/>
										* 좀 더 다양한 정보를 저장하기 위해 테이블을 따로 구성해야 할 듯
									</td>
								</tr>
							</tbody>
						</Table>

						<Stack direction="horizontal" gap={3}>
							<Button onClick={() => {navigate("lostark")}}>닉네임 변경</Button>
							<Button onClick={() => {navigate("lostark")}}>비밀번호 변경</Button>
						</Stack>
					</div>
				</Container>
			);
		}
	}, [accountData, navigate])

	return renderData;
}

export default MyPage;