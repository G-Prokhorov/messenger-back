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

export class changePasswordDto {
    @IsString()
    oldPass: string;

    @IsString()
    password: string;

    @IsString()
    confirm: string;
}

export class changeNameDto {
    @IsString()
    name:string;
}
