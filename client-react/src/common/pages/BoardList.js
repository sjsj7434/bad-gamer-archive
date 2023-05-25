import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Navigate } from "react-router-dom";
import Pagination from 'react-bootstrap/Pagination';

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

	useEffect(() => {
		/**
		 * 입력한 캐릭터 이름의 기본 정보를 가져온다
		 * @returns {object} 가져온 캐릭터 정보 JSON
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

				console.log(`readContentList / page: ${page}`, jsonData);
				const tempRenderData = [];
				const contentListData = [];
				const paginationData = [];

				if(jsonData.length === 0){
					contentListData.push(
						<div key={"noContent"}>
							<h2>No data</h2>
						</div>
					);
				}
				else{
					contentListData.push(jsonData.map((data) => {
						return(
							<div key={"content" + data.code}>
								<h4 onClick={() => {navigate(`/lostark/board/view/${data.code}`)}}>{data.title}</h4>
								<hr></hr>
							</div>
						);
					}));
				}
			
				<div style={{minHeight: "600px"}}>
					{contentListData}
				</div>

				let maxPageCount = 24;
				let currentPage = Number(params.page);
				paginationData.push(<Pagination.Prev />);
				for (let index = currentPage; index < currentPage + 10; index++) {
					if(index >= maxPageCount){
						break;
					}
					paginationData.push(
						<Pagination.Item key={"pagenation_" + index} active={index === Number(page) ? true : false} onClick={() => {navigate(`/lostark/list/${contentCategory}/${index}`)}}>{index}</Pagination.Item>
					);
				}
				paginationData.push(<Pagination.Next />);

				tempRenderData.push(
					<div style={{minHeight: "600px"}} key="contentListData">
						{contentListData}
					</div>
				);

				tempRenderData.push(
					<div style={{display: "flex", justifyContent: "center"}} key="paginationData">
						<Pagination>
							{paginationData}
						</Pagination>
					</div>
				);

				setRenderData(tempRenderData);
			}
		}
		
		if(isNaN(params.page) === false){
			setContentCategory(params.category);
			setPage(params.page);
			console.log(`params.page: ${params.page} / page: ${page}`)

			if(params.page === page){
				readContentList();
			}
		}
		else{
			setRenderData(<div>404!</div>);
		}
	}, [params.page, page])
	
	return(
		<>
			{renderData}
		</>
	);
}

export default BoardList;