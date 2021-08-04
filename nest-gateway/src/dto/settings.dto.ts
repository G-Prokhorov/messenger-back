import {IsString} from "class-validator";

export class restorePasswordDto {
    @IsString()
    password: string;

    @IsString()
    confirm: string;

    @IsString()
    key: string;

    @IsString()
    email: string;
}
