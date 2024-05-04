import { Sequelize } from "sequelize";
import { format } from "date-fns";
import db from "../db.config.js";
import initMySQLModels from "../models/mysql/init-models.js";
import initMssqlModels from "../models/sqlserver/init-models.js";
import { employeeMSSQLQuery, employeeMySQLQuery } from "./queryConfig.js";

const mySqlInitModel = initMySQLModels(db.mySQL);
const mssqlInitModel = initMssqlModels(db.sqlServer);

const mergeName = (firstName, middleName, lastName) => {
  return `${firstName} ${middleName ? middleName : ""} ${lastName}`;
};

const getEmployees = async (req, res) => {
  try {
    const employees = await mySqlInitModel.employee.findAll(employeeMySQLQuery);
    const jobHistory = await mssqlInitModel.JOB_HISTORY.findAll(employeeMSSQLQuery);

    const newData = jobHistory.map((item) => {
      const {
        DEPARTMENT,
        EMPLOYMENT: { EMPLOYMENT_ID, PERSONAL },
      } = item;
      return {
        DEPARTMENT,
        EMPLOYMENT_ID,
        ...PERSONAL.dataValues,
      };
    });

    const data = employees.map((item) => {
      const {
        idEmployee,
        payRate,
        payrates: { taxPercentage, Value },
      } = item;
      return {
        idEmployee,
        salary: (payRate * Value * (100 - taxPercentage)) / 100,
      };
    });

    const mergeData = newData.map((item) => {
      const matchData = data.find(
        (data) => data.idEmployee === item.PERSONAL_ID
      );
      const mergedItem = { ...item, ...matchData };
      const { idEmployee, PERSONAL_ID, EMPLOYMENT_ID, ...rest } = mergedItem;
      return rest;
    });

    return res.json(mergeData);
  } catch (error) {
    return res.status(500).json({ statusCode: 500, error: error.message });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const _id = req.params.id;
    const employee = await mySqlInitModel.employee.findByPk(_id);
    if (!employee) {
      return res.status(404).json({ statusCode: 404, error: "Employee not found" });
    }
    return res.json(employee);
  } catch (error) {
    return res.status(500).json({ statusCode: 500, error: error.message });
  }
}

const createEmployee = async (req, res) => {
  try {
    const data = req.body;
    const exitsEmployee_ID = await mySqlInitModel.employee.findOne({
      where: { idEmployee: data.idEmployee },
    });
    if (exitsEmployee_ID) {
      return res.status(400).json({ statusCode: 400, error: "idEmployee already exists" });
    }
    const personal = await mssqlInitModel.PERSONAL.findByPk(data.idEmployee);
    if (!personal) {
      return res.status(400).json({ statusCode: 400, error: "PERSONAL_ID not found" });
    }
    const employee = await mySqlInitModel.employee.create(data);
    console.log(data);
    
    return res.status(200).json(employee);
  } catch (error) {
    return res.status(500).json({ statusCode: 500, error: error.message });
  }
}

const getEmployeeBenefits = async (req, res) => {
  try {
    const personal = await mssqlInitModel.PERSONAL.findAll({
      attributes: ["PERSONAL_ID", "CURRENT_FIRST_NAME", "CURRENT_LAST_NAME", "CURRENT_MIDDLE_NAME", "SHAREHOLDER_STATUS"],
    });
    return res.status(200).json(personal);
  } catch (error) {
    return res.status(500).json({ statusCode: 500, error: error.message });
  }
}

const getListBirthdayRemainder = async (req, res) => {
  try {
    const today = new Date();
    const people = await mssqlInitModel.PERSONAL.findAll({
      attributes: ["PERSONAL_ID", "CURRENT_FIRST_NAME", "CURRENT_LAST_NAME", "CURRENT_MIDDLE_NAME", "BIRTH_DATE", "CURRENT_GENDER"],
      where: {
        $and: Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('BIRTH_DATE')), today.getMonth() + 1),
        // $and: Sequelize.where(Sequelize.fn('DAY', Sequelize.col('BIRTH_DATE')), today.getDate()), // lấy chính xác ngày sinh nhật hiện tại
      }
    })

    return res.status(200).json(people);
  } catch (error) {
    return res.status(500).json({ statusCode: 500, error: error.message });
  }
}

export default {
  getEmployees,
  createEmployee,
  getEmployeeById,
  getEmployeeBenefits,
  getListBirthdayRemainder,
};