export interface getChatInterface {
    _userName_: string,
    _userId_: string,
}

export interface createChatInterface {
    _userName_: string,
    users: Array<string>,
}