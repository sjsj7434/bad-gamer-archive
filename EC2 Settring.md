[2023-11-20 서버 생성 일지]

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

EC2 Ubuntu 22.04
기본 로그인 계정은 ubuntu

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
. ~/.nvm/nvm.sh
nvm install --lts
node -e "console.log('Running Node.js ' + process.version)"

sudo apt update
sudo apt install nginx
systemctl status nginx
sudo systemctl stop nginx
sudo systemctl start nginx
sudo systemctl restart nginx


--nginx 프록시 설정
sudo vi /etc/nginx/sites-available/nest-server

server{
	listen 80;
	server_name localhost;
	location / {
		proxy_pass http://127.0.0.1:3000;
	}
}

sudo ln -s /etc/nginx/sites-available/node-server /etc/nginx/sites-enabled/
sudo systemctl restart nginx



sudo apt install mysql-server
mysql --version
sudo systemctl status mysql
sudo mysql -u root -p
alter user 'root'@'localhost' identified with mysql_native_password by 'my_password_HERE!';
CREATE DATABASE game_agora;
grant all privileges on *.* to 'root'@'%' with grant option;
create user 'home_user'@'%' identified by 'my_password_HERE!';
GRANT ALL PRIVILEGES ON game_agora.* TO 'home_user'@'%';

sudo vi /etc/mysql//mysql.conf.d/mysqld.cnf
sudo /etc/init.d/mysql restart


https://s55ma.radioamater.si/2023/05/30/ubuntu-22-04-install-puppeteer/

apt update -y && apt upgrade -y
apt install -y npm
apt install -y libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxi-dev libxtst-dev libnss3 libcups2 libxss1 libxrandr2 libasound2 libatk1.0-0 libatk-bridge2.0-0 libpangocairo-1.0-0 libgtk-3-0 libgbm1
npm install -g n
n lts
hash -r
npm install puppeteer
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
apt install ./google-chrome-stable_current_amd64.deb
권한 부여 후 연결 껐다가 켜야 권한 적용됨


sudo find / -name nginx.conf
/etc/nginx/nginx.conf


sudo yum install git

cd ~/.ssh
ssh-keygen -t rsa -C sjsj7434@naver.com
그냥 다 엔터

cat id_rsa.pub
이 내용 복사해서 github애 ssh 키 생성

mkdir my_project
디렉토리 하나 새로 생성해서 거기에 clone
cd my_project
git clone git@github.com:sjsj7434/game-agora.git
yes 라고 치고 엔터

cd ~/my_project/game-agora/client-react
npm install
npm run build

cd ~/my_project/game-agora/server-nest
npm install
npm run start