import bcrypt from "bcrypt";

const saltRounds = 10;

export default async function cryptPassword(password: string) {
    const salt = await bcrypt.genSalt(saltRounds);
    return  await bcrypt.hash(password, salt);
}