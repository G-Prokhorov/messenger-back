import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import {sanitizeMiddleware} from "./Middleware/sanitize.middleware";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(sanitizeMiddleware)
  process.on("uncaughtException", (err) => console.error(err))
  await app.listen(3000);
}
bootstrap();
