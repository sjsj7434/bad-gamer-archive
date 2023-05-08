import Container from 'react-bootstrap/Container';
import { useState, useEffect } from 'react';

const Test = (props) => {
	useEffect(() => {
		console.log(`Test ${props.text} Component loaded`)
		return() => {
			console.log(`Test ${props.text} Component unloaded`)
		}
	}, [])
	const element = [];
	for (let index = 0; index < 20; index++) {
		element.push(<h2 key={index}>index : {index}, props : {props.text}</h2>);
	}

	return(
		<Container style={{maxWidth: "1440px"}}>
			{element}
		</Container>
	);
}

export default Test;