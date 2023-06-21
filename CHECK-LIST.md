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
2023-06-19 : 로스피 쌀먹 그래프 추가해볼까?
2023-06-20 : 비밀번호 찾기 기능(초기화하여 초기화 비번 메일 전송)
2023-06-21 : 소셜 로그인?
```

```
[실행 순서]
cd server-nest
npm run start:dev

cd client-react
npm run start
```

## 기능 목록
- <input type='checkbox' checked> 본캐 인증 절차 수립(공홈)
- <input type='checkbox' checked> 회원가입
- <input type='checkbox' checked> 회원 비밀번호 암호화
- <input type='checkbox' checked> 로그인 구현
- <input type='checkbox' checked> 회원가입 후, 본캐 인증
- <input type='checkbox' checked> 댓글 작성 기능
- <input type='checkbox' checked> ckEditor5 게시글 작성 기능(인증 필요없는 자유)
- <input type='checkbox' checked> ckEditor5 게시글 수정 기능(인증 필요없는 자유)
- <input type='checkbox'> 가입할 때 이메일 인증? 아니면 가입하고 나서 인증?
- <input type='checkbox'> 마이페이지 비밀번호 변경(기존 비밀번호 입력 후 변경)
- <input type='checkbox'> 마이페이지 본캐 인증 정보 조회
- <input type='checkbox'> 마이페이지 본캐 인증 정보 업데이트
- <input type='checkbox'> 마이페이지 본캐 인증 정보 캐릭 변경
- <input type='checkbox'> AWS SES(이메일 발송) 도입
- <input type='checkbox'> 비밀번호 찾기(비번 초기화, 인증은 이메일 사용)
- <input type='checkbox'> AWS S3(이미지서버) 도입
- <input type='checkbox'> ckEditor5 게시글 내 이미지 처리
- <input type='checkbox'> ckEditor5 게시글 작성 기능(인증 전용)
- <input type='checkbox'> ckEditor5 게시글 수정 기능(인증 전용)
- <input type='checkbox'> AWS EC2(웹서버) 도입
- <input type='checkbox'> AWS EC2(DB) 도입(RDS 너무 비쌈)
- <input type='checkbox'> HTTPS 인증서
- <input type='checkbox'> 관리자 페이지(밴, 게시글 삭제...)
- <input type='checkbox'> 관리자 페이지는 Django(Python)를 써볼까?
- <input type='checkbox'> 관리자 페이지는 Strapi(JS)를 써볼까?
- <input type='checkbox'> 게시글 작성자 IP차단 & 아이디 차단 기능(회원 전용)
- <input type='checkbox'> Rate Limiting, protect applications from brute-force attacks

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