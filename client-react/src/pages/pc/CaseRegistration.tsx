import '../../css/CaseRegistration.css';

const CaseRegistration = () => {
	return(
		<>
			<form action="" method="post">
				<label htmlFor="criminalID">
					criminalID
				</label>
				<input type="text" name="criminalID" id="criminalID" />
				<br />

				<label htmlFor="searchStatus">
					searchStatus
				</label>
				<input type="text" name="searchStatus" id="searchStatus" />
				<br />
			</form>
		</>
	);
}

export default CaseRegistration;