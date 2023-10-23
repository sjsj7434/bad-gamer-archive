import { useEffect } from 'react';

const SetActiveMenu = (props) => {
	useEffect(() => {
		props.setCurrentMenu(props.menuCode);

		if(props.pageTitle === undefined || props.pageTitle === "" || props.pageTitle === null){
			document.title = "Agora";
		}
		else{
			document.title = props.pageTitle;
		}
	})
}

export default SetActiveMenu;