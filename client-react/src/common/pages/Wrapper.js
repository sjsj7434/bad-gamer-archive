import CommonTopMenu from './CommonTopMenu';

const Wrapper = (props) => {
	return (
		<>
			<CommonTopMenu />
			{props.innerElement}
		</>
	);
}

export default Wrapper;