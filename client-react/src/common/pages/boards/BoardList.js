import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import CustomPagination from './CustomPagination';

const BoardList = () => {
	const [contentCategory, setContentCategory] = useState(null);
	const [page, setPage] = useState(null);
	const [renderData, setRenderData] = useState(<></>);
	const navigate = useNavigate();
	const params = useParams();

	/**
	 * 자주 사용하는 fetch 템플릿
	 * @param {string} destination fetch url, 목적지
	 * @returns {object} 가져온 정보 JSON
	 */
	const parseStringToJson = async (jsonString) => {
		if(jsonString === null){
			return null;
		}
		else if(jsonString.status === 500){
			alert("Error!\nCan not get data");
			return null;
		}
		else{
			const jsonResult = await jsonString.json();

			if(jsonResult.statusCode === 500){
				return null;
			}
			else if(jsonResult.data === null){
				return null;
			}
			else{
				return jsonResult.data;
			}
		}
	}

	const pageMoveFunc = (pageIndex) => {
		console.log(`page move to : /lostark/board/${contentCategory}/${pageIndex}`);
		navigate(`/lostark/board/${contentCategory}/${pageIndex}`);
	}
	
	useEffect(() => {
		if(isNaN(params.page) === false){
			setContentCategory(params.category);
			setPage(params.page);
		}
		else{
			setContentCategory(null);
			setPage(null);
		}
	}, [params.category, params.page])

	useEffect(() => {
		/**
		 * 게시판의 게시글 목록을 가져온다
		 */
		const readContentList = async () => {
			if(contentCategory !== null && page !== null){
				const fecthOption = {
					method: "GET"
					, headers: {"Content-Type": "application/json",}
					, credentials: "include", // Don't forget to specify this if you need cookies
				};
				const jsonString = await fetch(`${process.env.REACT_APP_SERVER}/boards/list/${contentCategory}/${page}`, fecthOption);
				const jsonData = await parseStringToJson(jsonString);

				const contentJson = jsonData[0];
				const contentCount = jsonData[1];
				const contentListData = [];

				console.log(contentJson)

				if(contentJson !== null){
					if(contentJson.length === 0){
						contentListData.push(
							<div key={"noContent"}>
								<span style={{color: "gray", fontSize: "0.85rem"}}>작성된 게시글이 없습니다</span>
							</div>
						);
					}
					else{
						contentListData.push(contentJson.map((data) => {
							return(
								<Link
									key={"content" + data.code}
									to={`/lostark/board/${contentCategory}/view/${data.code}`}
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
												<div style={{fontSize: "0.95rem", fontWeight: "600", maxWidth: "95%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
													{
														data.hasImage === true ?
														<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="darkseagreen" className="bi bi-image" viewBox="0 0 16 16">
															<path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
															<path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
														</svg>
														:
														<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="lightgray" className="bi bi-chat-left-dots-fill" viewBox="0 0 16 16">
															<path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793V2zm5 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
														</svg>
													}
													&nbsp;
													{data.title}
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
													parseInt(Math.random() * 1693, 10) > 999 ?
													<span style={{fontSize: "0.85rem", color: "palevioletred"}}>
														999+
													</span>
													:
													<span style={{fontSize: "0.85rem", color: "darkseagreen"}}>
														{parseInt(Math.random() * 1000, 10)}
													</span>
												}
											</div>
										</div>
									</div>
								</Link>
							);
						}));
					}
				}

				if(contentListData.length > 0){
					setRenderData(
						<>
							<div style={{margin: "10px"}}>
								<h5>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bar-chart-steps" viewBox="0 0 16 16">
									<path d="M.5 0a.5.5 0 0 1 .5.5v15a.5.5 0 0 1-1 0V.5A.5.5 0 0 1 .5 0zM2 1.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-1zm2 4a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1zm2 4a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-6a.5.5 0 0 1-.5-.5v-1zm2 4a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1z"/>
									</svg>
									&nbsp;
									{contentCategory} 게시판
								</h5>
								<hr/>
							</div>

							<div key="contentListData">
								<div style={{minHeight: "570px", margin: "10px"}}>
									{contentListData}
								</div>

								<div style={{display: "flex", flexDirection: "row-reverse"}}>
									<Link to={`/lostark/board/${contentCategory}/write`}>
										Write
									</Link>
									{/* <span onClick={() => {navigate(`/lostark/board/${contentCategory}/write`)}}>Write</span> */}
								</div>
							</div>

							<div style={{display: "flex", justifyContent: "center"}} key="paginationData">
								<CustomPagination currentPage={page} contentPerPage={10} contentCount={contentCount} moveURL={`/lostark/board/${contentCategory}`} howManyPages={4} pageMoveFunc={pageMoveFunc}/>
							</div>
						</>
					);
				}
			}
		}

		if(contentCategory !== null && page !== null){
			readContentList();
		}
	}, [contentCategory, page])
	
	return(
		<Container style={{maxWidth: "1440px"}}>
			{renderData}
		</Container>
	);
}

export default BoardList;