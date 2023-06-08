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
2023-06-07 : 익명 게시글 댓글 삭제 & 댓글 답글 구현 필요
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
- <input type='checkbox'> ckEditor5 게시글 작성 기능(인증 필요없는 자유)
- <input type='checkbox'> ckEditor5 게시글 작성 기능(인증 전용)
- <input type='checkbox'> ckEditor5 게시글 수정 기능?(인증 전용)
- <input type='checkbox'> 연관 게시글 링크 기능?(인증 전용)
- <input type='checkbox'> ckEditor5 게시글 내 이미지 처리
- <input type='checkbox'> 간단한 댓글 작성 기능
- <input type='checkbox'> 본캐 인증 정보 조회(마이페이지)
- <input type='checkbox'> 비밀번호 변경
- <input type='checkbox'> 비밀번호 찾기(초기화, 이메일 사용)
- <input type='checkbox'> 웹서버용 EC2 AWS 구매
- <input type='checkbox'> DB용 EC2 AWS 구매(RDS 너무 비쌈)
- <input type='checkbox'> 이미지서버용 S3 AWS 구매
- <input type='checkbox'> HTTPS 인증서
- <input type='checkbox'> 관리자 페이지(밴, 게시글 삭제...)
- <input type='checkbox'> 관리자 페이지는 Django(Python)를 써볼까?
- <input type='checkbox'> 관리자 페이지는 Strapi(JS)를 써볼까?

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