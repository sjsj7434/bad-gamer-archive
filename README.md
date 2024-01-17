# 웹 커뮤니티
Nest.js + React(v 18)
<br>
참조한 Repo : <a href="https://github.com/sjsj7434/nestjs-react-boilerplate">nestjs-react-boilerplate</a>

## 폴더 구분
Front-End : client-react
<br>
Back-End : server-nest

## 설치 및 실행
<ol>
	<li>VSCode Terminal을 2개 열기</li>
	<li>1개는 [cd server-nest] 입력하여 해당 디렉토리로 이동</li>
	<li>나머지 1개는 [cd client-react] 입력하여 해당 디렉토리로 이동</li>
	<li>client-react : npm install</li>
	<li>client-react : npm build</li>
	<li>client-react : npm run start</li>
	<li>server-nest : npm install</li>
	<li>server-nest : npm run start:dev</li>
</ol>
<div>
	<p>
		react를 build하였으면 서버의 포트번호로 접속 시 build된 react가 나옴
	</p>
	<p>
		계속하여 바뀔 때마다 build할 필요없이 개발할 때에는 client-react 서버로 확인
	</p>
	<p>
		React .env파일에 서버 주소를 적어서 관리(REACT_APP_SERVER)
	</p>
	<p>
		Nest.js의 main.ts에 CORS를 활성화하는 코드가 있어 다른 도메인에서 API를 호출할 수 있음
	</p>
	<p>
		WYSIWYG 에디터의 이미지 업로드는 기본 simple upload adapter를 사용하여 서버로 전송
	</p>
</div>