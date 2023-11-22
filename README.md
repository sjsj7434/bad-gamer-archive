# bad-gamer-archive
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

[2023-11-20 서버 생성 일지]
아마존 EC2 linux t4.nano로 임시 생성

client-react\.env.development : 파일 서버 IP 넣기
server-nest\.dev.env : DATABASE_PASSWORD 넣기

* Amazon EC2 인스턴스에서 Node.js 설정
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
. ~/.nvm/nvm.sh
nvm install --lts
node -e "console.log('Running Node.js ' + process.version)"

sudo yum install nginx
sudo service nginx start

sudo yum install https://dev.mysql.com/get/mysql80-community-release-el9-1.noarch.rpm
sudo yum -y install mysql-community-server
mysql --version
sudo systemctl start mysqld
sudo systemctl status mysqld
sudo cat /var/log/mysqld.log | grep 'temporary password'
mysql -u root -p
alter user 'root'@'localhost' identified with mysql_native_password by '비밀번호';
CREATE DATABASE game_agora;
grant all privileges on *.* to 'root'@'%' with grant option;
create user 'home_user'@'%' identified by 'Tkdwns27381!';
GRANT ALL PRIVILEGES ON game_agora.* TO 'home_user'@'%';
권한 부여 후 연결 껐다가 켜야 권한 적용됨

sudo yum install git

cd ~/.ssh
ssh-keygen -t rsa -C sjsj7434@naver.com
그냥 다 엔터

cat id_rsa.pub
이 내용 복사해서 github애 ssh 키 생성

mkdir my_projects
디렉토리 하나 새로 생성해서 거기에 clone
cd my_projects
git clone git@github.com:sjsj7434/game-agora.git
yes 라고 치고 엔터

cd ~/my_projects/game-agora/client-react
npm install
npm run build

cd ~/my_projects/game-agora/server-nest
npm install
npm run start