import {IsString} from "class-validator";

export class getMessageDto {
    @IsString()
    chatId: string;

    @IsString()
    start: string;

    _userName_: string;
    _userId_: number;
}

export class markReadDto {
    @IsString()
    chatId: string;

    @IsString()
    value: string;

    _userName_: string;
    _userId_: number;
}

export class sendPhotoDto {
    @IsString()
    chatId: string;
    files: any;

    _userId_: string;
    _userName_: string;
    _u_name_: string;
}