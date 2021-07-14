"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
function ChatModel(sequelize) {
    return sequelize.define("chats", {
        id_chat: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        id_user: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        numberOfUnread: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 0,
        },
    });
}
exports.default = ChatModel;
//# sourceMappingURL=chat_db.js.map