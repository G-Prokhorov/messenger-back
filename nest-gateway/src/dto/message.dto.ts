import {IsArray, IsNumber, IsString} from "class-validator";
import {Type} from "class-transformer";

export class getMessageDto {
    @IsString()
    chatId: string;

    @IsNumber()
    @Type(() => Number)
    start: number;

    _userName_: string;
    _userId_: number;
}

export class markReadDto {
    @IsString()
    chatId: string;

    @IsNumber()
    @Type(() => Number)
    value: number;

    _userName_: string;
    _userId_: number;
}

export class sendPhotoDto {
    @IsString()
    chatId: string;
    files: any;

    _userId_: number;
    _userName_: string;
    _u_name_: string;
}