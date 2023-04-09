const Wrapper = (props) => {
	return(
		<>
			<div style={{backgroundColor: ""}}>
				{props.innerNode}
			</div>
		</>
	);
}

export default Wrapper;