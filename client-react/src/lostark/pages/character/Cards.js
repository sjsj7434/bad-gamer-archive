import { useState, useEffect } from 'react';
import * as lostarkAPI from '../../js/lostarkAPI.js'
import EmptyResult from '../../../common/pages/errors/EmptyResult.js';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Cards = (props) => {
	// "searchResult"라는 새 상태 변수를 선언합니다
	const [searchResult, setSearchResult] = useState(<></>);

	const renderCardGroup = (cardList) => {
		const cardListElement = [];

		for(const card of cardList){
			cardListElement.push(
				<Col key={card.Icon}>
					<div style={{display: "flex", flexDirection: "column", justifyContent: "flex-end"}}>
						<div>
							<div>
								<div style={{aspectRatio: 24 / 35, overflow: "hidden", backgroundSize: "cover", backgroundImage: `url('${card.Icon}')`}}>
									<img src={'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/pc/profile/img_card_grade.png'} alt={"cards"} style={{position: "relative", left: `-${cardGradeLeft(card.Grade)}%`, top: "-2%", width: "656%"}} />
								</div>
							</div>

							<div>
								<div style={{aspectRatio: 3 / 1, overflow: "hidden", backgroundSize: "cover", backgroundImage: `url('https://cdn-lostark.game.onstove.com/2018/obt/assets/images/pc/profile/img_profile_awake.png')`}}>
									<img src={"https://cdn-lostark.game.onstove.com/2018/obt/assets/images/pc/profile/img_profile_awake.png"} alt={"awakes"} style={{position: "relative", left: `-${cardAwakeCountLeft(card.AwakeCount)}%`, top: "-97%", width: "100%"}} />
								</div>
							</div>
						</div>
					</div>
				</Col>
			);
		}

		return cardListElement;
	}

	const cardAwakeCountLeft = (AwakeCount) => {
		let leftValue = 20 * AwakeCount;
		if(AwakeCount === 0){
			leftValue = 100;
		}
		else if(AwakeCount === 5){
			leftValue = 0;
		}

		return leftValue;
	}

	const cardGradeLeft = (grade) => {
		let leftValue = 0;

		switch (grade) {
			case "일반":
				leftValue = 0;
				break;
			case "희귀":
				leftValue = 111.5;
				break;
			case "고급":
				leftValue = 222.5;
				break;
			case "영웅":
				leftValue = 333.5;
				break;
			case "전설":
				leftValue = 444.5;
				break;
			default:
				break;
		}

		return leftValue;
	}

	const renderCardGroupEffect = (cardEffects) => {
		const cardEffectElement = [];

		for(const effect of cardEffects){
			cardEffectElement.push(
				<li>
					<div>
						<span style={{fontSize: "12px", color: "#ffddcc"}}>{effect.Name}</span>
						<br/>
						<span style={{color: "#ffffcc"}}>{effect.Description}</span>
					</div>
				</li>
			);
		}

		return cardEffectElement;
	}

	useEffect(() => {
		const call = async (characterName) => {
			const cardsData = await lostarkAPI.getCardsInfo(characterName);
			console.log(cardsData);

			if(cardsData === null){
				setSearchResult(
					<EmptyResult/>
				);
			}
			else{
				setSearchResult(
					<>
						<Row xs={6} md={6} className="g-2">
							{renderCardGroup(cardsData.Cards)}
						</Row>

						<Row>
							<ul>
								{renderCardGroupEffect(cardsData.Effects[0].Items)}
							</ul>
						</Row>
					</>
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

export default Cards;