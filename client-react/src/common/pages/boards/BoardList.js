import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import CustomPagination from './CustomPagination';
import Pagination from 'react-bootstrap/Pagination';

const BoardList = () => {
	const [contentCategory, setContentCategory] = useState(null);
	const [page, setPage] = useState(null);
	const [contentJson, setContentJson] = useState(null);
	const [contentCount, setContentCount] = useState(null);
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
			console.log(`readContentList`, jsonData);

			setContentJson(jsonData[0]);
			setContentCount(jsonData[1]);
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
		if(contentCategory !== null && page !== null){
			readContentList();
		}
	}, [contentCategory, page])

	useEffect(() => {
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
							<p onClick={() => {navigate(`/lostark/board/${contentCategory}/view/${data.code}`)}} onMouseOver={(event) => {event.target.style.backgroundColor = "cyan"}} onMouseOut={(event) => {event.target.style.backgroundColor = ""}}>
								{data.title}
							</p>
							<hr />
						</div>
					);
				}));
			}
		}
	
		// const paginationData = [];
		// const contentPerPage = 10;
		// const maxPageCount = parseInt((contentCount - 1) / contentPerPage, 10) + 1;
		// const currentPage = Number(page);
		// const startPage = ((parseInt((currentPage - 1) / 10, 10)) * 10) + 1;
		// const endPage = (startPage + 10 >= maxPageCount ? maxPageCount + 1 : startPage + 10);
		// const prevPage = (startPage - 1 <= 0 ? 1 : startPage - 1);
		// const nextPage = (endPage >= maxPageCount ? endPage - 1 : endPage);
		// const isDisablePrev = (startPage - 1 <= 0 ? true : false);
		// const isDisableNext = (maxPageCount <= endPage ? true : false);

		// paginationData.push(<Pagination.Prev key={"pagenation_prev"} disabled={isDisablePrev} onClick={() => {navigate(`/lostark/board/${contentCategory}/${prevPage}`)}} />);
		// for (let index = startPage; index < endPage; index++) {
		// 	paginationData.push(
		// 		<Pagination.Item key={"pagenation_" + index} active={index === Number(page) ? true : false} onClick={() => {navigate(`/lostark/board/${contentCategory}/${index}`)}}>{index}</Pagination.Item>
		// 	);
		// }
		// paginationData.push(<Pagination.Next key={"pagenation_next"} disabled={isDisableNext} onClick={() => {navigate(`/lostark/board/${contentCategory}/${nextPage}`)}} />);

		setRenderData(
			<>
				<div key="contentListData">
					<div style={{minHeight: "600px", margin: "10px"}}>
						{contentListData}
					</div>

					<div style={{display: "flex", flexDirection: "row-reverse"}}>
						<span onClick={() => {navigate(`/lostark/board/${contentCategory}/write`)}}>Write</span>
					</div>
				</div>

				<div style={{display: "flex", justifyContent: "center"}} key="paginationData">
					<CustomPagination currentPage={page} contentPerPage={10} contentCount={contentCount} moveURL={`/lostark/board/${contentCategory}`}></CustomPagination>
				</div>
			</>
		);
	}, [contentJson, contentCount, navigate])
	
	return(
		<Container style={{maxWidth: "1440px"}}>
			<div>
				<h3>* {contentCategory} List</h3>
			</div>
			{renderData}
		</Container>
	);
}

export default BoardList;