import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
    getChat(): string {
        return "Get chat";
    }

    createChat(): string {
        return "Create chat";
    }
}
