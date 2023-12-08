import { useNavigate } from "react-router-dom";
import * as postFetch from '../../../../common/js/postFetch';
import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const TrendPost = () => {
	const [upvoteRender, setUpvoteRender] = useState(<></>);
	const [upvoteList, setUpvoteList] = useState(null);

	const [downvoteRender, setDownvoteRender] = useState(<></>);
	const [downvoteList, setDownvoteList] = useState(null);

	const [viewRender, setViewRender] = useState(<></>);
	const [viewList, setViewList] = useState(null);

	const navigate = useNavigate();
	
	useEffect(() => {
		const readContentList = async () => {
			const upvoteData = await postFetch.getTrendPostList("upvote", "", "", 1);
			const downvoteData = await postFetch.getTrendPostList("downvote", "", "", 1);
			const viewData = await postFetch.getTrendPostList("view", "", "", 1);

			setUpvoteList(upvoteData[0]);
			setDownvoteList(downvoteData[0]);
			setViewList(viewData[0]);
		}

		readContentList();
	}, [])
	
	useEffect(() => {
		if(upvoteList !== null){
			const ren = [];

			if(upvoteList.length === 0){
				ren.push(
					<tr key="monthlyEmpty">
						<td colSpan={4} style={{padding: "20px", textAlign: "center"}}>
							추천 게시글이 존재하지 않습니다
						</td>
					</tr>
				);
			}
			else{
				ren.push(
					upvoteList.map((element) => {
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

			setDownvoteRender(ren);
		}
	}, [upvoteList, navigate])
	
	useEffect(() => {
		if(downvoteList !== null){
			const ren = [];

			if(downvoteList.length === 0){
				ren.push(
					<tr key="monthlyEmpty">
						<td colSpan={4} style={{padding: "20px", textAlign: "center"}}>
							추천 게시글이 존재하지 않습니다
						</td>
					</tr>
				);
			}
			else{
				ren.push(
					downvoteList.map((element) => {
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

			setViewRender(ren);
		}
	}, [downvoteList, navigate])
	
	useEffect(() => {
		if(viewList !== null){
			const ren = [];

			if(viewList.length === 0){
				ren.push(
					<tr key="monthlyEmpty">
						<td colSpan={4} style={{padding: "20px", textAlign: "center"}}>
							추천 게시글이 존재하지 않습니다
						</td>
					</tr>
				);
			}
			else{
				ren.push(
					viewList.map((element) => {
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

			setUpvoteRender(ren);
		}
	}, [viewList, navigate])

	return(
		<>
			<Tabs
				onSelect={(key) => {console.log(key)}}
				defaultActiveKey="upvote"
				id="uncontrolled-tab-example"
				className="mb-2"
			>
				<Tab eventKey="upvote" title="추천" mountOnEnter={true} unmountOnExit={false}>
					<Table bordered hover style={{fontSize: "0.85rem"}}>
						<colgroup>
							<col width="20%"></col>
							<col width="*"></col>
							<col width="20%"></col>
							<col width="20%"></col>
						</colgroup>
						<thead>
							<tr style={{ textAlign: "center", backgroundColor: "#b9b9b9", color: "white" }}>
								<th>구분</th>
								<th>제목</th>
								<th>추천</th>
								<th>조회</th>
							</tr>
						</thead>
						<tbody>
							{upvoteRender}
						</tbody>
					</Table>
				</Tab>
				<Tab eventKey="downvote" title="비추천" mountOnEnter={true} unmountOnExit={false}>
					<Table bordered hover style={{fontSize: "0.85rem"}}>
						<colgroup>
							<col width="20%"></col>
							<col width="*"></col>
							<col width="20%"></col>
							<col width="20%"></col>
						</colgroup>
						<thead>
							<tr style={{ textAlign: "center", backgroundColor: "#b9b9b9", color: "white" }}>
								<th>구분</th>
								<th>제목</th>
								<th>추천</th>
								<th>조회</th>
							</tr>
						</thead>
						<tbody>
							{downvoteRender}
						</tbody>
					</Table>
				</Tab>
				<Tab eventKey="view" title="조회" mountOnEnter={true} unmountOnExit={false}>
					<Table bordered hover style={{fontSize: "0.85rem"}}>
						<colgroup>
							<col width="20%"></col>
							<col width="*"></col>
							<col width="20%"></col>
							<col width="20%"></col>
						</colgroup>
						<thead>
							<tr style={{ textAlign: "center", backgroundColor: "#b9b9b9", color: "white" }}>
								<th>구분</th>
								<th>제목</th>
								<th>추천</th>
								<th>조회</th>
							</tr>
						</thead>
						<tbody>
							{viewRender}
						</tbody>
					</Table>
				</Tab>
			</Tabs>
		</>
	);
}

export default TrendPost;