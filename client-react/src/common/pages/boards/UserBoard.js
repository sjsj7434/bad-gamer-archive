import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, NavLink } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import CustomPagination from './CustomPagination';
import * as userBoardsFetch from '../../js/userBoardsFetch';

const UserBoard = () => {
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
			const contentListData = await userBoardsFetch.readContentList(page);

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
						<div key={"noContent"}>
							<span style={{color: "gray", fontSize: "0.85rem"}}>작성된 게시글이 없습니다</span>
						</div>
					);
				}
				else{
					renderList.push(contentList.map((data) => {
						return(
							<Link
								key={"content" + data.code}
								to={`/lostark/board/anonymous/view/${data.code}`}
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
												{
													data.hasImage === true ?
													<div>
														<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="darkseagreen" className="bi bi-image" viewBox="0 0 17 17">
															<path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
															<path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
														</svg>
													</div>
													:
													<div>
														<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="gray" className="bi bi-blockquote-left" viewBox="0 0 15 15">
															<path d="M2.5 3a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1h-11zm5 3a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1h-6zm0 3a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1h-6zm-5 3a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1h-11zm.79-5.373c.112-.078.26-.17.444-.275L3.524 6c-.122.074-.272.17-.452.287-.18.117-.35.26-.51.428a2.425 2.425 0 0 0-.398.562c-.11.207-.164.438-.164.692 0 .36.072.65.217.873.144.219.385.328.72.328.215 0 .383-.07.504-.211a.697.697 0 0 0 .188-.463c0-.23-.07-.404-.211-.521-.137-.121-.326-.182-.568-.182h-.282c.024-.203.065-.37.123-.498a1.38 1.38 0 0 1 .252-.37 1.94 1.94 0 0 1 .346-.298zm2.167 0c.113-.078.262-.17.445-.275L5.692 6c-.122.074-.272.17-.452.287-.18.117-.35.26-.51.428a2.425 2.425 0 0 0-.398.562c-.11.207-.164.438-.164.692 0 .36.072.65.217.873.144.219.385.328.72.328.215 0 .383-.07.504-.211a.697.697 0 0 0 .188-.463c0-.23-.07-.404-.211-.521-.137-.121-.326-.182-.568-.182h-.282a1.75 1.75 0 0 1 .118-.492c.058-.13.144-.254.257-.375a1.94 1.94 0 0 1 .346-.3z"/>
														</svg>
													</div>
												}
												&nbsp;
												<div style={{overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}>
													<span style={{fontSize: "0.8rem"}}>
														{data.title}
													</span>
												</div>
											</div>
											<div style={{fontSize: "0.75rem", color: "#5a5a5a", maxWidth: "95%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
												<span>{data.writer === "" ? "익명" : data.writer} ({data.ip})</span>
												&nbsp;|&nbsp;
												<span>{new Date(data.createdAt).toLocaleDateString("sv-SE").replace(/-/g, ".")}</span>
												&nbsp;
												<span>{new Date(data.createdAt).toLocaleTimeString("sv-SE", {hour: "numeric", minute: "2-digit"})}</span>
												&nbsp;|&nbsp;
												<span>조회 {data.view}</span>
												&nbsp;|&nbsp;
												<span style={{color: "green"}}>↑{data.upvote}</span> | ↓<span style={{color: "red"}}>{data.downvote}</span>
											</div>
										</div>
										<div style={{textAlign: "end"}}>
											{
												data.replies.length > 999 ?
												<span style={{fontSize: "0.85rem", color: "palevioletred"}}>
													999+
												</span>
												:
												<span style={{fontSize: "0.85rem", color: "darkseagreen"}}>
													{data.replies.length}
												</span>
											}
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
			navigate(`/lostark/board/anonymous/${pageIndex}`);
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
					유저 게시판
				</h5>
				<hr/>
			</div>

			<div key="contentListData">
				<div style={{margin: "10px"}}>
					{renderData}
				</div>

				<div style={{display: "flex", justifyContent: "flex-end"}}>
					<NavLink to={`/lostark/board/anonymous/write`} style={{width: "30%", maxWidth: "200px"}}>
						<Button id={"createReply"} variant="outline-primary" style={{width: "100%", padding: "1px"}}>
							<span style={{fontSize: "0.8rem"}}>글쓰기</span>
						</Button>
					</NavLink>
				</div>
			</div>

			{paginationData}
		</Container>
	);
}

export default UserBoard;