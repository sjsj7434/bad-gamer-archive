import { useState, useEffect } from 'react';
import { useParams, Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import CustomPagination from './CustomPagination';

const BoardList = () => {
	const [contentCategory, setContentCategory] = useState(null);
	const [page, setPage] = useState(null);
	const [renderData, setRenderData] = useState(<></>);
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
								<h2>No data</h2>
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
										onMouseOver={() => {document.querySelector("#contentRow" + data.code).style.backgroundColor = "lightgray"}}
										onMouseOut={() => {document.querySelector("#contentRow" + data.code).style.backgroundColor = ""}}
									>
										<div style={{display: "flex", alignItems: "center"}}>
											<div style={{width: "90%"}}>
												<div style={{fontSize: "0.95rem", fontWeight: "600", maxWidth: "95%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{data.title}</div>
												<div style={{fontSize: "0.75rem", color: "#5a5a5a", maxWidth: "95%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
													<span>{data.writer === "" ? "익명" : data.writer} ({data.ip})</span>
													&nbsp;|&nbsp;
													<span>{new Date(data.createdAt).toLocaleDateString("sv-SE").replace(/-/g, ".")}</span>
													&nbsp;
													<span>{new Date(data.createdAt).toLocaleTimeString("sv-SE", {hour: "numeric", minute: "2-digit"})}</span>
													&nbsp;|&nbsp;
													<span>조회 {parseInt(Math.random() * 100000, 10)}</span>
													&nbsp;|&nbsp;
													<span>추천 {parseInt(Math.random() * 100, 10)}</span>
												</div>
											</div>
											<div style={{textAlign: "end"}}>
												<span style={{fontSize: "0.85rem", color: "orangered"}}>{parseInt(Math.random() * 1693, 10) > 999 ? "999+" : parseInt(Math.random() * 1000, 10)}</span>
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
							<div>
								<h3>* {contentCategory} List</h3>
							</div>

							<div key="contentListData">
								<div style={{minHeight: "600px", margin: "10px"}}>
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
								<CustomPagination currentPage={page} contentPerPage={10} contentCount={contentCount} moveURL={`/lostark/board/${contentCategory}`} howManyPages={4} />
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