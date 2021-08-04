import {Body, Controller, Get, Post} from '@nestjs/common';
import { ChatService } from './chat.service';
import {createChatDto, getChatDto} from "../dto/chat.dto";
import {ValidationPipe} from "../validation.pipe";

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Get()
    getChat(@Body() getChatBody: getChatDto) {
        return this.chatService.getChat(getChatBody);
    }

    @Post()
    createChat(@Body() createChatBody: createChatDto) {
        return this.chatService.createChat(createChatBody);
    }
}
