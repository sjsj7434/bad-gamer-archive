
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';

const UsefulSitesLostark = () => {
	const usefulSiteData = [
		{ group: "official", name: "공식 홈페이지", url: "https://lostark.game.onstove.com/", usage: "공식 홈페이지", function: "-" },

		{ group: "info", name: "iloa", url: "https://iloa.gg/", usage: "종합 정보사이트", function: "전투정보실|길드정보" },
		{ group: "info", name: "loawa", url: "https://loawa.com/", usage: "종합 정보사이트", function: "전투정보실|길드정보" },
		{ group: "info", name: "kloa", url: "https://kloa.gg/", usage: "종합 정보사이트", function: "전투정보실|길드정보|떠돌이상인" },
		{ group: "info", name: "loagg", url: "https://loagg.com/", usage: "종합 정보사이트", function: "전투정보실|길드정보" },

		{ group: "community", name: "inven", url: "https://lostark.inven.co.kr/", usage: "커뮤니티, 종합 정보사이트", function: "-" },
		{ group: "community", name: "dcinside", url: "https://gall.dcinside.com/board/lists/?id=lostark", usage: "커뮤니티", function: "-" },
		{ group: "community", name: "fmkorea", url: "https://www.fmkorea.com/lostark", usage: "커뮤니티", function: "-" },
		{ group: "community", name: "theqoo", url: "https://theqoo.net/index.php?mid=lostark&filter_mode=normal", usage: "커뮤니티", function: "-" },
		{ group: "community", name: "arca live", url: "https://arca.live/b/lostark", usage: "커뮤니티", function: "-" },
		{ group: "community", name: "ruliweb", url: "https://bbs.ruliweb.com/family/4659", usage: "커뮤니티", function: "-" },
		{ group: "community", name: "reddit", url: "https://www.reddit.com/r/lostarkgame/", usage: "커뮤니티(해외)", function: "-" },
		
		{ group: "tools", name: "icepeng", url: "https://loa.icepeng.com/", usage: "도구모음", function: "각인 계산기|최저가 악세사리 세팅|어빌리티스톤 세공 도우미(돌파고)" },
		{ group: "tools", name: "loatool", url: "https://loatool.taeu.kr/", usage: "도구모음", function: "-" },
		{ group: "tools", name: "cam-loa", url: "https://cam-loa.com/", usage: "도구모음", function: "-" },
		{ group: "tools", name: "loachart", url: "https://loachart.com/", usage: "도구모음", function: "-" },
		{ group: "tools", name: "smtool", url: "https://smtool.app/", usage: "도구모음", function: "-" },
		{ group: "tools", name: "sasage", url: "https://사사게검색기.com/", usage: "사건사고 게시판", function: "사건사고 게시판 검색" },
	];

	const officialSVG = (
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" className="bi bi-check-circle" viewBox="0 0 16 16">
			<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
			<path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
		</svg>
	);

	const infoSVG = (
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="steelblue" className="bi bi-info-circle" viewBox="0 0 16 16">
			<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
			<path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
		</svg>
	);

	const communitySVG = (
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray" className="bi bi-postcard" viewBox="0 0 16 16">
			<path fillRule="evenodd" d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2ZM1 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4Zm7.5.5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7ZM2 5.5a.5.5 0 0 1 .5-.5H6a.5.5 0 0 1 0 1H2.5a.5.5 0 0 1-.5-.5Zm0 2a.5.5 0 0 1 .5-.5H6a.5.5 0 0 1 0 1H2.5a.5.5 0 0 1-.5-.5Zm0 2a.5.5 0 0 1 .5-.5H6a.5.5 0 0 1 0 1H2.5a.5.5 0 0 1-.5-.5ZM10.5 5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3ZM13 8h-2V6h2v2Z"/>
		</svg>
	);

	const toolsSVG = (
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="orange" className="bi bi-gear" viewBox="0 0 16 16">
			<path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
			<path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
		</svg>
	);

	const usefulSiteRender = usefulSiteData.map((site, index) => {
		let thisSVG = null;

		if(site.group === "official"){
			thisSVG = officialSVG;
		}
		else if(site.group === "info"){
			thisSVG = infoSVG;
		}
		else if(site.group === "community"){
			thisSVG = communitySVG;
		}
		else if(site.group === "tools"){
			thisSVG = toolsSVG;
		}

		return (
			<tr key={site.name + index}>
				<td style={{textAlign: "center"}}>
					{index + 1}
				</td>
				<td style={{textAlign: "left"}}>
					{thisSVG}
					<a target="_blank" href={site.url} style={{marginLeft: "5px"}} rel="noreferrer">
						{site.name}
					</a>
				</td>
				<td style={{textAlign: "left"}}>
					<strong>{site.usage}</strong>
					<br/>
					<span style={{color: "gray"}}>{site.function.replace(/\|/g, ", ")}</span>
				</td>
			</tr>
		);
	})

	return (
		<Container style={{maxWidth: "1000px", fontSize: "0.87rem"}}>
			<Table striped bordered hover>
				<colgroup>
					<col width="5%" />
					<col width="35%" />
					<col width="" />
				</colgroup>
				<thead>
					<tr style={{textAlign: "center"}}>
						<th>#</th>
						<th>이름</th>
						<th>용도</th>
					</tr>
				</thead>
				<tbody>
					{usefulSiteRender}
				</tbody>
			</Table>
		</Container>
	);
}

export default UsefulSitesLostark;