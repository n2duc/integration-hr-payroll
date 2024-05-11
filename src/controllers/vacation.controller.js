import { Sequelize } from "sequelize";
import db from "../configs/db.config.js";
import initMySQLModels from "../models/mysql/init-models.js";
import initMssqlModels from "../models/sqlserver/init-models.js";

const mySqlInitModel = initMySQLModels(db.mySQL);
const mssqlInitModel = initMssqlModels(db.sqlServer);

const getTotalVacation = async (req, res) => {
  try {
    const employees = await mySqlInitModel.employee.findAll({
      attributes: ['idEmployee'],
    })

    const employmentWorkingTimeCurentYear = await mssqlInitModel.EMPLOYMENT_WORKING_TIME.findAll({
      attributes: ["EMPLOYMENT_ID", "YEAR_WORKING", "MONTH_WORKING", "NUMBER_DAYS_ACTUAL_OF_WORKING_PER_MONTH", "TOTAL_NUMBER_VACATION_WORKING_DAYS_PER_MONTH"],
      include: [
        {
          model: mssqlInitModel.EMPLOYMENT,
          as: "EMPLOYMENT",
        },
      ],
      where: {
        $and: Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('YEAR_WORKING')), new Date().getFullYear()),
      },
      raw: true
    });

    const personals = await mssqlInitModel.PERSONAL.findAll({
      attributes: ["PERSONAL_ID", "CURRENT_FIRST_NAME", "CURRENT_LAST_NAME", "CURRENT_MIDDLE_NAME", "CURRENT_GENDER", "SHAREHOLDER_STATUS", "ETHNICITY"],
      include: [
        {
          model: mssqlInitModel.EMPLOYMENT,
          as: "EMPLOYMENT",
          attributes: ["EMPLOYMENT_ID", "EMPLOYMENT_STATUS"],
          include: [
            {
              model: mssqlInitModel.EMPLOYMENT_WORKING_TIME,
              as: "EMPLOYMENT_WORKING_TIME",
              attributes: ["YEAR_WORKING", "MONTH_WORKING", "NUMBER_DAYS_ACTUAL_OF_WORKING_PER_MONTH", "TOTAL_NUMBER_VACATION_WORKING_DAYS_PER_MONTH"],
              where: {
                $and: Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('YEAR_WORKING')), new Date().getFullYear()),
              }
            }
          ]
        },
      ],
      raw: true
    });

    const mergeData = personals.map((item) => {
      const monthWorking = item['EMPLOYMENT.EMPLOYMENT_WORKING_TIME.MONTH_WORKING'];
      const totalVacation = item['EMPLOYMENT.EMPLOYMENT_WORKING_TIME.TOTAL_NUMBER_VACATION_WORKING_DAYS_PER_MONTH'];

      const totalVacationDaysCurrentYear = totalVacation * monthWorking;

      const mergedItem = { totalVacationDaysCurrentYear, ...item };
      return mergedItem;
    });
    
    return res.status(200).json(mergeData);
  } catch (error) {
    return res.status(500).json({ statusCode: 500, error: error.message });
  }
}

export default { getTotalVacation };