import Container from 'react-bootstrap/Container';
import { Link, useNavigate } from "react-router-dom";
import * as contentBoardFetch from '../../common/js/contentBoardFetch';
import { useEffect, useState } from 'react';

const UpvoteTrend = (props) => {
	const [renderData, setRenderData] = useState(<></>);
	
	const [contentList, setContentList] = useState(null);
	const [contentCount, setContentCount] = useState(null);

	const navigate = useNavigate();
	
	useEffect(() => {
		const readContentList = async () => {
			const contentListData = await contentBoardFetch.readContentList("all/upvote", 1);

			setContentList(contentListData[0]);
			setContentCount(contentListData[1]);
		}

		readContentList();
	}, [])
	
	useEffect(() => {
		if(contentList !== null){
			const ren = [];
			ren.push(
				contentList.map((element) => {
					return (
						<tr key={element.code} onClick={ () => { navigate(`/lostark/board/${element.category}/view/${element.code}`) }}>
							<td style={{border: "1px solid gray", padding: "10px"}}>
								{element.category}
							</td>
							<td style={{border: "1px solid gray", padding: "10px"}}>
								{element.title}
							</td>
							<td style={{border: "1px solid gray", padding: "10px"}}>
								{element.upvote}
							</td>
							<td style={{border: "1px solid gray", padding: "10px"}}>
								{element.view}
							</td>
						</tr>
					);
				})
			)

			setRenderData(ren);
		}
	}, [contentList, contentCount])

	return(
		<Container style={{maxWidth: "1440px"}}>
			category : {props.category}
			<br/>
			upvote가 1개 이상
			<br/>

			<table>
				<thead>
					<tr>
						<th style={{border: "1px solid gray", padding: "10px"}}>구분</th>
						<th style={{border: "1px solid gray", padding: "10px"}}>제목</th>
						<th style={{border: "1px solid gray", padding: "10px"}}>up</th>
						<th style={{border: "1px solid gray", padding: "10px"}}>view</th>
					</tr>
				</thead>
				{renderData}
			</table>
		</Container>
	);
}

export default UpvoteTrend;