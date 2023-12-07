import { useNavigate } from "react-router-dom";
import * as postFetch from '../../../../common/js/postFetch';
import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const DownvoteTrend = (props) => {
	const [monthlyRender, setMonthlyRender] = useState(<></>);
	const [weeklyRender, setWeeklyRender] = useState(<></>);
	const [dailyRender, setDailyRender] = useState(<></>);
	
	const [monthlyList, setMonthlyList] = useState(null);
	const [weeklyList, setWeeklyList] = useState(null);
	const [dailyList, setDailyList] = useState(null);

	const navigate = useNavigate();
	
	useEffect(() => {
		const readContentList = async () => {
			const monthlyData = await postFetch.getKnownPostList("downvote/trend/monthly", 1);
			const weeklyData = await postFetch.getKnownPostList("downvote/trend/weekly", 1);
			const dailyData = await postFetch.getKnownPostList("downvote/trend/daily", 1);

			setMonthlyList(monthlyData[0]);
			setWeeklyList(weeklyData[0]);
			setDailyList(dailyData[0]);
		}

		readContentList();
	}, [])
	
	useEffect(() => {
		if(monthlyList !== null){
			const ren = [];

			if(monthlyList.length === 0){
				ren.push(
					<tr key="monthlyEmpty">
						<td colSpan={4} style={{padding: "20px", textAlign: "center"}}>
							월간 지는 게시글이 존재하지 않습니다
						</td>
					</tr>
				);
			}
			else{
				ren.push(
					monthlyList.map((element) => {
						return (
							<tr key={element.code} onClick={ () => { navigate(`/lostark/board/${element.category}/view/${element.code}`) }} style={{cursor: "pointer"}}>
								<td style={{padding: "10px"}}>
									{element.category}
								</td>
								<td style={{padding: "10px"}}>
									{element.title}
								</td>
								<td style={{padding: "10px"}}>
									{element.upvote}
								</td>
								<td style={{padding: "10px"}}>
									{element.view}
								</td>
							</tr>
						);
					})
				)
			}

			setMonthlyRender(ren);
		}
	}, [monthlyList, navigate])
	
	useEffect(() => {
		if(weeklyList !== null){
			const ren = [];

			if(weeklyList.length === 0){
				ren.push(
					<tr key="weeklyEmpty">
						<td colSpan={4} style={{padding: "20px", textAlign: "center"}}>
							주간 지는 게시글이 존재하지 않습니다
						</td>
					</tr>
				);
			}
			else{
				ren.push(
					weeklyList.map((element) => {
						return (
							<tr key={element.code} onClick={ () => { navigate(`/lostark/board/${element.category}/view/${element.code}`) }} style={{cursor: "pointer"}}>
								<td style={{padding: "10px"}}>
									{element.category}
								</td>
								<td style={{padding: "10px"}}>
									{element.title}
								</td>
								<td style={{padding: "10px"}}>
									{element.upvote}
								</td>
								<td style={{padding: "10px"}}>
									{element.view}
								</td>
							</tr>
						);
					})
				)
			}

			setWeeklyRender(ren);
		}
	}, [weeklyList, navigate])
	
	useEffect(() => {
		if(dailyList !== null){
			const ren = [];

			if(dailyList.length === 0){
				ren.push(
					<tr key="dailyEmpty">
						<td colSpan={4} style={{padding: "20px", textAlign: "center"}}>
							일간 지는 게시글이 존재하지 않습니다
						</td>
					</tr>
				);
			}
			else{
				ren.push(
					dailyList.map((element) => {
						return (
							<tr key={element.code} onClick={ () => { navigate(`/lostark/board/${element.category}/view/${element.code}`) }} style={{cursor: "pointer"}}>
								<td style={{padding: "10px"}}>
									{element.category}
								</td>
								<td style={{padding: "10px"}}>
									{element.title}
								</td>
								<td style={{padding: "10px"}}>
									{element.upvote}
								</td>
								<td style={{padding: "10px"}}>
									{element.view}
								</td>
							</tr>
						);
					})
				)
			}

			setDailyRender(ren);
		}
	}, [dailyList, navigate])

	return(
		<>
			<Tabs
				onSelect={(key) => {console.log(key)}}
				defaultActiveKey="hot"
				id="uncontrolled-tab-example"
				className="mb-2"
			>
				<Tab eventKey="hot" title="월간" mountOnEnter={true} unmountOnExit={false}>
					<Table bordered hover style={{fontSize: "0.85rem"}}>
						<colgroup>
							<col width="15%"></col>
							<col width="*"></col>
							<col width="15%"></col>
							<col width="15%"></col>
						</colgroup>
						<thead>
							<tr style={{ textAlign: "center", backgroundColor: "#b9b9b9", color: "white" }}>
								<th>구분</th>
								<th>제목</th>
								<th>up</th>
								<th>view</th>
							</tr>
						</thead>
						<tbody>
							{monthlyRender}
						</tbody>
					</Table>
				</Tab>
				<Tab eventKey="none" title="주간" mountOnEnter={true} unmountOnExit={false}>
					<Table bordered hover style={{fontSize: "0.85rem"}}>
						<colgroup>
							<col width="15%"></col>
							<col width="*"></col>
							<col width="15%"></col>
							<col width="15%"></col>
						</colgroup>
						<thead>
							<tr style={{ textAlign: "center", backgroundColor: "#b9b9b9", color: "white" }}>
								<th>구분</th>
								<th>제목</th>
								<th>up</th>
								<th>view</th>
							</tr>
						</thead>
						<tbody>
							{weeklyRender}
						</tbody>
					</Table>
				</Tab>
				<Tab eventKey="class" title="일간" mountOnEnter={true} unmountOnExit={false}>
					<Table bordered hover style={{fontSize: "0.85rem"}}>
						<colgroup>
							<col width="15%"></col>
							<col width="*"></col>
							<col width="15%"></col>
							<col width="15%"></col>
						</colgroup>
						<thead>
							<tr style={{ textAlign: "center", backgroundColor: "#b9b9b9", color: "white" }}>
								<th>구분</th>
								<th>제목</th>
								<th>up</th>
								<th>view</th>
							</tr>
						</thead>
						<tbody>
							{dailyRender}
						</tbody>
					</Table>
				</Tab>
			</Tabs>
		</>
	);
}

export default DownvoteTrend;