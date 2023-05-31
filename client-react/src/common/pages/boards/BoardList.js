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
								<div key={"content" + data.code} style={{cursor: "pointer"}}>
									<Link
										to={`/lostark/board/${contentCategory}/view/${data.code}`}
										 onMouseOver={(event) => {event.target.style.backgroundColor = "cyan"}}
										 onMouseOut={(event) => {event.target.style.backgroundColor = ""}}
									>
										{data.title}
									</Link>
									{/* <p onClick={() => {navigate(`/lostark/board/${contentCategory}/view/${data.code}`)}} onMouseOver={(event) => {event.target.style.backgroundColor = "cyan"}} onMouseOut={(event) => {event.target.style.backgroundColor = ""}}>
										{data.title}
									</p> */}
									<hr />
								</div>
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
			console.log(`readContentList => contentCategory: ${contentCategory} / page: ${page}`);
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