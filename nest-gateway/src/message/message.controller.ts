import {Body, Controller, Get, Post, Put} from '@nestjs/common';
import { MessageService } from './message.service';
import {ValidationPipe} from "../validation.pipe";
import {getMessageDto, markReadDto, sendPhotoDto} from "../dto/message.dto";

@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @Get()
    getMessage(@Body(new ValidationPipe()) getMessageBody: getMessageDto) {
        return this.messageService.getMessage(getMessageBody);
    }

    @Put()
    markRead(@Body(new ValidationPipe()) markReadBody: markReadDto) {
        return this.messageService.markRead(markReadBody);
    }

    @Post("/sendPhoto") 
    sendPhoto(@Body(new ValidationPipe()) sendPhotoBody: sendPhotoDto) {
        return this.messageService.sendPhoto(sendPhotoBody);
    }
}
