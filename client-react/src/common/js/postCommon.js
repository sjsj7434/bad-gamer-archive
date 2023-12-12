/**
 * category 값 번역
 */
export const parseCategory = (categoryCode) => {
	let categoryStr = "";
	
	switch (categoryCode) {
		case "normal":
			categoryStr = "일반";
			break;
		case "humor":
			categoryStr = "유머";
			break;
		case "life":
			categoryStr = "일상";
			break;
		case "info":
			categoryStr = "정보";
			break;
		case "report":
			categoryStr = "고발";
			break;
		default:
			categoryStr = "";
			break;
	}

	return categoryStr;
}