import {Sequelize} from "sequelize";
import User from "./user_db";

const sequelize = new Sequelize(`postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:5432/messenger`);

export const userModel = User(sequelize);

// sequelize.sync({ force: true })
//     .then(() => {
//         console.log(`Database & tables created!`)
//     });

export default {
    userModel
};