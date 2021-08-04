export interface restorePasswordInterface {
    password: string,
    confirm: string,
    key: string,
    email: string,
}

export interface changePasswordInterface {
    _userName_: string,
    oldPass: string,
    password: string,
    confirm: string,
}

export interface changeNameInterface {
    _userId_: string,
    name: string,
}