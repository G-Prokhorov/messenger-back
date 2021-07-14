"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const findUser_1 = __importDefault(require("../db/findUser"));
const give_1 = __importDefault(require("./give"));
function checkTokens(token, refresh) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let decode = jsonwebtoken_1.default.verify(token, process.env.TOKEN);
            let check = yield findUser_1.default(decode.username);
            if (!check) {
                throw new Error("User not exist");
            }
            return [null, decode.username, check.id, check.name, check.email];
        }
        catch (e) {
            if (e.message === "User not exist") {
                throw e;
            }
            try {
                let decode = jsonwebtoken_1.default.verify(refresh, process.env.REFRESH_TOKEN);
                let check = yield findUser_1.default(decode.username);
                if (!check) {
                    throw new Error("User not exist");
                }
                return [yield give_1.default(decode.username), decode.username, check.id, check.name, check.email];
            }
            catch (e) {
                throw new Error(e.message === "User not exist" ? "User not exist" : "Token isn't valid");
            }
        }
    });
}
exports.default = checkTokens;
//# sourceMappingURL=checkTokens.js.map