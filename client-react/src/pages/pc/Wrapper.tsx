import '../../css/Wrapper.css';

type SettingsMenuType = {
	ren: React.ReactNode;
}

const Wrapper: React.FC<SettingsMenuType> = ({ ren }) => {
	return(
		<div className="wrapper">
			<div className="wrapper-body">
				{ren}
			</div>

			<footer className="wrapper-footer">
				Some copyright info or perhaps some author
				info for an &lt;article&gt;
			</footer>
		</div>
	);
}

export default Wrapper;