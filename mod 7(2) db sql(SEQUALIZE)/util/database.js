const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete','root','bodyguard420',{
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;


//above sequelize will use sql at backend and do below things in above code
// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: 'localhost',
//     user:'root',
//     database: 'node-complete',
//     password: 'bodyguard420'
// });

// module.exports = pool.promise();