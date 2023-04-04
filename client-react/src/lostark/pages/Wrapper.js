const Wrapper = (props) => {
	return(
		<>
			<div style={{backgroundColor: "#15181d"}}>
				{props.innerNode}
			</div>
		</>
	);
}

export default Wrapper;