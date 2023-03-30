import logo from '../images/logo192.png';

const EmptyResult = () => {
	return(
		<div style={{textAlign: "center", margin:"20px"}}>
			<h1 style={{color: "red", textDecorationLine: "underline"}}>
				Nothing Found
			</h1>
			<p>
				Sorry, We can't find information that you want
			</p>

			<img src={logo} alt="logo" width={120} height={120} />
		</div>
	);
}

export default EmptyResult;