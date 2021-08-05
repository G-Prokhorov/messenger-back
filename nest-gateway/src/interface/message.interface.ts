export interface getMessageInterface {
    chatId: string,
    start: number,
    _userName_: string,
    _userId_: number,
}

export interface markReadInterface {
    chatId: string,
    value: number,
    _userName_: string,
    _userId_: number,
}

export interface sendPhotoInterface {
    chatId: string;
    files: Array<any>;
    _userId_: number;
    _userName_: string;
    _u_name_: string;
}