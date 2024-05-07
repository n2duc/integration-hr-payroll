import { Sequelize } from "sequelize";
import { format } from "date-fns";

import db from "../configs/db.config.js";
import initMySQLModels from "../models/mysql/init-models.js";
import initMssqlModels from "../models/sqlserver/init-models.js";

const mySqlInitModel = initMySQLModels(db.mySQL);
const mssqlInitModel = initMssqlModels(db.sqlServer);

const getEmployees = async (req, res) => {
  try {
    // get information of all employees about pay roll from MySQL
    const employees = await mySqlInitModel.employee.findAll();

    return res.status(200).json(employees);
  } catch (error) {
    return res.status(500).json({ statusCode: 500, error: error.message });
  }
}

export default { getEmployees };