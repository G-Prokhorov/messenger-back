import {Sequelize} from "sequelize";
import User from "./user_db";
import Chat from "./chat_db";
import Messages from "./message_db";

require('dotenv').config();

const sequelize = new Sequelize(`postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:5432/messenger`);

const userModel = User(sequelize);
const chatModel = Chat(sequelize);
const messageModel = Messages(sequelize);
messageModel.belongsTo(userModel, {foreignKey: "id_sender"});

export {
    userModel,
    chatModel,
    messageModel,
    sequelize
};