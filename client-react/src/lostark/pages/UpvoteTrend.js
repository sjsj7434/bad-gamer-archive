import Container from 'react-bootstrap/Container';
import { Link } from "react-router-dom";
import * as contentBoardFetch from '../../common/js/contentBoardFetch';
import { useEffect, useState } from 'react';

const UpvoteTrend = (props) => {
	const [renderData, setRenderData] = useState(<></>);
	
	const [contentList, setContentList] = useState(null);
	const [contentCount, setContentCount] = useState(null);
	
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
						<Link
							key={"content" + element.code}
							to={`/lostark/board/${element.category}/view/${element.code}`}
							style={{
								textDecoration: "none",
							}}
						>
							<p key={element.code}>{element.title}</p>
						</Link>
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
			{renderData}
		</Container>
	);
}

export default UpvoteTrend;