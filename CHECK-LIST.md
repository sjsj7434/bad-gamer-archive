<p align="center">
	<img src="https://cdn-icons-png.flaticon.com/512/1211/1211612.png" width="150" alt="check-list" />
</p>

<p align="center">
	<b style="font-size: 22px">사이트 기능 구현 체크 리스트</b>
	<br>
	<span style="font-size: 15px">2023-04-08 ver</span>
</p>

```
[할 일 목록]
2023-05-25 : 익명 게시판 View, Pagination 입력값 예외처리, Get 방식이기 때문에 원치 않는 값이 들어올 수 있음
2023-05-26 : URL 라우팅 고도화 필요
2023-06-13 : fetch 400 error, bad request 처리 필요
2023-06-15 : 캐릭터 정보 가져올 때 API와 이름 맞추기
2023-06-15 : 캐릭터 정보 가져올 때 API, Scrap 2개 버전 따로 분리하기
2023-06-16 : 캐릭터 정보 가져올 때 레벨도 가져올 수 있도록 수정 필요
2023-06-16 : 캐릭터 정보 가져올 때 클래스도 가져올 수 있도록 수정 필요
2023-06-16 : 캐릭터 정보 가져올 때 API와 이름 맞추기
2023-06-20 : 비밀번호 찾기 기능(초기화하여 초기화 비번 메일 전송)
2023-07-30 : 가입할 때 이메일 & ID
2023-09-04 : 유저 게시판 등록할 때 ID 닉네임, 익명 게시판은 필요 없으니 빈 값 넣어주기
2023-09-14 : 개발자도구 네트워크 탭에서 해당 댓글 생성 요청을 fetch 복사하여 수정하면 로그인하지 않고 유저 게시판에 댓글 등록 가능한 오류 발생 중
2023-10-10 : 개발자도구 네트워크 탭에서 해당 댓글 생성 요청을 fetch 복사하여 수정하면 임의로 인증 정보 수정하여 인증 진행 가능한 오류
```

## 초기 실행(설치) 순서
```bash
cd server-nest
npm install

cd client-react
npm install

[CK Editor5 설치 방법] 실행

server-nest\.dev.env 파일 내용 수정
```

## 실행 순서
```bash
cd server-nest
npm run start:dev

cd client-react
npm run start
```

## CK Editor5 설치 방법
```bash
0. npm install --save @ckeditor/ckeditor5-react @ckeditor/ckeditor5-build-classic
1. 공식 사이트 방문해서 다운로드 (https://ckeditor.com/ckeditor-5/online-builder/)
2. react root 폴더에 ckeditor 폴더 넣기 (https://stackoverflow.com/questions/62243323/reactjs-import-ckeditor-5-from-online-build)
3. npm add file:./ckeditor5
4. 공식 문서 따라서 소스에 import 후 사용
```

## 기능 목록
- <input type='checkbox' checked> 가입할 때 이메일을 받지만 인증은 하지 않음
- <input type='checkbox' checked> 마이페이지 비밀번호 변경(기존 비밀번호 입력 후 변경)
- <input type='checkbox' checked> 마이페이지 본캐 인증 정보 업데이트
- <input type='checkbox' checked> 마이페이지 본캐 인증 정보 캐릭 변경
- <input type='checkbox' checked> react에 프록시 설정하니까 서버랑 통신이 느려진 느낌이 있음 / build된 환경은 빠른 듯?
- <input type='checkbox' checked> 서버에 배포하면 배포된 웹에서는 로그인이 되지 않음, security cookie 문제였음
- <input type='checkbox' checked> ckEditor5 Media embed 추가 / https://ckeditor.com/docs/ckeditor5/latest/features/media-embed.html
- <input type='checkbox'> 게시글 신고 기능
- <input type='checkbox'> 자기소개 및 인장 시스템
- <input type='checkbox'> 게시글 작성자 IP차단 & 아이디 차단 기능(회원 전용)
- <input type='checkbox'> 직업 게시판 > 소유한 캐릭터(1500 이상) 없으면 글 작성 불가능
- <input type='checkbox'> AWS SES(이메일 발송) 도입
- <input type='checkbox'> 비밀번호 찾기(비번 초기화, 인증은 이메일 사용)
- <input type='checkbox'> AWS S3(이미지서버) 도입
- <input type='checkbox'> ckEditor5 게시글 내 이미지 처리
- <input type='checkbox'> AWS EC2(웹서버) 도입
- <input type='checkbox'> AWS EC2(DB) 도입(RDS 너무 비쌈)
- <input type='checkbox'> HTTPS 인증서
- <input type='checkbox'> 관리자 페이지(밴, 게시글 삭제...)
- <input type='checkbox'> 관리자 페이지는 Django(Python)를 써볼까?
- <input type='checkbox'> 관리자 페이지는 Strapi(JS)를 써볼까?
- <input type='checkbox'> 관리자 페이지는 AdminJS(JS)를 써볼까?
- <input type='checkbox'> 인증 서버별로 Popcat 게임 추가
- <input type='checkbox'> 로스피 쌀먹 그래프 추가해볼까?
- <input type='checkbox'> 소셜 로그인?
- <input type='checkbox'> 컨텐츠 별점 메기기(레벨 및 서버)

## 본캐 인증 절차(유저)
```bash
본인 스토브 계정에 로그인
본인 캐릭터 아이콘 클릭 > 아이디 클릭해서 페이지 진입
톱니바퀴(설정) 버튼 눌러서 설정 페이지 진입
[소개]란에 제공 받은 코드 입력 후 저장
본인 스토브 주소 복사해서 제출하면 인증 완료
```
## 본캐 인증 절차(서버)
```bash
웹 스크래핑 기술 필요
캐릭터 정보 가져오는 곳 : https://lostark.game.onstove.com/Board/GetExpandInfo?memberNo=12345678
```