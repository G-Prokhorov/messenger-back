import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageService {
    getMessage(): string {
        return "Get message";
    }

    markRead(): string {
        return "Mark read";
    }

    sendPhoto(): string {
        return "Send photo";
    }
}
