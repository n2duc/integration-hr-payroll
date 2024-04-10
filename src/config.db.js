import { Sequelize } from 'sequelize';
import tedious from 'tedious';
import mysql2 from 'mysql2';
import personalModel from './models/sqlserver/personal.model.js';

const sequelizeSQLServer = new Sequelize(
  process.env.MSSQL_NAME,
  process.env.MSSQL_USER,
  process.env.MSSQL_PASSWORD,
  {
    host: process.env.MSSQL_HOST,
    port: process.env.MSSQL_PORT,
    dialect: "mssql",
    logging: false,
    dialectModule: tedious,
    dialectOptions: {
      options: { encrypt: false },
    },
  }
);

// const sequelizeMySQL = new Sequelize(
//   process.env.MYSQL_NAME,
//   process.env.MYSQL_USER,
//   process.env.MYSQL_PASSWORD,
//   {
//     host: process.env.MYSQL_HOST,
//     port: process.env.MYSQL_PORT,
//     dialect: 'mysql',
//     logging: false,
//     dialectModule: mysql2,
//   }
// );

// const db = {
//   sqlServer: sequelizeSQLServer,
//   mySQL: sequelizeMySQL,
// };


const db = {};
db.PersonalTest = personalModel(sequelizeSQLServer);
db.sequelizeSQLServer = sequelizeSQLServer;

sequelizeSQLServer.sync({ alter: true });

export default db;