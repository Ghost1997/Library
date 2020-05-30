const sequelize = require('../database/connection');

const Sequelize = require('sequelize');


const Student = sequelize.define('student', {
  lib_no: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  },
  roll_no: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  name: {
      type: Sequelize.STRING,
      allowNull:false
},
  std: {
    type: Sequelize.STRING,
    allowNull: false
  },
  section: {
    type: Sequelize.STRING,
    allowNull: false
  },
  gender: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  image: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Student;


// module.exports = class Person {
//     constructor(army_no, rank, name, company, posted) {
//         this.army_no = army_no;
//         this.rank = rank;
//         this.name = name;
//         this.company = company;
//         this.posted = posted;
//     }


//     save() {
//         return db.execute('INSERT INTO NOMINAL (army_no,rank,name,company,posted) VALUES(?,?,?,?,?)',
//             [this.army_no, this.rank, this.name, this.company, this.posted]
//         );
//     }
//     static getAllPerson() {
//         return db.execute('SELECT * FROM NOMINAL');
//     }
    
//     static getByCompany(com) {
//         return db.execute('SELECT * FROM NOMINAL WHERE company = ?', [com])
//     }
//     static getByID(id) {
//         return db.execute('SELECT * FROM NOMINAL WHERE army_no = ?', [id])
//     }
// }