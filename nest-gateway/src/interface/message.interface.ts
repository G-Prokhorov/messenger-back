export interface getMessageInterface {
    chatId: string,
    start: number,
}

export interface markReadInterface {
    chatId: string,
    value: number,
}

export interface sendPhotoInterface {
    chatId: string;
}