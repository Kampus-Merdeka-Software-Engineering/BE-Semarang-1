const mysql = require('mysql2');

const dbConnection = mysql.createConnection({
    host: 'containers-us-west-191.railway.app',
    user: 'root',
    password: 'afYPKtqEsb1Xnm6JsHbT',
    database: 'railway',
    port: 7030,
});

module.exports = dbConnection;