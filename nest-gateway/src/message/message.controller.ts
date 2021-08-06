import {Body, Controller, Patch, Post, Res, UploadedFiles, UseInterceptors} from '@nestjs/common';
import { MessageService } from './message.service';
import {ValidationPipe} from "../validation.pipe";
import {getMessageDto, markReadDto, sendPhotoDto} from "../dto/message.dto";
import {AnyFilesInterceptor, FileInterceptor} from "@nestjs/platform-express";
import * as multer from "multer";
import reqUserInterface from "../interface/reqUser.interface";
import {User} from "../decorator/user.decorator";

@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @Post()
    getMessage(@Body(new ValidationPipe()) getMessageBody: getMessageDto,
               @User() userInfo: reqUserInterface, @Res() res) {
        return this.messageService.getMessage(getMessageBody, userInfo, res);
    }

    @Patch()
    markRead(@Body(new ValidationPipe()) markReadBody: markReadDto,
             @User() userInfo: reqUserInterface, @Res() res,) {
        return this.messageService.markRead(markReadBody, userInfo, res);
    }

    @Post("/sendPhoto")
    @UseInterceptors(AnyFilesInterceptor({
        storage: multer.memoryStorage(),
        limits: {fileSize: 5000000000000000000000000000000}
    }))
    sendPhoto(@UploadedFiles() files: Array<Express.Multer.File>,
              @Body(new ValidationPipe()) sendPhotoBody: sendPhotoDto,
              @User() userInfo: reqUserInterface, @Res() res) {
        return this.messageService.sendPhoto(sendPhotoBody, userInfo, files, res);
    }
}
