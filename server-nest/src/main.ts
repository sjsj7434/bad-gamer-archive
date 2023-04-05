import { NestFactory } from '@nestjs/core';
import { AppModule } from './lostark/app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const configService = app.get(ConfigService);
	const serverConfig = configService.get('server');
	const databaseConfig = configService.get('database');

	app.enableCors({
		origin: true,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		credentials: true,
	});

	await app.listen(serverConfig.port);

	console.log(`[main.ts] Server is running on http://localhost:${serverConfig.port}`);
	console.log(databaseConfig);
}

bootstrap();