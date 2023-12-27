import { Link } from "react-router-dom";
import * as postCommon from "../../../js/postCommon";

const UnknownPostRow = (props) => {
	return(
		<Link
			to={`/lostark/post/unknown/view/${props.postData.code}`}
			style={{
				textDecoration: "none",
			}}
		>
			<div
				style={{
					cursor: "pointer",
					color: "black",
					textDecoration: "none",
					borderBottom: "1px solid gray",
					paddingTop: "5px",
					paddingBottom: "5px",
				}}
				className="rowToggle"
			>
				<div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
					<div style={{width: "90%"}}>
						<div style={{display: "flex", alignItems: "center", fontSize: "0.95rem", fontWeight: "600", maxWidth: "95%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
							{
								props.postData.hasImage === true ?
								<div>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="darkseagreen" className="bi bi-image" viewBox="0 0 17 17">
										<path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
										<path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
									</svg>
								</div>
								:
								<div>
									<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="gray" className="bi bi-blockquote-left" viewBox="0 0 15 15">
										<path d="M2.5 3a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1h-11zm5 3a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1h-6zm0 3a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1h-6zm-5 3a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1h-11zm.79-5.373c.112-.078.26-.17.444-.275L3.524 6c-.122.074-.272.17-.452.287-.18.117-.35.26-.51.428a2.425 2.425 0 0 0-.398.562c-.11.207-.164.438-.164.692 0 .36.072.65.217.873.144.219.385.328.72.328.215 0 .383-.07.504-.211a.697.697 0 0 0 .188-.463c0-.23-.07-.404-.211-.521-.137-.121-.326-.182-.568-.182h-.282c.024-.203.065-.37.123-.498a1.38 1.38 0 0 1 .252-.37 1.94 1.94 0 0 1 .346-.298zm2.167 0c.113-.078.262-.17.445-.275L5.692 6c-.122.074-.272.17-.452.287-.18.117-.35.26-.51.428a2.425 2.425 0 0 0-.398.562c-.11.207-.164.438-.164.692 0 .36.072.65.217.873.144.219.385.328.72.328.215 0 .383-.07.504-.211a.697.697 0 0 0 .188-.463c0-.23-.07-.404-.211-.521-.137-.121-.326-.182-.568-.182h-.282a1.75 1.75 0 0 1 .118-.492c.058-.13.144-.254.257-.375a1.94 1.94 0 0 1 .346-.3z"/>
									</svg>
								</div>
							}
							&nbsp;
							<div style={{overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}>
								<span style={{fontSize: "0.8rem"}}>
									{props.postData.category !== "" ? `[${postCommon.parseCategory(props.postData.category)}] ` : ""}
									{props.postData.title}
								</span>
							</div>
						</div>
						<div style={{fontSize: "0.75rem", color: "#5a5a5a", maxWidth: "95%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
							<span>익명 ({props.postData.ip})</span>
							&nbsp;|&nbsp;
							<span>{new Date(props.postData.createdAt).toLocaleDateString("sv-SE").replace(/-/g, ".")}</span>
							&nbsp;
							<span>{new Date(props.postData.createdAt).toLocaleTimeString("sv-SE", {hour: "numeric", minute: "2-digit"})}</span>
							&nbsp;|&nbsp;
							<span>조회 {props.postData.view}</span>
							&nbsp;|&nbsp;
							<span style={{color: "green"}}>↑{props.postData.upvote}</span> | <span style={{color: "red"}}>↓{props.postData.downvote}</span>
						</div>
					</div>
					<div style={{textAlign: "end"}}>
						{
							props.postData.reply.length > 999 ?
							<span style={{fontSize: "0.85rem", color: "palevioletred"}}>
								999+
							</span>
							:
							<span style={{fontSize: "0.85rem", color: "darkseagreen"}}>
								{props.postData.reply.length}
							</span>
						}
					</div>
				</div>
			</div>
		</Link>
	);
}

export default UnknownPostRow;