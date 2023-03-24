type SettingsMenuType = {
	innerNode: React.ReactNode;
}

const Wrapper = (props: SettingsMenuType) => {
	return(
		<>
			<div>
				{props.innerNode}
			</div>
		</>
	);
}

export default Wrapper;