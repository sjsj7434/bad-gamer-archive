import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import CustomPagination from '../CustomPagination';
import * as postFetch from '../../../js/postFetch';

const AnnounceContentList = () => {
	const [page, setPage] = useState(null);
	const [renderData, setRenderData] = useState(<></>);
	
	const [contentList, setContentList] = useState(null);
	const [contentCount, setContentCount] = useState(null);
	const [paginationData, setPaginationData] = useState(<></>);
	const navigate = useNavigate();
	const params = useParams();
	const contentPerPage = 20;
	const howManyPages = 5;

	useEffect(() => {
		if(isNaN(params.page) === false){
			setPage(params.page);
		}
		else{
			setPage(null);
		}
	}, [params.page])

	useEffect(() => {
		const readContentList = async () => {
			const contentListData = await postFetch.getPostList("announcement", "", "", page);

			setContentList(contentListData[0]);
			setContentCount(contentListData[1]);
		}

		if(page !== null){
			readContentList();
		}
	}, [page])

	useEffect(() => {
		if(contentList !== null && contentCount !== null){
			const renderList = [];

			if(contentList !== null){
				if(contentList.length === 0){
					renderList.push(
						<div key={"noContent"} style={{ height: 300 }}>
							<span style={{color: "gray", fontSize: "0.85rem"}}>작성된 공지사항이 없습니다</span>
						</div>
					);
				}
				else{
					renderList.push(contentList.map((data) => {
						return(
							<Link
								key={"content" + data.code}
								to={`/post/announce/view/${data.code}`}
								style={{
									textDecoration: "none",
								}}
							>
								<div
									id={"contentRow" + data.code}
									style={{
										cursor: "pointer",
										color: "black",
										textDecoration: "none",
										borderBottom: "1px solid gray",
										paddingTop: "5px",
										paddingBottom: "5px",
									}}
									onMouseOver={() => {document.querySelector("#contentRow" + data.code).style.backgroundColor = "#e9f7ff"}}
									onMouseOut={() => {document.querySelector("#contentRow" + data.code).style.backgroundColor = ""}}
								>
									<div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
										<div style={{width: "90%"}}>
											<div style={{display: "flex", alignItems: "center", fontSize: "0.95rem", fontWeight: "600", maxWidth: "95%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
												<div style={{overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}>
													<span style={{fontSize: "0.8rem"}}>
														{data.title}
													</span>
												</div>
											</div>
											<div style={{fontSize: "0.75rem", color: "#5a5a5a", maxWidth: "95%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
												<span>{new Date(data.createdAt).toLocaleDateString("sv-SE").replace(/-/g, ".")}</span>
												&nbsp;
												<span>{new Date(data.createdAt).toLocaleTimeString("sv-SE", {hour: "numeric", minute: "2-digit"})}</span>
												&nbsp;|&nbsp;
												<span>조회 {data.view}</span>
												&nbsp;|&nbsp;
												<span style={{color: "green"}}>↑{data.upvote}</span> | ↓<span style={{color: "red"}}>{data.downvote}</span>
											</div>
										</div>
									</div>
								</div>
							</Link>
						);
					}));
				}

				setRenderData(renderList);
			}
		}
	}, [contentCount, contentList])

	useEffect(() => {
		const pageMoveFunc = (pageIndex) => {
			document.querySelector("h5").scrollIntoView({ behavior: "smooth", block: "center" });
			navigate(`/post/announce/${pageIndex}`);
		}

		setPaginationData(
			<div style={{display: "flex", justifyContent: "center"}} key="paginationData">
				<CustomPagination currentPage={page} contentPerPage={contentPerPage} contentCount={contentCount} howManyPages={howManyPages} pageMoveFunc={pageMoveFunc}/>
			</div>
		);
	}, [page, contentCount, navigate])
	
	return(
		<Container style={{maxWidth: "1200px"}}>
			<div style={{margin: "10px"}}>
				<h5>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bar-chart-steps" viewBox="0 0 16 16">
						<path d="M.5 0a.5.5 0 0 1 .5.5v15a.5.5 0 0 1-1 0V.5A.5.5 0 0 1 .5 0zM2 1.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-1zm2 4a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1zm2 4a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-6a.5.5 0 0 1-.5-.5v-1zm2 4a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1z"/>
					</svg>
					&nbsp;
					공지사항
				</h5>
				<hr/>
			</div>

			<div key="contentListData">
				<div style={{margin: "10px"}}>
					{renderData}
				</div>
			</div>

			{paginationData}
		</Container>
	);
}

export default AnnounceContentList;