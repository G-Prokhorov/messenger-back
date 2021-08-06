import {Body, Controller, Get, Post, Res} from '@nestjs/common';
import { ChatService } from './chat.service';
import {createChatDto} from "../dto/chat.dto";
import reqUserInterface from "../interface/reqUser.interface";
import {User} from "../decorator/user.decorator";

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Get()
    getChat(@User() userInfo: reqUserInterface, @Res() res) {
        return this.chatService.getChat(userInfo, res);
    }

    @Post()
    createChat(@Body() createChatBody: createChatDto, @User() userInfo: reqUserInterface, @Res() res) {
        return this.chatService.createChat(createChatBody, userInfo, res);
    }
}
