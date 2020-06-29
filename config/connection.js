const mysql = require("mysql");
const keys = require("../keys.js");


const connection = mysql.createConnection({
    host: keys.db.host,
    user: keys.db.user,
    password: keys.db.key,
    database: keys.db.database,
    port: keys.db.port
  });



module.exports = connection;