const sequelize = require('../database/connection');

const Sequelize = require('sequelize');


const Books = sequelize.define('books', {
  bookId: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  author: {
      type: Sequelize.STRING,
      allowNull:false
},
type: {
    type: Sequelize.STRING,
    allowNull:false
},
  qty: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false
  },
  issue_days:{
  type: Sequelize.INTEGER.UNSIGNED,
  allowNull: false
},
  cost: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false
  }

});

module.exports = Books;