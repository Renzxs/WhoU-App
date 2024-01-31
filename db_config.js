const mysql = require("mysql");

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "whou_db",
    password: ""
});

conn.connect((err) => {
    if(err) throw err;
    console.log("DB Connected");
});

module.exports = conn;