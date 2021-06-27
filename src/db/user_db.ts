import {DataTypes} from "sequelize";


function UserModel(sequelize:  any) {
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