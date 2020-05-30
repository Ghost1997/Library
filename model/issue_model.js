const sequelize = require('../database/connection');

const Sequelize = require('sequelize');


const Issue = sequelize.define('Issue', {
    issueId: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
  lib_no: {
    type: Sequelize.STRING,
    allowNull: false
  },
  name: {
      type: Sequelize.STRING,
      allowNull:false
},
bookId: {
    type: Sequelize.STRING,
    allowNull: false
},
bookname:{
    type: Sequelize.STRING,
    allowNull: false
},
issuedate:{
    type: Sequelize.DATEONLY,
    allowNull: false
},
duedate:{
    type: Sequelize.DATEONLY,
    allowNull: false
},
author:{
    type: Sequelize.STRING,
    allowNull: false
}
});

module.exports = Issue;

