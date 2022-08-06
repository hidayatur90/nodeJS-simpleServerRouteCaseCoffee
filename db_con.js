const mysql = require("mysql");

const mydb = mysql.createConnection({
    host    : "localhost",
    user    : "root",
    password: "",
    database: "db_coffee"
});

mydb.connect(function(err){
    if (err) throw err;
});

module.exports = mydb;