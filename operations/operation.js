const db =  require('../database/connection');

module.exports= function save(){
    return db.execute('INSERT INTO NOMINAL (army_no,rank,name,company,posted) VALUES(?,?,?,?,?)',
        [this.army_no,this.rank,this.name,this.company,this.posted]
    );
}