const mysql = require('mysql');

const pool = mysql.createPool({
    host:"localhost",
    port:3306,
    user:"root",
    password:"badpassword",
    database:"cse305project"
});

let user = {};

user.employeeLogin = (usr, pass) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM employee e, person p where p.SSN=e.SSN and Email=? AND Password=?;`;
        pool.query(sql,[usr,pass],(err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results)
        });
    });
}

user.customerLogin = (usr, pass) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM person p, user u where u.SSN=p.SSN AND Email=? AND Password=?;`;
        pool.query(sql,[usr,pass],(err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results)
        });
    });
}

module.exports = user;