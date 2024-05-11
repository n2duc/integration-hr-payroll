import { Sequelize, where } from "sequelize";
import { format } from "date-fns";

import db from "../configs/db.config.js";
import initMySQLModels from "../models/mysql/init-models.js";
import initMssqlModels from "../models/sqlserver/init-models.js";

// import responseHandller from "../handlers/response.handler.js"
// import { employeeQuery } from "../configs/query.config.js";

const mySqlInitModel = initMySQLModels(db.mySQL);
const mssqlInitModel = initMssqlModels(db.sqlServer);

const getEmployees = async (req, res) => {
  try {
    const employees = await mySqlInitModel.employee.findAll({
      attributes: ['idEmployee', 'VacationDays']
    });
    const employments = await mssqlInitModel.EMPLOYMENT.findAll({
      attributes: ["EMPLOYMENT_ID", "EMPLOYMENT_STATUS"],
      include: [
        {
          attributes: ["PERSONAL_ID", "CURRENT_FIRST_NAME", "CURRENT_LAST_NAME", "CURRENT_MIDDLE_NAME", "CURRENT_PERSONAL_EMAIL", "CURRENT_GENDER", "ETHNICITY", "SHAREHOLDER_STATUS"],
          model: mssqlInitModel.PERSONAL,
          as: "PERSONAL",
        }
      ]
    });

    const flatDataPersonal = employments.map((employment) => {
      const { EMPLOYMENT_ID, EMPLOYMENT_STATUS, PERSONAL } = employment;
      return {
        EMPLOYMENT_ID,
        EMPLOYMENT_STATUS,
        ...PERSONAL.dataValues,
      }
    });

    const mergeData = flatDataPersonal.map((item) => {
      const matchData = employees.find(
        (data) => data.dataValues.idEmployee === item.PERSONAL_ID
      );
      const mergedItem = { ...item, ...matchData.dataValues };
      return mergedItem;
    });

    return res.status(200).json(mergeData);
  } catch (error) {
    return res.status(500).json({ statusCode: 500, error: error.message });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const _id = req.params.id;
    const employments = await mssqlInitModel.EMPLOYMENT.findOne({
      where: { EMPLOYMENT_ID: _id },
      // attributes: ["EMPLOYMENT_ID", "EMPLOYMENT_STATUS"],
      include: [
        {
          // attributes: ["PERSONAL_ID", "CURRENT_FIRST_NAME", "CURRENT_LAST_NAME", "CURRENT_MIDDLE_NAME", "CURRENT_GENDER", "ETHNICITY", "SHAREHOLDER_STATUS"],
          model: mssqlInitModel.PERSONAL,
          required: true,
          as: "PERSONAL",
        },
        {
          // attributes: ["JOB_HISTORY_ID", "DEPARTMENT"],
          model: mssqlInitModel.JOB_HISTORY,
          // required: true,
          as: "JOB_HISTORY",
        }
      ]
    })

    if (!employments) {
      return res.status(404).json({ statusCode: 404, error: "Employee not found" });
    }

    return res.status(200).json(employments);
  } catch (error) {
    return res.status(500).json({ statusCode: 500, error: error.message });
  }
}

const createEmployee = async (req, res) => {
  try {
    const { employeeId, firstName, middleName, lastName, gender, birthDay, ssNumber, phoneNumber, email, address, country, payRateId } = req.body;
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
      payRates_idPayRates: payRateId,
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
      ETHNICITY: "Vietnamese",
      SHAREHOLDER_STATUS: 1,
    });

    const employments = await mssqlInitModel.EMPLOYMENT.create({
      PERSONAL_ID: employeeId,
      EMPLOYMENT_ID: employeeId,
      EMPLOYMENT_STATUS: "full-time",
    })
    
    return res.status(200).json({ employeesMySQL, employeeMSSQL, employments });
  } catch (error) {
    return res.status(500).json({ statusCode: 500, error: error.message });
  }
}

// update information of employee by id
const updateEmployee = async (req, res) => {
  try {
    const _id = req.params.id;
    // const updateData = req.body;
    // const { firstName, middleName, lastName, gender, birthDay, ssNumber, phoneNumber, email, address, country } = req.body;
    const { firstName, lastName, ssNumber, gender, birthDay, phoneNumber, email, address, country } = req.body;
    const employee = await mySqlInitModel.employee.findByPk(_id);
    const personal = await mssqlInitModel.PERSONAL.findByPk(_id);

    const [CURRENT_LAST_NAME, ...CURRENT_MIDDLE_NAME] = lastName.split(" ");

    if (!employee || !personal) {
      return res.status(404).json({ statusCode: 404, error: "Employee not found" });
    }

    // upodate data
    await employee.update({
      firstName,
      lastName,
      SSN: ssNumber,
    });
    
    await personal.update({
      CURRENT_FIRST_NAME: firstName,
      CURRENT_LAST_NAME,
      CURRENT_MIDDLE_NAME: CURRENT_MIDDLE_NAME.join(" "),
      SOCIAL_SECURITY_NUMBER: ssNumber,
      BIRTH_DATE: format(new Date(birthDay), "yyyy-MM-dd"),
      CURRENT_ADDRESS_1: address,
      CURRENT_COUNTRY: country,
      CURRENT_GENDER: gender,
      CURRENT_PHONE_NUMBER: phoneNumber,
      CURRENT_PERSONAL_EMAIL: email,
    });

    return res.status(200).json({ employee, personal });
  } catch (error) {
    return res.status(500).json({ statusCode: 500, error: error.message });
  }
}

const deleteEmployee = async (req, res) => {
  try {
    const _id = req.params.id;
    const employee = await mySqlInitModel.employee.findByPk(_id);
    const personal = await mssqlInitModel.PERSONAL.findByPk(_id);
    const employment = await mssqlInitModel.EMPLOYMENT.findByPk(_id);
    const jobHistory = await mssqlInitModel.JOB_HISTORY.findAll({
      where: { EMPLOYMENT_ID: _id },
    });

    if (!employee || !personal || !employment) {
      return res.status(404).json({ statusCode: 404, error: "Employee not found" });
    }

    await employee.destroy();
    await personal.destroy();
    await employment.destroy();
    if (jobHistory) {
      await jobHistory.map((job) => job.destroy());
    }

    return res.status(200).json({ statusCode: 200, message: "Delete success" });
  } catch (error) {
    return res.status(500).json({ statusCode: 500, error: error.message });
  }
};

export default {
  getEmployees,
  createEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};