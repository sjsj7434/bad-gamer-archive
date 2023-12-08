import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import CustomPagination from '../CustomPagination';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import * as postFetch from '../../../js/postFetch';
import UnknownPostRow from './UnknownPostRow';

const UnknownContentList = () => {
	const [page, setPage] = useState(null);
	const [renderData, setRenderData] = useState(<></>);
	const [searchType, setSearchType] = useState("");
	const [searchText, setSearchText] = useState("");
	
	const [contentList, setContentList] = useState(null);
	const [contentCount, setContentCount] = useState(null);
	const [paginationData, setPaginationData] = useState(<></>);
	const navigate = useNavigate();
	const params = useParams();
	const contentPerPage = 20;
	const howManyPages = 5;

	const readContentList = useCallback(async () => {
		const contentListData = await postFetch.getPostList("anonymous", searchType, searchText, page);

		setContentList(contentListData[0]);
		setContentCount(contentListData[1]);
	}, [searchType, searchText, page])
	
	const search = () => {
		const searchTypeElement = document.querySelector("#searchType");
		const searchTextElement = document.querySelector("#searchText");

		setSearchType(searchTypeElement.value);
		setSearchText(searchTextElement.value);
		setPage(1);
		readContentList();
	}

	useEffect(() => {
		if(isNaN(params.page) === false){
			setPage(params.page);
		}
		else{
			setPage(null);
		}
	}, [params.page])

	useEffect(() => {
		if(page !== null){
			readContentList();
		}
	}, [page, readContentList])

	useEffect(() => {
		if(contentList !== null && contentCount !== null){
			const renderList = [];

			if(contentList !== null){
				if(contentList.length === 0){
					renderList.push(
						<div key={"noContent"} style={{ height: 300 }}>
							<span style={{color: "gray", fontSize: "0.85rem"}}>작성된 게시글이 없습니다</span>
						</div>
					);
				}
				else{
					renderList.push(contentList.map((postData) => {
						return(
							<UnknownPostRow key={"post" + postData.code} postData={postData} />
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
			navigate(`/lostark/post/unknown/${pageIndex}`);
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
					익명 게시판
				</h5>
				<hr/>
			</div>

			<div key="contentListData">
				<div style={{margin: "10px"}}>
					{renderData}
				</div>

				<div style={{display: "flex", justifyContent: "flex-end"}}>
					<Link to={`/lostark/post/unknown/write`} style={{width: "30%", maxWidth: "200px"}}>
						<Button id={"createReply"} variant="outline-primary" style={{width: "100%", padding: "1px"}}>
							<span style={{fontSize: "0.8rem"}}>글쓰기</span>
						</Button>
					</Link>
				</div>
			</div>

			{paginationData}

			<div style={{ display: "flex", justifyContent: "center", marginTop: "2rem", marginBottom: "2rem" }}>
				<div style={{ width: "50%" }}>
					<InputGroup className="mb-3">
						<Form.Select id="searchType" size="sm" style={{ maxWidth: "140px"}}>
							<option value="titleAndContent">제목+내용</option>
							<option value="title">제목</option>
							<option value="content">내용</option>
						</Form.Select>

						<Form.Control id="searchText" style={{ fontSize: "0.8rem" }} />

						<Button id="searchButton" onClick={ () => { search() } } variant="outline-secondary" style={{ fontSize: "0.8rem" }}>검색</Button>
					</InputGroup>
				</div>
			</div>
		</Container>
	);
}

export default UnknownContentList;