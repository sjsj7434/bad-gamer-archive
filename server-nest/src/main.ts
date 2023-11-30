import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';

async function bootstrap() {
	let httpsOptions = null; //https를 사용하려면 이 코드를 주석 처리

	// httpsOptions = {
	// 	key: fs.readFileSync('src/private-key.pem'),
	// 	cert: fs.readFileSync('src/public-certificate.pem'),
	// 	passphrase: "test",
	// 	// openssl 인증서 생성 : req -x509 -newkey rsa:4096 -keyout private-key.pem -out public-certificate.pem -days 3650
	// 	// openssl 인증서 passphrase 제거 : rsa -in private-key.pem -out private-key2.pem
	// };

	const app = await NestFactory.create(AppModule, {
		httpsOptions,
	});

	app.use(cookieParser());

	const configService = app.get(ConfigService);
	const serverConfig = configService.get('server');

	app.enableCors({
		origin: true,
		methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
		credentials: true,
	});

	app.useGlobalPipes(
		new ValidationPipe({
			disableErrorMessages: false,
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
			transformOptions: {
				enableImplicitConversion: true,
			},
		}),
	);

	await app.listen(serverConfig.port);

	console.log(`[main.ts] Server is running on ${httpsOptions === null ? "http" : "https"}://localhost:${serverConfig.port}`);
}

bootstrap();