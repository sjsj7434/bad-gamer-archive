import MyEditor from './MyEditor'

const CaseRegistration = () => {
	return(
		<>
			<div style={{ margin: "20px" }}>
				<MyEditor save={() => {alert("hello, props from CaseRegistration")}}></MyEditor>
			</div>
		</>
	);
}

export default CaseRegistration;