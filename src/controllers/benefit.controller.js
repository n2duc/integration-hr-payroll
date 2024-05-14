import { Sequelize } from "sequelize";
import db from "../configs/db.config.js";
import initMySQLModels from "../models/mysql/init-models.js";
import initMssqlModels from "../models/sqlserver/init-models.js";

const mySqlInitModel = initMySQLModels(db.mySQL);
const mssqlInitModel = initMssqlModels(db.sqlServer);

const getAverageBenefits  = async (req, res) => {
  try {
    const averageBenefits = await mssqlInitModel.PERSONAL.findAll({
      where: {
        SHAREHOLDER_STATUS: { [Sequelize.Op.in]: [0, 1] }
      },
      attributes: [
        "PERSONAL_ID",
        "CURRENT_FIRST_NAME",
        "CURRENT_LAST_NAME",
        "CURRENT_MIDDLE_NAME",
        "CURRENT_GENDER",
        "SHAREHOLDER_STATUS",
        "BENEFIT_PLAN_ID",
        [Sequelize.fn('AVG', Sequelize.col('BENEFIT_PLANS.DEDUCTABLE')), 'averageDeductable'],
        [Sequelize.fn('AVG', Sequelize.col('BENEFIT_PLANS.PERCENTAGE_COPAY')), 'averagePercentageCopay'],
      ],
      include: [
        {
          model: mssqlInitModel.BENEFIT_PLANS,
          // required: true,
          as: "BENEFIT_PLANS",
          attributes: ['BENEFIT_PLANS_ID', 'PLAN_NAME'],
        }
      ],
      raw: true,
      group: ['PERSONAL.PERSONAL_ID', 'PERSONAL.CURRENT_FIRST_NAME', 'PERSONAL.CURRENT_LAST_NAME', 'PERSONAL.CURRENT_MIDDLE_NAME', 'PERSONAL.BENEFIT_PLAN_ID', 'PERSONAL.CURRENT_GENDER',  'PERSONAL.SHAREHOLDER_STATUS', 'BENEFIT_PLANS.BENEFIT_PLANS_ID', 'BENEFIT_PLANS.PLAN_NAME'],
    });

    return res.status(200).json(averageBenefits);
  } catch (error) {
    return res.status(500).json({ statusCode: 500, error: error.message });
  }
}

export default {
  getAverageBenefits
}