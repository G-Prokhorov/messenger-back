import { Controller, Get, Post, Put } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @Get()
    getMessage():string {
        return this.messageService.getMessage();
    }

    @Put()
    markRead():string {
        return this.messageService.markRead();
    }

    @Post("/sendPhoto") 
    sendPhoto():string {
        return this.messageService.sendPhoto();
    }
}
