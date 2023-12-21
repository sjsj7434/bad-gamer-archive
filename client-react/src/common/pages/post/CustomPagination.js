import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Pagination from 'react-bootstrap/Pagination';

const CustomPagination = (props) => {
	const [renderData, setRenderData] = useState(<></>);
	const [currentPage, setCurrentPage] = useState(null);
	const [contentPerPage, setContentPerPage] = useState(null);
	const [contentCount, setContentCount] = useState(null);
	const [howManyPages, setHowManyPages] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		setCurrentPage(Number(props.currentPage));
		setContentPerPage(props.contentPerPage);
		setContentCount(props.contentCount);
		setHowManyPages(props.howManyPages);
	}, [props.currentPage, props.contentPerPage, props.contentCount, props.howManyPages])
	
	useEffect(() => {
		if(currentPage !== null && contentPerPage !== null && contentCount !== null){
			const paginationData = [];
			const maxPageCount = parseInt((contentCount - 1) / contentPerPage, 10) + 1;
			const startPage = ((parseInt((currentPage - 1) / howManyPages, 10)) * howManyPages) + 1;
			const endPage = (startPage + (howManyPages - 1) >= maxPageCount ? maxPageCount : startPage + (howManyPages - 1));
			const prevPageIndex = (startPage <= 1 ? 1 : startPage - 1);
			const nextPageIndex = (endPage <= maxPageCount ? endPage + 1 : endPage);
			const isDisablePrev = (startPage - 1 <= 0 ? true : false);
			const isDisableNext = (maxPageCount <= endPage ? true : false);

			paginationData.push(<Pagination.Prev key={"pagenation_prev"} disabled={isDisablePrev} onClick={() => {props.pageMoveFunc(prevPageIndex)}} />);
			for (let pageIndex = startPage; pageIndex <= endPage; pageIndex++) {
				paginationData.push(
					<Pagination.Item disabled={(contentCount <= 0)} key={"pagenation_" + pageIndex} active={pageIndex === currentPage ? true : false} onClick={() => {if(pageIndex !== currentPage){props.pageMoveFunc(pageIndex)}}}>
						{pageIndex}
					</Pagination.Item>
				);
			}
			paginationData.push(<Pagination.Next key={"pagenation_next"} disabled={isDisableNext} onClick={() => {props.pageMoveFunc(nextPageIndex)}} />);

			setRenderData(
				<Pagination>
					{paginationData}
				</Pagination>
			);
		}
	}, [currentPage, contentPerPage, contentCount, howManyPages, props, navigate])
	
	return renderData;
}

export default CustomPagination;