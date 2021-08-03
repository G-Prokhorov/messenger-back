import { Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getFront(): string {
    return this.appService.getFront();
  }

  @Get("/checkUser")
  checkUser(@Query('username') username: string): string {
    return this.appService.checkUser(username);
  }

  @Get("/checkTokens")
  checkToken(): string {
    return this.appService.checkTokens();
  }

  @Get("/logout")
  logout(): string {
    return this.appService.logout();
  }
}
