import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-custom-build/build/ckeditor'; //online-build, custom build, [npm add file]
// https://stackoverflow.com/questions/62243323/reactjs-import-ckeditor-5-from-online-build
import { useEffect } from 'react';

const editorConfiguration = {toolbar: []};

const MyEditorView = (props) => {
	useEffect(() => {
		return () => {
			console.log('destroy Editor~')
		};
	}, []);

	return (
		<>
			<CKEditor
				style={{border: "10px solid"}}
				config={editorConfiguration}
				editor={ClassicEditor}
				data={props.contentData.content}
				onReady={(editor) => {
					console.log("Editor is ready to use!", editor);
					editor.enableReadOnlyMode("");

					const toolbarElement = editor.ui.view.toolbar.element;
					toolbarElement.style.display = 'none';
				}}
			/>
		</>
	);
}

export default MyEditorView;