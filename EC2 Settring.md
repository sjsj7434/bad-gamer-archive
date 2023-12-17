<div>
	<h1>[2023-12-17 서버 생성 일지]</h1>
	<pre>
		EC2 Ubuntu 22.04 / t3a.small 생성, micro는 써봤는데 진짜 너무 느림
		기본 로그인 계정은 ubuntu
		--------------------------------------------------------
		EC2 인스턴스 포트 보안그룹 설정해야 접근 가능하니 잊지말 것
		아직 설정 단계라 Git으로 하는 것보다 파일질라가 더 간편함
		인스턴스 생성 시에 사용하는 키는 기존에 생성한 game-agora키를 사용하면 편함
	</pre>
</div>

<div>
	<h1>Ubuntu 22.04에 Node.js 최신 버전 설치</h1>
	<pre>
		curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
		. ~/.nvm/nvm.sh
		nvm install --lts
		node -e "console.log('Running Node.js ' + process.version)"
	</pre>
</div>

<div>
	<h1>Ubuntu 22.04에 NginX 설치</h1>
	<pre>
		sudo apt update
		sudo apt install nginx
		systemctl status nginx
		sudo systemctl stop nginx
		sudo systemctl start nginx
		sudo systemctl restart nginx
	</pre>
</div>

<div>
	<h1>NginX 프록시 설정</h1>
	<pre>
		sudo vi /etc/nginx/sites-available/nest-server
		--------------------------------------------------------
			[입력할 내용]
			server{
				listen 80;
				server_name localhost;
				location / {
					proxy_pass http://127.0.0.1:3000;
				}
			}
		--------------------------------------------------------
		sudo ln -s /etc/nginx/sites-available/node-server /etc/nginx/sites-enabled/
		sudo systemctl restart nginx
	</pre>
</div>

<div>
	<h1>Ubuntu 22.04에 mysql 설치</h1>
	<pre>
		[설치 명령어]
		sudo apt install mysql-server
		mysql --version
		sudo systemctl status mysql
		sudo mysql -u root -p
	</pre>
	<pre>
		[유저 생성 및 비번 설정]
		alter user 'root'@'localhost' identified with mysql_native_password by 'my_password_HERE!';
		CREATE DATABASE game_agora;
		grant all privileges on *.* to 'root'@'%' with grant option;
		create user 'home_user'@'%' identified by 'my_password_HERE!';
		GRANT ALL PRIVILEGES ON game_agora.* TO 'home_user'@'%';
	</pre>
	<pre>
		[외부 접속 허용하기]
		sudo vi /etc/mysql//mysql.conf.d/mysqld.cnf
		bind-address = 127.0.0.1을 주석처리
		sudo /etc/init.d/mysql restart
	</pre>
</div>

<div>
	<h1>NginX 프록시 설정</h1>
	<a href="https://s55ma.radioamater.si/2023/05/30/ubuntu-22-04-install-puppeteer/">https://s55ma.radioamater.si/2023/05/30/ubuntu-22-04-install-puppeteer/</a>
	<pre>
		apt update -y && apt upgrade -y
		apt install -y npm
		apt install -y libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxi-dev libxtst-dev libnss3 libcups2 libxss1 libxrandr2 libasound2 libatk1.0-0 libatk-bridge2.0-0 libpangocairo-1.0-0 libgtk-3-0 libgbm1
		npm install -g n
		n lts
		hash -r
		npm install puppeteer
		wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
		apt install ./google-chrome-stable_current_amd64.deb
	</pre>
</div>

<div>
	<h1>그 외 설정</h1>
	<pre>
		sudo yum install git
		--------------------------------------------------------
		cd ~/.ssh
		ssh-keygen -t rsa -C sjsj7434@naver.com
		그냥 다 엔터
		--------------------------------------------------------
		cat id_rsa.pub
		이 내용 복사해서 github애 ssh 키 생성
		--------------------------------------------------------
		mkdir my_project
		디렉토리 하나 새로 생성해서 거기에 clone
		cd my_project
		git clone git@github.com:sjsj7434/game-agora.git
		yes 라고 치고 엔터
		--------------------------------------------------------
		cd ~/my_project/game-agora/client-react
		npm install
		npm run build
		--------------------------------------------------------
		cd ~/my_project/game-agora/server-nest
		npm install
		npm run start
	</pre>
</div>