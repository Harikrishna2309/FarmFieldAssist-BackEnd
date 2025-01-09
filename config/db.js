const Sequelize = require('sequelize');

const sequelize = new Sequelize("farmfield_assist","root","Hari@23#9",{
    dialect : "mysql",
    host : "127.0.0.1",
    port: 3306,
    alter : true
});

async function testConnection() {
    try {
      await sequelize.authenticate();
      console.log('Connection to the database has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  } 
  
  testConnection();

  module.exports = sequelize;