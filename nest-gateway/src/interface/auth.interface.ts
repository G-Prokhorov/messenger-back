export interface sendCodeInterface {
    email: string,
}

export interface loginInterface {
    username: string,
    password: string,
}

export interface registerInterface {
    username: string,
    password: string,
    confirm: string,
    email: string,
    key: string,
}