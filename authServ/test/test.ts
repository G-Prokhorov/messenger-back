import changePassword from "../src/auth/changePassword";
import { expect } from 'chai';

describe('Authentication test', () => {
    it('bad request check', async () => {
        try {
            //@ts-ignore
            await changePassword()
        } catch (err) {
            expect(err.message).to.be.equal("Bad request");
        }
    });

    it('checking if the old and new passwords match', async () => {
        try {
            await changePassword({
                username: "test",
                oldPass: "test",
                password: "test",
                confirm: "test",
            })
        } catch (err) {
            expect(err.message).to.be.equal("Old and new password cannot match");
        }
    });

    it('new password check min length', async () => {
        try {
            //@ts-ignore
            await changePassword({
                username: "test",
                oldPass: "test",
                password: "12345",
                confirm: "12345",
            });
        } catch (err) {
            expect(err.message).to.be.equal("Password does not meet the requirement");
        }
    });

    it('new password check max length', async () => {
        try {
            //@ts-ignore
            await changePassword({
                username: "test",
                oldPass: "111111",
                password: "123456789012345678901234567890123456789012345678901",
                confirm: "123456789012345678901234567890123456789012345678901",
            });
        } catch (err) {
            expect(err.message).to.be.equal("Password does not meet the requirement");
        }
    });

    it('checking if new passwords match', async () => {
        try {
            //@ts-ignore
            await changePassword({
                username: "test",
                oldPass: "111111",
                password: "qwerty",
                confirm: "qwertY",
            });
        } catch (err) {
            expect(err.message).to.be.equal("Password does not meet the requirement");
        }
    });

    it('checking if a user exists', async () => {
        try {
            await changePassword({
                username: "test",
                oldPass: "123456",
                password: "qwerty",
                confirm: "qwerty",
            })
        } catch (err) {
            expect(err.message).to.be.equal("User not found");
        }
    });

    it('incorrect password check', async () => {
        try {
            await changePassword({
                username: "@pixel",
                oldPass: "123456",
                password: "qwerty",
                confirm: "qwerty",
            })
        } catch (err) {
            expect(err.message).to.be.equal("Incorrect password");
        }
    });
})
