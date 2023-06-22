import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const CommonInclude = (props) => {
	let location = useLocation();
	
	useEffect(() => {
		console.log("CommonInclude", location.pathname);
		props.checkSignInStatus();
	}, [location.pathname, ]);
}

export default CommonInclude;