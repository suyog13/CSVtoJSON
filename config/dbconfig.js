const dotenv = require('dotenv');
dotenv.config();

var dbConfig = {  // UAT
    database: process.env.DATABASE,
    username: process.env.DBUSER,
    password: process.env.PASSWORD,
    dialect: 'postgres',
    host: process.env.HOST,
    port: 5432,
    pool: {
      max: 5,
      min: 0,
      acquire: 3000,
      idle: 10000
    },
    define:{
      timestamps:false
    },
}

module.exports = dbConfig;