import db from "../configs/db.config.js";
import initMySQLModels from "../models/mysql/init-models.js";
import initMssqlModels from "../models/sqlserver/init-models.js";

const mySqlInitModel = initMySQLModels(db.mySQL);
const mssqlInitModel = initMssqlModels(db.sqlServer);

const getTotalVacation = async (req, res) => {
  try {
    const employmentWorkingTime = await mssqlInitModel.EMPLOYMENT_WORKING_TIME.findAll({
      attributes: ["EMPLOYMENT_ID", "YEAR_WORKING"],
      include: [
        {
          attributes: ["PERSONAL_ID", "CURRENT_FIRST_NAME", "CURRENT_LAST_NAME", "CURRENT_MIDDLE_NAME", "CURRENT_GENDER", "ETHINICITY", "SHAREHOLDER_STATUS"],
          model: mssqlInitModel.PERSONAL,
          required: true,
          as: "PERSONAL",
        },
      ],
    });
          
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export default { getTotalVacation };