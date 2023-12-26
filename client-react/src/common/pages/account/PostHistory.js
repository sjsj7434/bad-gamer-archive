import * as accountsFetch from '../../js/accountFetch.js'
import '../../css/MyPage.css';
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { useEffect, useState } from 'react';
import KnownPostRow from '../post/known/KnownPostRow.js';

const PostHistory = () => {
	const param = useParams();
	const [render, setRender] = useState();

	//내가 작성한 글 가져오기
	const getMyPost = async () => {
		const resultData = await accountsFetch.getMyPost();
		console.log(resultData[0]);

		const data = resultData[0].post.map((post) => {
			console.log(post)
			return(
				<KnownPostRow key={"post" + post.code} postData={post} />
			);
		})

		setRender(data);
	}

	useEffect(() => {
		getMyPost();
	}, [])
	
	return (
		<Container>
			PostHistory / {param.nickname}

			<br></br><br></br><br></br>

			{render}
		</Container>
	);
}

export default PostHistory;