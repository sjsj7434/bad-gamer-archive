import { useState, useEffect } from 'react';
import EmptyResult from '../EmptyResult.js';

const ProfileDetail = (props) => {
	// "searchResult"라는 새 상태 변수를 선언합니다
	const [searchResult, setSearchResult] = useState(<></>);

	useEffect(() => {
		const call = async () => {
			const profileData = props.profileData;

			if(profileData === null){
				setSearchResult(
					<EmptyResult/>
				);
			}
			else{
				setSearchResult(
					<>
						<table style={{marginTop: "10px"}}>
							<colgroup>
								<col width={"80px"}></col>
								<col width={"80px"}></col>
								<col width={"80px"}></col>
							</colgroup>
							<tbody>
								<tr>
									<td colSpan={2}>
										<div style={{display: "flex", backgroundColor: "#303030", width: "fit-content", borderRadius: "8px", padding: "2px 5px 2px 5px"}}>
											<span style={{color: "#ffffcc", fontSize: "12px"}}>
												특성합 (치특신)
											</span>
										</div>
									</td>
									<td style={{color: "#ffffff"}}>
										{parseInt(profileData.Stats[0].Value, 10) + parseInt(profileData.Stats[1].Value, 10) + parseInt(profileData.Stats[2].Value, 10)}
									</td>
								</tr>
								<tr><td colSpan={3}><br/></td></tr>
								<tr>
									<td>
										<div style={{display: "flex", backgroundColor: "#303030", width: "fit-content", borderRadius: "8px", padding: "2px 5px 2px 5px"}}>
											<span style={{color: "#ffffcc", fontSize: "12px"}}>
												{profileData.Stats[0].Type}
											</span>
										</div>
									</td>
									<td>
										<div style={{display: "flex", backgroundColor: "#303030", width: "fit-content", borderRadius: "8px", padding: "2px 5px 2px 5px"}}>
											<span style={{color: "#ffffcc", fontSize: "12px"}}>
												{profileData.Stats[1].Type}
											</span>
										</div>
									</td>
									<td>
										<div style={{display: "flex", backgroundColor: "#303030", width: "fit-content", borderRadius: "8px", padding: "2px 5px 2px 5px"}}>
											<span style={{color: "#ffffcc", fontSize: "12px"}}>
												{profileData.Stats[3].Type}
											</span>
										</div>
									</td>
								</tr>
								<tr style={{color: "#ffffff"}}>
									<td>
										{profileData.Stats[0].Value}
									</td>
									<td>
										{profileData.Stats[1].Value}
									</td>
									<td>
										{profileData.Stats[3].Value}
									</td>
								</tr>
								<tr>
									<td>
										<div style={{display: "flex", backgroundColor: "#303030", width: "fit-content", borderRadius: "8px", padding: "2px 5px 2px 5px"}}>
											<span style={{color: "#ffffcc", fontSize: "12px"}}>
												{profileData.Stats[2].Type}
											</span>
										</div>
									</td>
									<td>
										<div style={{display: "flex", backgroundColor: "#303030", width: "fit-content", borderRadius: "8px", padding: "2px 5px 2px 5px"}}>
											<span style={{color: "#ffffcc", fontSize: "12px"}}>
												{profileData.Stats[4].Type}
											</span>
										</div>
									</td>
									<td>
										<div style={{display: "flex", backgroundColor: "#303030", width: "fit-content", borderRadius: "8px", padding: "2px 5px 2px 5px"}}>
											<span style={{color: "#ffffcc", fontSize: "12px"}}>
												{profileData.Stats[5].Type}
											</span>
										</div>
									</td>
								</tr>
								<tr style={{color: "#ffffff"}}>
									<td>
										{profileData.Stats[2].Value}
									</td>
									<td>
										{profileData.Stats[4].Value}
									</td>
									<td>
										{profileData.Stats[5].Value}
									</td>
								</tr>
							</tbody>
						</table>
						
						<table style={{marginTop: "10px"}}>
							<colgroup>
								<col width={"60px"}></col>
								<col width={"60px"}></col>
								<col width={"60px"}></col>
								<col width={"60px"}></col>
							</colgroup>
							<tbody>
								<tr>
									<td>
										<div style={{display: "flex", backgroundColor: "#303030", width: "fit-content", borderRadius: "8px", padding: "2px 5px 2px 5px"}}>
											<span style={{color: "#ffffcc", fontSize: "12px"}}>
												{profileData.Tendencies[0].Type}
											</span>
										</div>
									</td>
									<td>
										<div style={{display: "flex", backgroundColor: "#303030", width: "fit-content", borderRadius: "8px", padding: "2px 5px 2px 5px"}}>
											<span style={{color: "#ffffcc", fontSize: "12px"}}>
												{profileData.Tendencies[1].Type}
											</span>
										</div>
									</td>
									<td>
										<div style={{display: "flex", backgroundColor: "#303030", width: "fit-content", borderRadius: "8px", padding: "2px 5px 2px 5px"}}>
											<span style={{color: "#ffffcc", fontSize: "12px"}}>
												{profileData.Tendencies[2].Type}
											</span>
										</div>
									</td>
									<td>
										<div style={{display: "flex", backgroundColor: "#303030", width: "fit-content", borderRadius: "8px", padding: "2px 5px 2px 5px"}}>
											<span style={{color: "#ffffcc", fontSize: "12px"}}>
												{profileData.Tendencies[3].Type}
											</span>
										</div>
									</td>
								</tr>
								<tr style={{color: "#ffffff"}}>
									<td>
										{profileData.Tendencies[0].Point}
									</td>
									<td>
										{profileData.Tendencies[1].Point}
									</td>
									<td>
										{profileData.Tendencies[2].Point}
									</td>
									<td>
										{profileData.Tendencies[3].Point}
									</td>
								</tr>
							</tbody>
						</table>
					</>
				);
			}
		}
		
		call();
	}, [props]); //처음 페이지 로딩 될때만

	return (
		<div>
			{searchResult}
		</div>
	);
}

export default ProfileDetail;