import db from "../config.db.js";
import initMySQLModels from "../models/mysql/init-models.js";
import initMssqlModels from "../models/sqlserver/init-models.js";
import { Sequelize } from "sequelize";

const mySqlInitModel = initMySQLModels(db.mySQL);
const mssqlInitModel = initMssqlModels(db.sqlServer);

const findPersonalById = async (id) => {
  return await db.PersonalTest.findByPk(id);
};

const getListEmployee = async (req, res) => {
  try {
    const employees = await db.sqlServer.query(
      `SELECT * FROM Personal `,
      {
        type: db.sqlServer.QueryTypes.SELECT,
      }
    );
    return res.status(200).json(employees);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const getAll = async (req, res) => {
  try {
    const personal = await db.PersonalTest.findAll();
    return res.json(personal);
  } catch (error) {
    return res.status(500).json({ statusCode: 500, error: error.message });
  }
}

const createPersonal = async (req, res) => {
  try {
    const personal = await db.PersonalTest.create(req.body);
    return res.json(personal);
  } catch (error) {
    return res.status(500).json({ statusCode: 500, error: error.message });
  }
}

const deletePersonal = async (req, res) => {
  try {
    const idPersonal = req.params.id;
    const existingPersonal = await findPersonalById(idPersonal);
    if (!existingPersonal) {
      return res.status(404).json({ statusCode: 404, error: 'Personal not found' });
    }

    await db.PersonalTest.destroy({ where: { Employee_ID: idPersonal } });

    return res.json({ statusCode: 200, message: `Personal with id ${idPersonal} is deleted successfully` });
  } catch (error) {
    return res.status(500).json({ statusCode: 500, error: error.message });
  }
}

const getEmployeeIntegration = async (req, res) => {
  try {
    const employees = await mySqlInitModel.employee.findAll({
      attributes: ['idEmployee', 'payRate', 'payRates_idPayRates'],
      include: [
        {
          model: mySqlInitModel.payrates,
          attributes: ['idPayRates', 'taxPercentage', 'Value'],
          as: 'payrates'
        }
      ]
    });

    const jobHistory = await mssqlInitModel.JOB_HISTORY.findAll({
      attributes: ['DEPARTMENT'],
      include: [
        {
          model: mssqlInitModel.EMPLOYMENT,
          attributes: ['EMPLOYMENT_ID'],
          as: 'EMPLOYMENT',
          include: [
            {
              model: mssqlInitModel.PERSONAL,
              attributes: ['PERSONAL_ID', 'CURRENT_FIRST_NAME', 'CURRENT_LAST_NAME', 'CURRENT_MIDDLE_NAME', 'CURRENT_GENDER', 'ETHNICITY', 'SHAREHOLDER_STATUS'],
              as: 'PERSONAL',
            }
          ]
        }
      ]
    });

    const newData = jobHistory.map(item => {
      const { DEPARTMENT, EMPLOYMENT: { EMPLOYMENT_ID, PERSONAL } } = item;
      return {
        DEPARTMENT,
        EMPLOYMENT_ID,
        ...PERSONAL.dataValues,
      };
    });

    const data = employees.map(item => {
      const { idEmployee, payRate, payrates: { taxPercentage, Value } } = item;
      return {
        idEmployee,
        // payRate,
        // taxPercentage,
        // Value,
        salary: payRate * Value * (100 - taxPercentage) / 100,
      };
    });

    const mergeData = newData.map((item) => {
      const matchData = data.find((data) => data.idEmployee === item.PERSONAL_ID);
      const mergedItem = { ...item, ...matchData };
      const { idEmployee, PERSONAL_ID, EMPLOYMENT_ID, ...rest } = mergedItem;
      return rest;
    })

    return res.json({ mergeData })
  } catch (error) {
    return res.status(500).json({ statusCode: 500, error: error.message });
  }
};

export default { getListEmployee, getAll, createPersonal, deletePersonal, getEmployeeIntegration }