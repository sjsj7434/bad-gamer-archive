import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-custom-build/build/ckeditor'; //online-build, custom build, [npm add file]
// https://stackoverflow.com/questions/62243323/reactjs-import-ckeditor-5-from-online-build
import '../css/MyEditor.css'

const editorMaxKB = 50; //에디터 HTML 최대 Byte
const editorConfiguration = {
	toolbar: [
		'heading',
		'|',
		'alignment',
		'bold',
		'italic',
		'underLine',
		'strikeThrough',
		'horizontalLine',
		'|',
		'fontColor',
		'fontFamily',
		'fontSize',
		'fontBackgroundColor',
		'|',
		'indent',
		'outdent',
		'numberedList',
		'bulletedList',
		'todoList',
		'blockQuote',
		'|',
		'link',
		// 'imageUpload',
		'imageInsert',
		'mediaEmbed',
		'insertTable',
		'|',
		'findAndReplace',
		'undo',
		'redo',
	],
	fontFamily: {
		options: [
			'default',
			'Arial',
			'Georgia',
			'궁서체',
			'바탕',
			'돋움'
		],
		supportAllValues: true
	},
	fontColor: {
		colors: [
			{
				color: '#000000',
				label: 'Black',
				hasBorder: true
			},
			{
				color: '#737373',
				label: 'Dim grey',
				hasBorder: true
			},
			{
				color: '#b5b5b5',
				label: 'Grey',
				hasBorder: true
			},
			{
				color: '#ebebeb',
				label: '연한 회색',
				hasBorder: true
			},
			{
				color: '#ffffff',
				label: 'White',
				hasBorder: true
			},
			{
				color: '#ff0000',
				label: '붉은색',
				hasBorder: true
			},
			{
				color: '#FF8000',
				label: '주황색',
				hasBorder: true
			},
			{
				color: '#fff700',
				label: '노란색',
				hasBorder: true
			},
			{
				color: '#4de64d',
				label: '초록색',
				hasBorder: true
			},
			{
				color: '#0022FF',
				label: '파란색',
				hasBorder: true
			},
			{
				color: '#6600CC',
				label: '보라색',
				hasBorder: true
			},
			{
				color: '#ff4e4e',
				label: '연한 붉은색',
				hasBorder: true
			},
			{
				color: '#FF99CC',
				label: '분홍색',
				hasBorder: true
			},
			{
				color: '#32D7FF',
				label: '하늘색',
				hasBorder: true
			},
			{
				color: '#21ffcc',
				label: '민트색',
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
			'default',
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
	wordCount: {
		onUpdate: stats => {
			// Prints the current content statistics.
			console.log( `Characters: ${ stats.characters }\nWords: ${ stats.words }` );
			const wordCountWrapper = document.getElementById( 'word-count' );
			wordCountWrapper.textContent = `글자 수 => ${stats.characters}`;
			wordCountWrapper.classList.toggle( 'demo-update__limit-close', false )
		}
	},
	simpleUpload: {
		// https://ckeditor.com/docs/ckeditor5/latest/framework/deep-dive/upload-adapter.html
		
		// The URL that the images are uploaded to.
		uploadUrl: `${process.env.REACT_APP_SERVER}/image`,

		// Enable the XMLHttpRequest.withCredentials property.
		withCredentials: true,

		// Headers sent along with the XMLHttpRequest to the upload server.
		headers: {
			'X-CSRF-TOKEN': 'CSRF-Token',
			Authorization: 'Bearer <JSON Web Token>'
		}
	}
};

const MyEditor = () => {
	return (
		<>
			<h2>Using CKEditor 5 build in React</h2>
			<CKEditor
				config={ editorConfiguration }
				editor={ ClassicEditor }
				data="<p>Hello from CKEditor 5!</p>"
				onReady={ editor => {
					// You can store the "editor" and use when it is needed.
					console.log( 'Editor is ready to use!', editor );
					// console.log(Array.from(editor.ui.componentFactory.names()).join(", "));

					// const wordCountPlugin = editor.plugins.get( 'WordCount' );
					// const wordCountWrapper = document.getElementById( 'word-count' );
					// wordCountWrapper.appendChild( wordCountPlugin.wordCountContainer ); //기본 view
				} }
				onChange={ ( event, editor ) => {
					const data = editor.getData();
					// console.log( { event, editor, data } );
					console.log(data);
					const wordCountWrapper = document.getElementById( 'html-count' );

					const stringByteLength = (
						function(s, b, i, c){
							for(b = i = 0; (c = s.charCodeAt(i ++)); b += c >> 11 ? 3 : (c >> 7 ? 2 : 1));
							return b;
						}
					)(data);

					const editorKB = (stringByteLength / 1024).toFixed(3);

					wordCountWrapper.textContent = `
						editorKB => ${editorKB} KB / ${editorMaxKB} KB
					`;
					wordCountWrapper.classList.toggle( 'demo-update__limit-close', false )
				} }
				onBlur={ ( event, editor ) => {
					console.log( 'Blur.', editor );
				} }
				onFocus={ ( event, editor ) => {
					console.log( 'Focus.', editor );
				} }
			/>
			<div id="word-count"></div>
			<div id="html-count"></div>
		</>
	);
}

export default MyEditor;