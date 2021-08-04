export interface getMessageInterface {
    chatId: string,
    start: string,
    _userName_: string,
    _userId_: number,
}

export interface markReadInterface {
    chatId: string,
    value: string,
    _userName_: string,
    _userId_: number,
}

export interface sendPhotoInterface {
    chatId: string;
    files: any;
    _userId_: string;
    _userName_: string;
    _u_name_: string;
}