import {DataTypes} from "sequelize";

function ChatModel(sequelize:  any) {
    return sequelize.define("chats", {
        id_chat: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        read: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        id_user: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        numberOfUnread: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    });
}

export default ChatModel;