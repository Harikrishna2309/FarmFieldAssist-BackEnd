const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Work = sequelize.define("works",{
    id : {
        type : Sequelize.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true
    },
    title : {
        type : Sequelize.STRING,
        allowNull : true
    },
    description : {
        type : Sequelize.STRING,
        allowNull : true
    },
    location : {
        type : Sequelize.STRING,
        allowNull : true
    },
    direction : {
        type : Sequelize.STRING,
        allowNull : true
    },
    status : {
        type : Sequelize.ENUM('active','completed'),
        defaultValue : 'active',
    },
    farmerId: { 
        type: Sequelize.INTEGER,
        allowNull: false, 
        references: {
            model: 'users', 
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
});
Work.associate = (models) => {
    Work.belongsTo(models.User, { as: 'farmer', foreignKey: 'farmerId' });

    Work.hasMany(models.Interest, { as: 'interests', foreignKey: 'workId' });
};
module.exports = Work;