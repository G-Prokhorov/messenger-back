import {Body, Controller, Get, Post, Put, Res} from '@nestjs/common';
import { MessageService } from './message.service';
import {ValidationPipe} from "../validation.pipe";
import {getMessageDto, markReadDto, sendPhotoDto} from "../dto/message.dto";

@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @Get()
    getMessage(@Body(new ValidationPipe()) getMessageBody: getMessageDto, @Res() res) {
        return this.messageService.getMessage(getMessageBody, res);
    }

    @Put()
    markRead(@Body(new ValidationPipe()) markReadBody: markReadDto, @Res() res) {
        return this.messageService.markRead(markReadBody, res);
    }

    @Post("/sendPhoto") 
    sendPhoto(@Body(new ValidationPipe()) sendPhotoBody: sendPhotoDto) {
        return this.messageService.sendPhoto(sendPhotoBody);
    }
}
