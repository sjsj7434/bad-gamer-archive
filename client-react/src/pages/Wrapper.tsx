type SettingsMenuType = {
	ren: React.ReactNode;
}

const Wrapper: React.FC<SettingsMenuType> = ({ ren }) => {
	return(
		<>
			{ren}
		</>
	);
}

export default Wrapper;