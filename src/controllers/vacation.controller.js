import db from "../configs/db.config.js";
import initMySQLModels from "../models/mysql/init-models.js";
import initMssqlModels from "../models/sqlserver/init-models.js";

const mySqlInitModel = initMySQLModels(db.mySQL);
const mssqlInitModel = initMssqlModels(db.sqlServer);

const getTotalVacation = async (req, res) => {
  try {
    const employees = await mySqlInitModel.employee.findAll({
      attributes: ["idEmployee", "vacationDays"],
    });
    const personals = await mssqlInitModel.PERSONAL.findAll({
      attributes: ['PERSONAL_ID', 'CURRENT_FIRST_NAME', 'CURRENT_LAST_NAME', 'CURRENT_MIDDLE_NAME', 'CURRENT_GENDER', 'ETHNICITY', 'SHAREHOLDER_STATUS'],
      include: [
        {
          model: mssqlInitModel.BENEFIT_PLANS,
          attributes: ['BENEFIT_PLANS_ID', 'DEDUCTABLE', 'PERCENTAGE_COPAY'],
          as: 'BENEFIT_PLANS',
        },
      ],
    });

    const newData = personals.map(personal => {
      const { BENEFIT_PLANS: { BENEFIT_PLANS_ID, DEDUCTABLE, PERCENTAGE_COPAY }, BENEFIT_PLANS, ...remainData } = personal;
      return {
        ...remainData.dataValues,
        BENEFIT_PLANS_ID,
        PROFIT: DEDUCTABLE * PERCENTAGE_COPAY,
      };
    });

    return res.status(200).json({ newData });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export default { getTotalVacation };