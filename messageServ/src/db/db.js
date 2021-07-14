"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = exports.messageModel = exports.chatModel = exports.userModel = void 0;
const sequelize_1 = require("sequelize");
const user_db_1 = __importDefault(require("./user_db"));
const chat_db_1 = __importDefault(require("./chat_db"));
const message_db_1 = __importDefault(require("./message_db"));
require('dotenv').config();
const sequelize = new sequelize_1.Sequelize(`postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:5432/messenger`);
exports.sequelize = sequelize;
const userModel = user_db_1.default(sequelize);
exports.userModel = userModel;
const chatModel = chat_db_1.default(sequelize);
exports.chatModel = chatModel;
const messageModel = message_db_1.default(sequelize);
exports.messageModel = messageModel;
messageModel.belongsTo(userModel, { foreignKey: "id_sender" });
messageModel.belongsTo(chatModel, { foreignKey: "id_chat" });
//# sourceMappingURL=db.js.map