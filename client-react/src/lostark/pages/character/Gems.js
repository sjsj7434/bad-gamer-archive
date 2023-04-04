import { useState, useEffect } from 'react';
import * as lostarkAPI from '../../js/lostarkAPI.js'
import EmptyResult from '../EmptyResult.js';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Stack from 'react-bootstrap/Stack';

const Gems = (props) => {
	// "searchResult"라는 새 상태 변수를 선언합니다
	const [searchResult, setSearchResult] = useState(<></>);

	const renderGems = (gemList) => {
		const gemElement = [];

		gemList.sort((a, b) => {return b.Level - a.Level || a.Name.localeCompare(b.Name)}); //레벨 > 이름 순으로 정렬

		for(const gem of gemList){
			// const findElement = gems.Effects.find((ele) => ele.GemSlot === gem.Slot);
			// const popover = (
			// 	<Popover id="popover-basic">
			// 		<Popover.Header as="h3">{gem.Level}레벨 {gem.Name.replace(/[^멸화|홍염|청명|원해]/g, "")}</Popover.Header>
			// 		<Popover.Body style={{padding: "5px"}}>
			// 			<Stack direction="horizontal" gap={2}>
			// 				<Image rounded={true} src={findElement.Icon} />

			// 				<span style={{fontSize: "0.8rem"}}>
			// 					{findElement.Name}
			// 					<br />
			// 					{findElement.Description}
			// 				</span>
			// 			</Stack>
			// 		</Popover.Body>
			// 	</Popover>
			// );
			let popover = <></>;

			gemElement.push(
				<Col>
					<OverlayTrigger  placement="top" overlay={popover}>
						<div style={{display: "flex", flexDirection: "column",  alignItems: "center", width: "fit-content"}}>
							<Image src={gem.Icon} style={{width: "100%"}} />
							<span style={{color: "#ffffcc", fontSize: "12px", textDecorationLine: "under"}}>
								{gem.Level}{gem.Name.replace(/[^멸화|홍염|청명|원해]/g, "").substring(0, 1)}
							</span>
						</div>
					</OverlayTrigger>
				</Col>
			);
		}

		return gemElement;
	}

	useEffect(() => {
		const call = async (characterName) => {
			const gemsData = await lostarkAPI.getGemsInfo(characterName);
			console.log(gemsData);

			if(gemsData === null){
				setSearchResult(
					<EmptyResult/>
				);
			}
			else{
				setSearchResult(
					<Row className="g-1">
						{renderGems(gemsData.Gems)}
					</Row>
				);
			}
		}
		
		call(props.characterName);
	}, [props]); //처음 페이지 로딩 될때만

	return (
		<div>
			{searchResult}
		</div>
	);
}

export default Gems;