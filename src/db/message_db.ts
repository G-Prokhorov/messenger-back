import {DataTypes} from "sequelize";

export default function MessagesModel(sequelize: any) {
    return sequelize.define("messages", {
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        id_sender: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        id_chat: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        img: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    })
}