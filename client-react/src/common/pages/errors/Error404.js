import logo from '../../images/logo192.png';

const Error_404 = () => {
	return(
		<div style={{textAlign: "center", margin:"20px"}}>
			<h1 style={{color: "red", textDecorationLine: "underline"}}>
				ERROR 404
			</h1>
			<p>
				Sorry, We can't find page that you want
			</p>

			<img src={logo} alt="logo" width={120} height={120} />
		</div>
	);
}

export default Error_404;