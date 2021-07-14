"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
function MessagesModel(sequelize) {
    return sequelize.define("messages", {
        message: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        id_sender: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        id_chat: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        img: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
        },
    });
}
exports.default = MessagesModel;
//# sourceMappingURL=message_db.js.map