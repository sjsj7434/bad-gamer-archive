import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import MyEditor from '../post/MyEditor'
import MyEditorReload from '../post/MyEditorReload'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import LoadingModal from '../../../common/pages/common/LoadingModal';
import * as accountFetch from '../../js/accountFetch';
import '../../css/View.css';

const EditIntroduce = (props) => {
	const [editorMode, setEditorMode] = useState("read");
	const [renderData, setRenderData] = useState(<></>);
	const [editorSizeByte, setEditorSizeByte] = useState(0);
	const [loadingModalShow, setLoadingModalShow] = useState(false);
	const [loadingModalMessage, setLoadingModalMessage] = useState("");
	const navigate = useNavigate();
	const [editorObject, setEditorObject] = useState(null);

	const editorMaxKB = 30;

	useEffect(() => {
		/**
		 * 자기소개 저장
		 */
		const saveEditorData = async () => {
			const editorContet = editorObject.getData();

			if(editorContet === ""){
				alert("자기소개를 작성해주세요");
				return;
			}
			else if(editorSizeByte >= editorMaxKB){
				alert("작성된 글의 용량이 너무 큽니다");
				return;
			}
			else if(window.confirm("자기소개를 저장하시겠습니까?") === false){
				return;
			}

			setLoadingModalShow(true);
			setLoadingModalMessage("자기소개를 저장 중입니다...");

			const sendData = {
				introduce: editorContet,
			};

			const createResult = await accountFetch.saveMyIntroduce(sendData);

			if(createResult.createdCode === 0){
				if(createResult.status === "long_title"){
					alert("제목이 너무 길어 저장할 수 없습니다(최대 100자)");
					setLoadingModalShow(false);
				}
				else if(createResult.status === "long_content"){
					alert(`작성된 글의 용량이 너무 커 저장할 수 없습니다(최대 ${editorMaxKB}KB)`);
					setLoadingModalShow(false);
				}
				else if(createResult.status === "need_login"){
					alert("로그인이 필요합니다");
					setLoadingModalShow(false);
					navigate("/account/login");
				}
			}
			else{
				setEditorMode("read");
				setLoadingModalShow(false);
				props.afterUpdate();
			}
		}

		/**
		 * 자기소개 삭제
		 */
		const deleteIntroduce = async () => {
			if(window.confirm("자기소개를 삭제하시겠습니까?") === true){
				setLoadingModalShow(true);
				setLoadingModalMessage("자기소개를 삭제 중입니다...");
				const deleteResult = await accountFetch.deleteMyIntroduce();

				if(deleteResult === "true"){
					alert("자기소개가 삭제 되었습니다");
				}
				else{
					alert("자기소개를 삭제할 수 없습니다");
				}

				setEditorMode("read");
				setLoadingModalShow(false);
			}
		}

		if(editorMode === "write"){
			setRenderData(
				<>
					<div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", marginTop: "30px"}}>
						자기소개
						&nbsp;
						<div>
							<Button onClick={() => { if(window.confirm("자기소개 작성을 취소하시겠습니까?") === true){setEditorMode("read")} }} variant="danger" className="smallButton">취소</Button>
							&nbsp;
							<Button onClick={() => {saveEditorData()}} variant="primary" className="smallButton">저장</Button>
						</div>
					</div>

					<MyEditor
						editorMode={"write"}
						savedData={props.status === "empty" ? "" : props.introduce}
						editorMaxKB={editorMaxKB}
						setEditor={(editor) => {setEditorObject(editor)}}
						setEditorSizeByte={(size) => {setEditorSizeByte(size)}}
					/>

					<ProgressBar
						now={parseInt((editorSizeByte / editorMaxKB) * 100, 10)} label={`${parseInt((editorSizeByte / editorMaxKB) * 100, 10)} %`}
						variant="success"
						style={{ height: "2.5rem", fontSize: "1rem", backgroundColor: "lightgray" }}
					/>
				</>
			);
		}
		else{
			setRenderData(
				<>
					<div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", marginTop: "30px"}}>
						자기소개
						&nbsp;
						<div>
							<Button onClick={() => {deleteIntroduce()}} variant="danger" className="smallButton" disabled={props.status === "empty" ? true : false}>삭제</Button>
							&nbsp;
							<Button onClick={() => {setEditorMode("write")}} variant="primary" className="smallButton">{props.status === "empty" ? "작성" : "수정"}</Button>
						</div>
					</div>
		
					<div style={{ maxHeight: "300px", overflow: "auto", border: "1px solid lightgray", borderRadius: "6px" }}>
						<MyEditorReload
							editorMode={"read"}
							savedData={props.introduce}
							editorMaxKB={100}
							setEditor={ () => {} }
							setEditorSizeByte={ () => {} }
						/>
					</div>
				</>
			);
		}
	}, [props, editorMode, editorObject, editorSizeByte, navigate])
	
	return(
		<div style={{maxWidth: "1000px"}}>
			<Form>
				{renderData}
			</Form>
			<LoadingModal showModal={loadingModalShow} message={loadingModalMessage}/>
		</div>
	);
}

export default EditIntroduce;