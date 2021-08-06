import {IsArray, IsNumber, IsString} from "class-validator";
import {Type} from "class-transformer";

export class getMessageDto {
    @IsString()
    chatId: string;

    @IsNumber()
    @Type(() => Number)
    start: number;
}

export class markReadDto {
    @IsString()
    chatId: string;

    @IsNumber()
    @Type(() => Number)
    value: number;
}

export class sendPhotoDto {
    @IsString()
    chatId: string;
}