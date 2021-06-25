import {Sequelize} from "sequelize";

const db = new Sequelize(`postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:5432/messenger`);

export default db;