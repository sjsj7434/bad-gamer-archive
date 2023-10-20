import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-custom-build/build/ckeditor'; //online-build, custom build, [npm add file]
// https://stackoverflow.com/questions/62243323/reactjs-import-ckeditor-5-from-online-build
import '../../css/MyEditor.css'

const editorConfiguration = {
	toolbar: [
		"heading",
		"|",
		"alignment",
		"bold",
		"italic",
		"underLine",
		"strikeThrough",
		"horizontalLine",
		"|",
		"fontColor",
		"fontFamily",
		"fontSize",
		"fontBackgroundColor",
		"|",
		"indent",
		"outdent",
		"numberedList",
		"bulletedList",
		"todoList",
		"blockQuote",
		"|",
		"link",
		// "imageUpload",
		"imageInsert",
		"mediaEmbed",
		"insertTable",
		"|",
		"findAndReplace",
		"undo",
		"redo",
	],
	fontFamily: {
		options: [
			"default",
			"Arial",
			"Georgia",
			"궁서체",
			"바탕",
			"돋움"
		],
		supportAllValues: true
	},
	fontColor: {
		colors: [
			{
				color: "#000000",
				label: "Black",
				hasBorder: true
			},
			{
				color: "#737373",
				label: "Dim grey",
				hasBorder: true
			},
			{
				color: "#b5b5b5",
				label: "Grey",
				hasBorder: true
			},
			{
				color: "#ebebeb",
				label: "연한 회색",
				hasBorder: true
			},
			{
				color: "#ffffff",
				label: "White",
				hasBorder: true
			},
			{
				color: "#ff0000",
				label: "붉은색",
				hasBorder: true
			},
			{
				color: "#FF8000",
				label: "주황색",
				hasBorder: true
			},
			{
				color: "#fff700",
				label: "노란색",
				hasBorder: true
			},
			{
				color: "#4de64d",
				label: "초록색",
				hasBorder: true
			},
			{
				color: "#0022FF",
				label: "파란색",
				hasBorder: true
			},
			{
				color: "#6600CC",
				label: "보라색",
				hasBorder: true
			},
			{
				color: "#ff4e4e",
				label: "연한 붉은색",
				hasBorder: true
			},
			{
				color: "#FF99CC",
				label: "분홍색",
				hasBorder: true
			},
			{
				color: "#32D7FF",
				label: "하늘색",
				hasBorder: true
			},
			{
				color: "#21ffcc",
				label: "민트색",
				hasBorder: true
			},
		]
	},
	fontSize: {
		options: [
			10,
			11,
			12,
			13,
			14,
			15,
			16,
			17,
			18,
			19,
			"default",
			21,
			22,
			23,
			24,
			25,
			26,
			27,
			28,
			29,
			30,
			40,
		],
	},
	// wordCount: {
	// 	onUpdate: (stats) => {
	// 		// Prints the current content statistics.
	// 		// console.log(`Characters: ${stats.characters}\nWords: ${stats.words}`, stats);

	// 		const wordCountWrapper = document.querySelector("#word-count");
	// 		wordCountWrapper.textContent = `글자 수 => ${stats.characters}`;
	// 		wordCountWrapper.classList.toggle("demo-update__limit-close", false);
	// 	}
	// },
	simpleUpload: {
		// https://ckeditor.com/docs/ckeditor5/latest/framework/deep-dive/upload-adapter.html
		
		// The URL that the images are uploaded to.
		uploadUrl: `${process.env.REACT_APP_SERVER}/boards/image`,

		// Enable the XMLHttpRequest.withCredentials property.
		withCredentials: true,

		// Headers sent along with the XMLHttpRequest to the upload server.
		headers: {
			"X-CSRF-TOKEN": "CSRF-Token",
			Authorization: "Bearer <JSON Web Token>"
		}
	}
};

const MyEditor = (props) => {
	/**
	 * 에디터 내용 kilobyte(1000) 계산하여 반환, kibibyte(1024)아님
	 */
	const getKiloByteSize = (stringData) => {
		const encoder = new TextEncoder();
		const encoded = encoder.encode(stringData);
		const kilobyte = (encoded.byteLength / 1000).toFixed(2);
		return kilobyte;
	}
	
	/**
	 * 에디터 내용 kilobyte(1000) 계산하여 텍스트 표시
	 */
	const setEditorSizeText = (data) => {
		const htmlSizeWrapper = document.querySelector("#html-size");
	
		const editorKB = getKiloByteSize(data);
		props.setEditorSizeByte(editorKB);
	
		htmlSizeWrapper.textContent = `작성된 글 용량 : ${editorKB} KB / ${props.editorMaxKB} KB`;
	
		if(editorKB >= props.editorMaxKB){
			htmlSizeWrapper.style.color = "red";
		}
		else{
			htmlSizeWrapper.style.color = "";
		}
	}

	return (
		<>
			<CKEditor
				config={editorConfiguration}
				editor={ClassicEditor}
				data={props.savedData}
				disabled={props.editorMode === "read" ? true : false}
				onReady={(editor) => {
					props.setEditor(editor);
					
					const data = editor.getData();
					setEditorSizeText(data);
					// You can store the "editor" and use when it is needed.
					// console.log("Editor is ready to use!", editor);

					// 기본 탑재 wordCounter view
					// const wordCountPlugin = editor.plugins.get("WordCount");
					// const wordCountWrapper = document.querySelector("#word-count");
					// wordCountWrapper.appendChild(wordCountPlugin.wordCountContainer);
					
					const toolbarElement = editor.ui.view.toolbar.element;
					const htmlSizeWrapper = document.querySelector("#html-size");
					if (props.editorMode === "read") {
						//읽기 모드
						toolbarElement.style.display = "none";
						htmlSizeWrapper.style.display = "none";
					}
					else {
						//작성 모드
						toolbarElement.style.display = "flex";
					}
				}}
				onChange={(event, editor) => {
					// KB, 1000, 십진법, 킬로바이트
					// KiB, 1024, 이진법, 키비바이트
					const data = editor.getData();
					setEditorSizeText(data);
				}}
				onBlur={(event, editor) => {
					// console.log("Blur", editor);
				}}
				onFocus={(event, editor) => {
					// console.log("Focus", editor);
				}}
			/>
			{/* <div id="word-count" style={{fontSize: "0.8rem"}}></div> */}
			<div id="html-size" style={{fontSize: "0.8rem", marginTop: "10px", marginBottom: "5px"}}>
				작성된 글 용량 : {"0.00"} KB / {props.editorMaxKB} KB
			</div>
		</>
	);
}

export default MyEditor;