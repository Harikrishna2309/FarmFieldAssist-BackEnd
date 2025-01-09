const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Interest = sequelize.define('interests',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      status: {
        type: Sequelize.ENUM('pending', 'accepted', 'declined'),
        defaultValue: 'pending',
      },
      workId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'works', 
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      labourId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', 
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
})

Interest.associate = (models) => {
    Interest.belongsTo(models.Work, { foreignKey: 'workId', as: 'work' });
    Interest.belongsTo(models.User, { as: 'labour', foreignKey: 'labourId' });
  };
module.exports = Interest;