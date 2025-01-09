const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define("users",{
    id : {
        type : Sequelize.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true
    },
    name : {
        type : Sequelize.STRING,
        allowNull : true
    },
    email : {
        type : Sequelize.STRING,
        allowNull : false
    },
    password : {
        type : Sequelize.STRING,
        allowNull : false
    },
    phone : {
        type : Sequelize.BIGINT,
        allowNull : false
    },
    alter_phone : {
        type : Sequelize.BIGINT,
        allowNull : true
    },
    cost : {
        type : Sequelize.INTEGER,
        allowNull : true
    },
    age : {
        type : Sequelize.INTEGER,
        allowNull : true
    },
    role : {
        type : Sequelize.INTEGER,
        allowNull : false
    },
    image : {
        type :Sequelize.STRING,
        allowNull : true
    }
}) 
User.associate = (models) => {

    User.hasMany(models.Work, { as: 'works', foreignKey: 'farmerId' });

    User.hasMany(models.Interest, { as: 'interests', foreignKey: 'labourId' });
};
module.exports = User;