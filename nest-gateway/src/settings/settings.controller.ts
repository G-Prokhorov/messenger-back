import {Body, Controller, Put, Res} from '@nestjs/common';
import { SettingsService } from './settings.service';
import {changeNameDto, changePasswordDto, restorePasswordDto} from "../dto/settings.dto";
import {ValidationPipe} from "../validation.pipe";

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingService: SettingsService) {}

  @Put('/updateName')
  updateName(@Body(new ValidationPipe()) body: changeNameDto, @Res() res) {
    return this.settingService.updateName(body, res);
  }

  @Put('/changePassword')
  changePassword(@Body(new ValidationPipe()) bodyChange: changePasswordDto, @Res() res) {
    return this.settingService.changePassword(bodyChange, res);
  }

  @Put('/restorePassword')
  restorePassword(@Body(new ValidationPipe()) bodyRestore: restorePasswordDto, @Res() res) {
    return this.settingService.restorePassword(bodyRestore, res);
  }
}
