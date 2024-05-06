import { Sequelize } from "sequelize";
import { format } from "date-fns";
import db from "../db.config.js";
import initMySQLModels from "../models/mysql/init-models.js";
import initMssqlModels from "../models/sqlserver/init-models.js";
import { employeeMSSQLQuery, employeeMySQLQuery } from "./queryConfig.js";

const mySqlInitModel = initMySQLModels(db.mySQL);
const mssqlInitModel = initMssqlModels(db.sqlServer);

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

    return res.status(200).json(mergeData);
    // return res.status(200).json({ employees, jobHistory });
  } catch (error) {
    return res.status(500).json({ statusCode: 500, error: error.message });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const _id = req.params.id;
    const employee = await mySqlInitModel.employee.findByPk(_id);
    const personal = await mssqlInitModel.PERSONAL.findByPk(_id);
    if (!employee || !personal) {
      return res.status(404).json({ statusCode: 404, error: "Employee not found" });
    }
    return res.status(200).json({ employee, personal });
  } catch (error) {
    return res.status(500).json({ statusCode: 500, error: error.message });
  }
}

const createEmployee = async (req, res) => {
  try {
    const { employeeId, firstName, middleName, lastName, gender, birthDay, ssNumber, phoneNumber, email, address, country } = req.body;
    const exitsEmployee_ID = await mySqlInitModel.employee.findOne({
      where: { idEmployee: employeeId },
    });
    if (exitsEmployee_ID) {
      return res.status(400).json({ statusCode: 400, error: "idEmployee already exists" });
    }

    const newLastName = `${lastName} ${middleName}`;

    const employeesMySQL = await mySqlInitModel.employee.create({
      idEmployee: employeeId,
      employeeNumber: employeeId,
      firstName: firstName,
      lastName: newLastName,
      SSN: ssNumber,
      payRates_idPayRates: 1,
    });

    const employeeMSSQL = await mssqlInitModel.PERSONAL.create({
      PERSONAL_ID: employeeId,
      CURRENT_FIRST_NAME: firstName,
      CURRENT_LAST_NAME: lastName,
      CURRENT_MIDDLE_NAME: middleName,
      BIRTH_DATE: format(new Date(birthDay), "yyyy-MM-dd"),
      SOCIAL_SECURITY_NUMBER: ssNumber,
      CURRENT_ADDRESS_1: address,
      CURRENT_COUNTRY: country,
      CURRENT_GENDER: gender,
      CURRENT_PHONE_NUMBER: phoneNumber,
      CURRENT_PERSONAL_EMAIL: email,
    });
    
    return res.status(200).json({ employeesMySQL, employeeMSSQL });
  } catch (error) {
    return res.status(500).json({ statusCode: 500, error: error.message });
  }
}

// update information of employee by id
const updateEmployee = async (req, res) => {
  try {
    const _id = req.params.id;
    const updateData = req.body;
    const employee = await mySqlInitModel.employee.findByPk(_id);
    if (!employee) {
      return res.status(404).json({ statusCode: 404, error: "Employee not found" });
    }
    await employee.update(updateData);

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
  updateEmployee,
};