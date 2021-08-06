import {Body, Controller, Patch, Res} from '@nestjs/common';
import { SettingsService } from './settings.service';
import {changeNameDto, changePasswordDto, restorePasswordDto} from "../dto/settings.dto";
import {ValidationPipe} from "../validation.pipe";
import reqUserInterface from "../interface/reqUser.interface";
import {User} from "../decorator/user.decorator";

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingService: SettingsService) {}

  @Patch('/updateName')
  updateName(@Body(new ValidationPipe()) body: changeNameDto, @User() userInfo: reqUserInterface, @Res() res) {
    return this.settingService.updateName(body, userInfo, res);
  }

  @Patch('/changePassword')
  changePassword(@Body(new ValidationPipe()) bodyChange: changePasswordDto, @User() userInfo: reqUserInterface, @Res() res) {
    return this.settingService.changePassword(bodyChange, userInfo, res);
  }

  @Patch('/restorePassword')
  restorePassword(@Body(new ValidationPipe()) bodyRestore: restorePasswordDto, @Res() res) {
    return this.settingService.restorePassword(bodyRestore, res);
  }
}
