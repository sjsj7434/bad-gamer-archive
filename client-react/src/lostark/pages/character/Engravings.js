import { useState, useEffect } from 'react';
import * as ImageCDN from '../../js/ImageCDN.js'
import * as lostarkAPI from '../../js/lostarkAPI.js'
import EmptyResult from '../EmptyResult.js';
import Image from 'react-bootstrap/Image';

const Engravings = (props) => {
	// "searchResult"라는 새 상태 변수를 선언합니다
	const [searchResult, setSearchResult] = useState(<></>);

	const renderEngravings = (engravingList) => {
		const engravingsAreOn = [];
		for(const element of engravingList){
			engravingsAreOn.push(
				<div key={element.Name} style={{display: "flex", alignItems: "center", marginBottom: "5px"}}>
					<Image roundedCircle={true} src={ImageCDN.findImageCDN(element.Name.split(" Lv.")[0], "")} style={{width: "34px", border: element.Name.includes(" 감소") ? "2px solid #ff3e3e" : "2px solid #2e9d00"}} />
					<small style={{marginLeft: "5px", color: "#ffffff"}}><b>{element.Name}</b></small>
				</div>
			);
		}

		return engravingsAreOn;
	}

	useEffect(() => {
		const call = async (characterName) => {
			const engravingsData = await lostarkAPI.getEngravingsInfo(characterName);
			console.log(engravingsData);

			if(engravingsData === null){
				setSearchResult(
					<EmptyResult/>
				);
			}
			else{
				setSearchResult(
					<div style={{display: "flex", marginTop: "15px", flexDirection: "column"}}>
						{renderEngravings(engravingsData.Effects)}
					</div>
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

export default Engravings;