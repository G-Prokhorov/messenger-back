export interface restorePasswordInterface {
    password: string,
    confirm: string,
    key: string,
    email: string,
}

export interface changePasswordInterface {
    oldPass: string,
    password: string,
    confirm: string,
}

export interface changeNameInterface {
    name: string,
}