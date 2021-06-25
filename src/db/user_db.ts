import {DataTypes, Sequelize} from "sequelize";


function UserModel() {
    const sequelize = new Sequelize(`postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:5432/messenger`);

    return sequelize.define("users", {
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
}

export default UserModel;