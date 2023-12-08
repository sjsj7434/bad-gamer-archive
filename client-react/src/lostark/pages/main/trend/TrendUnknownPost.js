import { useNavigate } from "react-router-dom";
import * as postFetch from '../../../../common/js/postFetch';
import { useEffect, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import UnknownPostRow from "../../../../common/pages/post/unknown/UnknownPostRow";

const TrendUnknownPost = () => {
	const [upvoteRender, setUpvoteRender] = useState(<></>);
	const [upvoteList, setUpvoteList] = useState(null);

	const [downvoteRender, setDownvoteRender] = useState(<></>);
	const [downvoteList, setDownvoteList] = useState(null);

	const [viewRender, setViewRender] = useState(<></>);
	const [viewList, setViewList] = useState(null);

	const navigate = useNavigate();
	
	useEffect(() => {
		const readContentList = async () => {
			const upvoteData = await postFetch.getTrendPostList("unknown", "upvote", "", "", 1);
			const downvoteData = await postFetch.getTrendPostList("unknown", "downvote", "", "", 1);
			const viewData = await postFetch.getTrendPostList("unknown", "view", "", "", 1);

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
					<div key={"noContent"} style={{ height: 300 }}>
						<span style={{color: "gray", fontSize: "0.85rem"}}>작성된 게시글이 없습니다</span>
					</div>
				);
			}
			else{
				ren.push(
					upvoteList.map((postData) => {
						return (
							<UnknownPostRow key={"post" + postData.code} postData={postData} />
						);
					})
				)
			}

			setUpvoteRender(ren);
		}
	}, [upvoteList, navigate])
	
	useEffect(() => {
		if(downvoteList !== null){
			const ren = [];

			if(downvoteList.length === 0){
				ren.push(
					<div key={"noContent"} style={{ height: 300 }}>
						<span style={{color: "gray", fontSize: "0.85rem"}}>작성된 게시글이 없습니다</span>
					</div>
				);
			}
			else{
				ren.push(
					downvoteList.map((postData) => {
						return (
							<UnknownPostRow key={"post" + postData.code} postData={postData} />
						);
					})
				)
			}

			setDownvoteRender(ren);
		}
	}, [downvoteList, navigate])
	
	useEffect(() => {
		if(viewList !== null){
			const ren = [];

			if(viewList.length === 0){
				ren.push(
					<div key={"noContent"} style={{ height: 300 }}>
						<span style={{color: "gray", fontSize: "0.85rem"}}>작성된 게시글이 없습니다</span>
					</div>
				);
			}
			else{
				ren.push(
					viewList.map((postData) => {
						return (
							<UnknownPostRow key={"post" + postData.code} postData={postData} />
						);
					})
				)
			}

			setViewRender(ren);
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
					{upvoteRender}
				</Tab>
				<Tab eventKey="downvote" title="비추천" mountOnEnter={true} unmountOnExit={false}>
					{downvoteRender}
				</Tab>
				<Tab eventKey="view" title="조회" mountOnEnter={true} unmountOnExit={false}>
					{viewRender}
				</Tab>
			</Tabs>
		</>
	);
}

export default TrendUnknownPost;