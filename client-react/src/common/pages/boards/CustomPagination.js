import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Pagination from 'react-bootstrap/Pagination';

const CustomPagination = (props) => {
	const [renderData, setRenderData] = useState(<></>);
	const navigate = useNavigate();

	useEffect(() => {
		// const contentCount = props.contentCount;
		const contentCount = 101;
		const paginationData = [];
		const maxPageCount = parseInt((contentCount - 1) / props.contentPerPage, 10) + 1;
		const howManyPages = 5;
		const currentPage = Number(props.currentPage);
		const startPage = ((parseInt((currentPage - 1) / howManyPages, 10)) * howManyPages) + 1;
		const endPage = (startPage + howManyPages >= maxPageCount ? maxPageCount : startPage + howManyPages);
		const prevPageIndex = (startPage - 1 <= 0 ? 1 : startPage - 1);
		const nextPageIndex = (endPage >= maxPageCount ? endPage : endPage);
		const isDisablePrev = (startPage - 1 <= 0 ? true : false);
		const isDisableNext = (maxPageCount < endPage ? true : false);

		console.log(`startPage: ${startPage} / endPage: ${endPage} / maxPageCount: ${maxPageCount} / contentCount: ${contentCount} / howManyPages: ${howManyPages} / endDir: ${(startPage + howManyPages >= maxPageCount ? "left" : "right")}`);
		console.log(`prevPageIndex: ${prevPageIndex} / nextPageIndex: ${nextPageIndex}`);

		paginationData.push(<Pagination.Prev key={"pagenation_prev"} disabled={isDisablePrev} onClick={() => {navigate(`${props.moveURL}/${prevPageIndex}`)}} />);
		for (let pageIndex = startPage; pageIndex < endPage; pageIndex++) {
			paginationData.push(
				<Pagination.Item key={"pagenation_" + pageIndex} active={pageIndex === currentPage ? true : false} onClick={() => {navigate(`${props.moveURL}/${pageIndex}`)}}>{pageIndex}</Pagination.Item>
			);
		}
		paginationData.push(<Pagination.Next key={"pagenation_next"} disabled={isDisableNext} onClick={() => {navigate(`${props.moveURL}/${nextPageIndex}`)}} />);

		setRenderData(
			<Pagination>
				{paginationData}
			</Pagination>
		);
	}, [props.currentPage, props.contentPerPage, props.contentCount, props.moveURL, navigate])
	
	return renderData;
}

export default CustomPagination;