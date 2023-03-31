const Wrapper = (props) => {
	return(
		<>
			<div style={{height: "100vh", backgroundColor: "#15181d"}}>
				{props.innerNode}
			</div>
		</>
	);
}

export default Wrapper;