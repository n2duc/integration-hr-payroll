import { Sequelize } from "sequelize";

import db from "../configs/db.config.js";
import initMySQLModels from "../models/mysql/init-models.js";
import initMssqlModels from "../models/sqlserver/init-models.js";

const mySqlInitModel = initMySQLModels(db.mySQL);
const mssqlInitModel = initMssqlModels(db.sqlServer);

const getTotalIncome = async (req, res) => {
  try {
    const employees = await mySqlInitModel.employee.findAll({
      include: [{
        model: mySqlInitModel.payrates,
        required: true,
        as: "payrates",
      }]
    })

    const employments = await mssqlInitModel.EMPLOYMENT.findAll({
      attributes: ["EMPLOYMENT_ID", "EMPLOYMENT_STATUS"],
      include: [
        {
          attributes: ["PERSONAL_ID", "CURRENT_FIRST_NAME", "CURRENT_LAST_NAME", "CURRENT_MIDDLE_NAME", "CURRENT_GENDER", "CURRENT_PERSONAL_EMAIL", "ETHNICITY", "SHAREHOLDER_STATUS"],
          model: mssqlInitModel.PERSONAL,
          required: true,
          as: "PERSONAL",
        },
        {
          attributes: ["JOB_HISTORY_ID", "DEPARTMENT", "JOB_TITLE"],
          model: mssqlInitModel.JOB_HISTORY,
          as: "JOB_HISTORY",
        }
      ]
    })

    const flatData = employments.map((employment) => {
      const { EMPLOYMENT_ID, EMPLOYMENT_STATUS, PERSONAL: { PERSONAL_ID, CURRENT_FIRST_NAME, CURRENT_LAST_NAME, CURRENT_MIDDLE_NAME, CURRENT_GENDER, CURRENT_PERSONAL_EMAIL, ETHNICITY, SHAREHOLDER_STATUS }, JOB_HISTORY } = employment;

      return {
        EMPLOYMENT_ID,
        EMPLOYMENT_STATUS,
        PERSONAL_ID,
        CURRENT_FIRST_NAME,
        CURRENT_LAST_NAME,
        CURRENT_MIDDLE_NAME,
        CURRENT_GENDER,
        CURRENT_PERSONAL_EMAIL,
        ETHNICITY,
        SHAREHOLDER_STATUS,
        JOB_HISTORY: JOB_HISTORY[0]?.DEPARTMENT,
      }
    })

    const totalIncome = employees.map((employee) => {
      const matchData = flatData.find(
        (data) => data.PERSONAL_ID === employee.idEmployee
      );
      const payRate = employee.payrates;
      const additionalPayAmount = employee.payAmount || 0;
      const taxPercentage = employee.payrates.taxPercentage;
      const totalIncome = payRate.Value - (payRate.Value * taxPercentage / 100) + additionalPayAmount;

      return {
        idEmployee: employee.idEmployee,
        ...employee.dataValues,
        totalIncome,
        info: matchData,
      }
    })

    return res.status(200).json(totalIncome);
  } catch (error) {
    return res.status(500).json({ statusCode: 500, error: error.message });
  }
}

export default {
  getTotalIncome
}