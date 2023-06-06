import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';

const LoadingModal = (props) => {
	return (
		<>
			<Modal
				show={props.showModal}
				backdrop="static"
				keyboard={false}
				centered
			>
				<Modal.Body>
					<div style={{display: "flex", flexDirection: "row", justifyContent: "center", marginTop: "50px", marginBottom: "50px"}}>
						<Spinner animation="grow" variant="success" />
						&nbsp;&nbsp;
						<h4>{props.message}</h4>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}

export default LoadingModal;