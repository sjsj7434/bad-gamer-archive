import logo from '../../images/logo192.png';

const Error_404 = () => {
	return(
		<div style={{textAlign: "center", margin:"20px"}}>
			<h1 style={{color: "red", textDecorationLine: "underline"}}>
				404
			</h1>
			<p>
				요청한 페이지를 찾을 수 없습니다
			</p>

			<img src={logo} alt="logo" width={120} height={120} />
		</div>
	);
}

export default Error_404;