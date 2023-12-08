import { useNavigate } from "react-router-dom";
import * as postFetch from '../../../../common/js/postFetch';
import { useEffect, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import KnownPostRow from "../../../../common/pages/post/known/KnownPostRow";

const TrendKnownPost = () => {
	const [upvoteRender, setUpvoteRender] = useState(<></>);
	const [upvoteList, setUpvoteList] = useState(null);

	const [downvoteRender, setDownvoteRender] = useState(<></>);
	const [downvoteList, setDownvoteList] = useState(null);

	const [viewRender, setViewRender] = useState(<></>);
	const [viewList, setViewList] = useState(null);

	const navigate = useNavigate();
	
	useEffect(() => {
		const readContentList = async () => {
			const upvoteData = await postFetch.getTrendPostList("known", "upvote", "", "", 1);
			const downvoteData = await postFetch.getTrendPostList("known", "downvote", "", "", 1);
			const viewData = await postFetch.getTrendPostList("known", "view", "", "", 1);

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
							<KnownPostRow key={"post" + postData.code} postData={postData} />
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
							<KnownPostRow key={"post" + postData.code} postData={postData} />
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
							<KnownPostRow key={"post" + postData.code} postData={postData} />
						);
					})
				)
			}

			setViewRender(ren);
		}
	}, [viewList, navigate])

	return(
		<>
			<div style={{ display: "flex", alignItems: "center" }}>
				<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" fill="gold" className="bi bi-award-fill" viewBox="0 0 22 22">
					<path d="m8 0 1.669.864 1.858.282.842 1.68 1.337 1.32L13.4 6l.306 1.854-1.337 1.32-.842 1.68-1.858.282L8 12l-1.669-.864-1.858-.282-.842-1.68-1.337-1.32L2.6 6l-.306-1.854 1.337-1.32.842-1.68L6.331.864z"/>
					<path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1z"/>
				</svg>
				<h6 style={{ fontStyle: "italic", fontWeight: 800 }}>자유 게시판 Trend</h6>
			</div>
			<Tabs
				// onSelect={(key) => {console.log(key)}}
				defaultActiveKey="upvote"
				id="uncontrolled-tab-example"
				className="mb-2"
				style={{ fontSize: "0.8rem" }}
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

export default TrendKnownPost;