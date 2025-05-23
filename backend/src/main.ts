import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for REST API
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // Enable cookie parser
  app.use(cookieParser());

  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe());

  // Enable Socket.IO CORS
  app.useWebSocketAdapter(new IoAdapter(app));

  await app.listen(3001);
  console.log('Application is running on: http://localhost:3001');
}
void bootstrap();
