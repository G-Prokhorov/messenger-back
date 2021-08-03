import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { measureMemory } from 'vm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import { AuthMiddleware } from './Middleware/auth.middleware';
import { SettingsModule } from './settings/settings.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [AuthModule, ChatModule, MessageModule, SettingsModule, ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true,
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(AuthMiddleware)
    .exclude("settings/restorePassword", "/", "auth/(.*)")
    .forRoutes("/");
  }
}
