import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  console.log('Server initialized');
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CLIENT_BASE_URL,
    credentials: true,
  });
  app.use(cookieParser());

  await app.listen(3000);
}
bootstrap();
