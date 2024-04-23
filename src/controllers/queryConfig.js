import db from "../config.db.js";
import initMySQLModels from "../models/mysql/init-models.js";
import initMssqlModels from "../models/sqlserver/init-models.js";

const mySqlInitModel = initMySQLModels(db.mySQL);
const mssqlInitModel = initMssqlModels(db.sqlServer);

export const employeeMySQLQuery = {
  attributes: ["idEmployee", "payRate", "payRates_idPayRates"],
  include: [
    {
      model: mySqlInitModel.payrates,
      attributes: ["idPayRates", "taxPercentage", "Value"],
      as: "payrates",
    },
  ],
};

export const employeeMSSQLQuery = {
  attributes: ["DEPARTMENT"],
  include: [
    {
      model: mssqlInitModel.EMPLOYMENT,
      attributes: ["EMPLOYMENT_ID"],
      as: "EMPLOYMENT",
      include: [
        {
          model: mssqlInitModel.PERSONAL,
          attributes: [
            "PERSONAL_ID",
            "CURRENT_FIRST_NAME",
            "CURRENT_LAST_NAME",
            "CURRENT_MIDDLE_NAME",
            "CURRENT_GENDER",
            "ETHNICITY",
            "SHAREHOLDER_STATUS",
          ],
          as: "PERSONAL",
        },
      ],
    },
  ],
}