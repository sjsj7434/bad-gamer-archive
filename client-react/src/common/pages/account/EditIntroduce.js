import '../../css/MyPage.css';
import KnownPostWrite from '../post/known/KnownPostWrite';

const EditIntroduce = (props) => {
	return (
		<>
			<KnownPostWrite accountData={props.accountData} />
		</>
	);
}

export default EditIntroduce;