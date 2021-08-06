import {Body, Controller, Get, Post, Res} from '@nestjs/common';
import { ChatService } from './chat.service';
import {createChatDto, getChatDto} from "../dto/chat.dto";

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Get()
    getChat(@Body() getChatBody: getChatDto, @Res() res) {
        return this.chatService.getChat(getChatBody, res);
    }

    @Post()
    createChat(@Body() createChatBody: createChatDto, @Res() res) {
        return this.chatService.createChat(createChatBody, res);
    }
}
