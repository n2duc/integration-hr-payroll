import db from "../configs/db.config.js";
import initMySQLModels from "../models/mysql/init-models.js";
import initMssqlModels from "../models/sqlserver/init-models.js";

const mySqlInitModel = initMySQLModels(db.mySQL);
const mssqlInitModel = initMssqlModels(db.sqlServer);

const methodName = async (req, res) => {
  try {
    
  } catch (error) {
    return res.status(500).json({ statusCode: 500, error: error.message });
  }
}

export default {
  
}