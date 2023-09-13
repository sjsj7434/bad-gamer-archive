import { useEffect } from 'react';

const SetActiveMenu = (props) => {
	useEffect(() => {
		props.setCurrentMenu(props.menuCode);
	})
}

export default SetActiveMenu;