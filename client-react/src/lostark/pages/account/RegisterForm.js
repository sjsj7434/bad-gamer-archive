import { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

import * as dbActions from '../../js/dbActions.js'

const RegisterForm = (props) => {
	const [validated, setValidated] = useState(false);

	useEffect(() => {
		const call = async (characterName) => {
			console.log(characterName);
		}
		
		call(props.characterName);
	}, [props]); //처음 페이지 로딩 될때만

	const handleSubmit = (event) => {
		event.preventDefault();
		event.stopPropagation();

		if(window.confirm('save?')){
			const form = event.currentTarget;

			if(form.checkValidity() === true){
				//
			}
		
			setValidated(true);
		}
	};

	const checkPassword = () => {
		const passwordElement = document.querySelector("#password");
		const passwordRegExp = new RegExp("^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$");

		if(passwordRegExp.test(passwordElement.value) === true){
			passwordElement.classList.add("is-valid");
			passwordElement.classList.remove("is-invalid");
		}
		else{
			passwordElement.classList.remove("is-valid");
			passwordElement.classList.add("is-invalid");
		}

		checkRePassword();
	}

	const checkRePassword = () => {
		const passwordElement = document.querySelector("#password");
		const rePasswordElement = document.querySelector("#rePassword");

		if(passwordElement.value === rePasswordElement.value){
			rePasswordElement.classList.add("is-valid");
			rePasswordElement.classList.remove("is-invalid");
		}
		else{
			rePasswordElement.classList.remove("is-valid");
			rePasswordElement.classList.add("is-invalid");
		}
	}

	/**
	 * 중복되는 ID가 있는지 확인
	 * @returns boolean
	 */
	const isDuplicatedID = async () => {
		const id = document.querySelector("#id");
		const result = await dbActions.isDuplicatedID(id.value);
		console.log(result);

		if(result !== null){
			id.classList.remove("is-valid");
			id.classList.add("is-invalid");
			return false;
		}
		else{
			id.classList.add("is-valid");
			id.classList.remove("is-invalid");
			return true;
		}
	}

	/**
	 * 중복되는 닉네임이 있는지 확인
	 * @returns boolean
	 */
	const isDuplicatedNickname = async () => {
		const nickname = document.querySelector("#nickname");
		const result = await dbActions.isDuplicatedNickname(nickname.value);
		console.log(result);

		if(result !== null){
			nickname.classList.remove("is-valid");
			nickname.classList.add("is-invalid");
			return false;
		}
		else{
			nickname.classList.add("is-valid");
			nickname.classList.remove("is-invalid");
			return true;
		}
	}

	return (
		<Container style={{maxWidth: "600px"}}>
			<div style={{ marginTop: "30px" }}>
				<div style={{ marginBottom: "30px" }}>
					<h3>Welcome To here</h3>
				</div>
				<Form noValidate validated={validated} onSubmit={handleSubmit}>
					<Form.Group as={Row} className="mb-3">
						<Form.Label style={{fontWeight: "800"}}>
							ID
						</Form.Label>
						<Col>
							<InputGroup>
								<Form.Control id="id" required maxLength={20} type="text" placeholder="ID" isValid={false} isInvalid={false} />
								<Button variant="outline-dark" onClick={() => {isDuplicatedID()}}>
									Check
								</Button>
							</InputGroup>
							<Form.Text muted>
								Your ID must be 1-20 characters long, only alphabet
							</Form.Text>
						</Col>
					</Form.Group>

					<Form.Group as={Row} className="mb-3">
						<Form.Label style={{fontWeight: "800"}}>
							Nickname
						</Form.Label>
						<Col>
							<InputGroup>
								<Form.Control id="nickname" required maxLength={20} type="text" placeholder="Nickname" />
								<Button variant="outline-dark"onClick={() => {isDuplicatedNickname()}}>
									Check
								</Button>
							</InputGroup>
							<Form.Text muted>
								Your Nickname must be 1-20 characters long, no special letters
							</Form.Text>

							<Form.Control.Feedback type="invalid">
								Please choose a Nickname.
							</Form.Control.Feedback>
						</Col>
					</Form.Group>

					<Form.Group as={Row} className="mb-3">
						<Form.Label style={{fontWeight: "800"}}>
							Email
						</Form.Label>
						<Col>
							<Form.Control required maxLength={50} type="email" placeholder="email" />
							<Form.Text muted>
								Your Email will be used when you lost your password
							</Form.Text>
							<Form.Control.Feedback type="invalid">
								Please choose a email.
							</Form.Control.Feedback>
						</Col>
					</Form.Group>

					<Form.Group as={Row} className="mb-3">
						<Form.Label style={{fontWeight: "800"}}>
							Password
						</Form.Label>
						<Col>
							<Form.Control id="password" required maxLength={20} type="password" placeholder="password" onChange={() => {checkPassword()}} />
							<Form.Text muted>
								Your password must be 8-20 characters long, contain letters and numbers
							</Form.Text>
							
							<Form.Control.Feedback id="passwordValid" type="valid">
								Password is good
							</Form.Control.Feedback>
							<Form.Control.Feedback id="passwordInvalid" type="invalid">
								At least 8, alphabet, numbers, special letters
							</Form.Control.Feedback>
						</Col>
					</Form.Group>
					<Form.Group as={Row} className="mb-3">
						<Form.Label style={{fontWeight: "800"}}>
							Re-Password
						</Form.Label>
						<Col>
							<Form.Control id="rePassword" required maxLength={20} type="password" placeholder="Re-password" onChange={() => {checkRePassword()}} />
							<Form.Text muted>
								Type your password once more
							</Form.Text>
							
							<Form.Control.Feedback id="passwordValid" type="valid">
								Password is same
							</Form.Control.Feedback>
							<Form.Control.Feedback id="passwordInvalid" type="invalid">
								Password is not same
							</Form.Control.Feedback>
						</Col>
					</Form.Group>
					
					<Button type="submit">Submit form</Button>
				</Form>
			</div>

			<br/>
			password will be encrypted, so web admin will not know your password
		</Container>
	);
}

export default RegisterForm;