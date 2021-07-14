"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
function UserModel(sequelize) {
    return sequelize.define("users", {
        username: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        password: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        name: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            defaultValue: 'Anonymous',
        },
        email: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        }
    });
}
exports.default = UserModel;
//# sourceMappingURL=user_db.js.map