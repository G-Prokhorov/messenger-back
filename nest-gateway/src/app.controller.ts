import {Controller, Get, Query, Res} from '@nestjs/common';
import { AppService } from './app.service';
import {checkTokensDto} from "./dto/app.dto";
import {User} from "./decorator/user.decorator";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getFront(@Res() res) {
    return this.appService.getFront(res);
  }

  @Get('/checkUser')
  checkUser(@Query('username') username: string): Promise<string> {
    return this.appService.checkUser(username);
  }

  @Get('/checkTokens')
  checkToken(@User() bodyCheckTokens: checkTokensDto) {
    return this.appService.checkTokens(bodyCheckTokens);
  }

  @Get('/logout')
  logout(@Res() res) {
    return this.appService.logout(res);
  }
}
