import {DataTypes} from "sequelize";
import db from "./db";

const User = db.define("users", {
    username: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: 'Anonymous',
    },
});

export default User;