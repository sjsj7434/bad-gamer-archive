const Error_404 = () => {
	console.log(window.innerWidth, window.innerHeight);
	let platform = "pc"
	if (window.innerWidth < 1000){
		platform = "mobile"
	}

	return(
		<>
			<div className="pcView">
				<h1 style={{ color: "#ff5f5f", textDecoration: "underline" }}>ERROR 404</h1>
				<p>Sorry, We can not find the page!</p>
			</div>

			<div className="mobileView">
				<h1 style={{ color: "#ff5f5f", textDecoration: "underline" }}>ERROR 404</h1>
				<p>Sorry, We can not find the page!</p>
			</div>
			
			platform : {platform}
		</>
	);
}

export default Error_404;