import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import { AuthMiddleware } from './Middleware/auth.middleware';
import { SettingsModule } from './settings/settings.module';
import { ConfigModule } from '@nestjs/config';
import {ServeStaticModule} from "@nestjs/serve-static";
import { join } from 'path';

@Module({
  imports: [AuthModule, ChatModule, MessageModule, SettingsModule, ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true,
  }), ServeStaticModule.forRoot({
    rootPath: join(__dirname, "..", "public"),
  }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(AuthMiddleware)
    .exclude("settings/restorePassword", "/")
    .forRoutes("message/(.*)", "settings/(.*)", "checkTokens", "logout", "chat/(.*)", "chat", "message");
  }
}
