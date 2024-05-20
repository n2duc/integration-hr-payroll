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
          attributes: ["PERSONAL_ID", "CURRENT_FIRST_NAME", "CURRENT_LAST_NAME", "CURRENT_MIDDLE_NAME", "CURRENT_PERSONAL_EMAIL", "CURRENT_PHONE_NUMBER", "CURRENT_GENDER", "ETHNICITY", "SHAREHOLDER_STATUS"],
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

    const employee = await mySqlInitModel.employee.findByPk(_id, {
      attributes: ['idEmployee', 'firstName', 'lastName', 'SSN', 'payRate', 'payRates_idPayRates', 'vacationDays'],
      include: [
        {
          model: mySqlInitModel.payrates,
          as: "payrates",
        }
      ],
    });

    if (!employee) {
      return res.status(404).json({ statusCode: 404, error: "Employee not found" });
    }

    if (!employments) {
      return res.status(404).json({ statusCode: 404, error: "Employee not found" });
    }

    const mergeData = { ...employments.dataValues, ...employee.dataValues };
    const { PERSONAL: { CURRENT_FIRST_NAME, CURRENT_LAST_NAME, CURRENT_MIDDLE_NAME, CURRENT_GENDER, CURRENT_PERSONAL_EMAIL, CURRENT_PHONE_NUMBER, BIRTH_DATE, SOCIAL_SECURITY_NUMBER, DRIVERS_LICENSE, CURRENT_ADDRESS_1, CURRENT_ADDRESS_2, CURRENT_CITY, CURRENT_ZIP, CURRENT_COUNTRY, CURRENT_MARITAL_STATUS, ETHNICITY, SHAREHOLDER_STATUS, BENEFIT_PLAN_ID }, JOB_HISTORY, payrates, payrates: { idPayRates }, EMPLOYMENT_STATUS, HIRE_DATE_FOR_WORKING, WORKERS_COMP_CODE, TERMINATION_DATE, NUMBER_DAYS_REQUIREMENT_OF_WORKING_PER_MONTH, vacationDays } = mergeData;

    const responseData = {
      firstname: CURRENT_FIRST_NAME,
      lastname: `${CURRENT_LAST_NAME} ${CURRENT_MIDDLE_NAME}`,
      gender: CURRENT_GENDER,
      email: CURRENT_PERSONAL_EMAIL,
      phoneNumber: CURRENT_PHONE_NUMBER,
      birthDay: BIRTH_DATE,
      ssNumber: SOCIAL_SECURITY_NUMBER,
      driverLicense: DRIVERS_LICENSE,
      address1: CURRENT_ADDRESS_1,
      address2: CURRENT_ADDRESS_2,
      city: CURRENT_CITY,
      zipCode: CURRENT_ZIP,
      country: CURRENT_COUNTRY,
      ethnicity: ETHNICITY.trimEnd(),
      employmentStatus: EMPLOYMENT_STATUS.trimEnd(),
      payRateId: idPayRates,
      shareholderStatus: SHAREHOLDER_STATUS,
      benefitPlanId: BENEFIT_PLAN_ID,
      maritalStatus: CURRENT_MARITAL_STATUS,
      vacationDays: vacationDays,
      hireDate: HIRE_DATE_FOR_WORKING,
      terminationDate: TERMINATION_DATE,
      WORKERS_COMP_CODE,
      NUMBER_DAYS_REQUIREMENT_OF_WORKING_PER_MONTH,
      JOB_HISTORY,
      payrates,
    }

    return res.status(200).json(responseData);
  } catch (error) {
    return res.status(500).json({ statusCode: 500, error: error.message });
  }
}

const createEmployee = async (req, res) => {
  try {
    const { firstname, lastname, gender, email, phoneNumber, birthDay, ssNumber, driverLicense, address1, address2, city, zipCode, country, ethnicity, employmentStatus, payRateId, shareholderStatus, benefitPlanId, maritalStatus, vacationDays, hireDate, terminationDate, jobHistory } = req.body;

    const maxPersonalId = await mssqlInitModel.PERSONAL.max("PERSONAL_ID");
    const employeeId = maxPersonalId + 1;

    const exitsEmployee_ID = await mySqlInitModel.employee.findOne({
      where: { idEmployee: employeeId },
    });
    if (exitsEmployee_ID) {
      return res.status(400).json({ statusCode: 400, error: "idEmployee already exists" });
    }


    // const newLastName = `${lastName} ${middleName}`;
    const [CURRENT_LAST_NAME, ...CURRENT_MIDDLE_NAME] = lastname.split(" ");

    const employeesMySQL = await mySqlInitModel.employee.create({
      idEmployee: employeeId,
      employeeNumber: employeeId,
      firstName: firstname,
      lastName: lastname,
      SSN: ssNumber,
      payRates_idPayRates: payRateId,
      vacationDays: vacationDays,
    });

    const employeeMSSQL = await mssqlInitModel.PERSONAL.create({
      PERSONAL_ID: employeeId,
      CURRENT_FIRST_NAME: firstname,
      CURRENT_LAST_NAME,
      CURRENT_MIDDLE_NAME: CURRENT_MIDDLE_NAME.join(" "),
      BIRTH_DATE: format(new Date(birthDay), "yyyy-MM-dd"),
      SOCIAL_SECURITY_NUMBER: ssNumber,
      DRIVERS_LICENSE: driverLicense,
      CURRENT_ADDRESS_1: address1,
      CURRENT_ADDRESS_2: address2,
      CURRENT_CITY: city,
      CURRENT_COUNTRY: country,
      CURRENT_ZIP: zipCode,
      CURRENT_GENDER: gender,
      CURRENT_PHONE_NUMBER: phoneNumber,
      CURRENT_PERSONAL_EMAIL: email,
      CURRENT_MARITAL_STATUS: maritalStatus,
      ETHNICITY: ethnicity,
      SHAREHOLDER_STATUS: shareholderStatus,
      BENEFIT_PLAN_ID: benefitPlanId,
    });

    const employments = await mssqlInitModel.EMPLOYMENT.create({
      PERSONAL_ID: employeeId,
      EMPLOYMENT_ID: employeeId,
      EMPLOYMENT_STATUS: employmentStatus,
      HIRE_DATE_FOR_WORKING: format(new Date(hireDate), "yyyy-MM-dd"),
      TERMINATION_DATE: format(new Date(terminationDate), "yyyy-MM-dd"),
    })

    if (jobHistory && jobHistory.length > 0) {
      let maxJobHistoryId = await mssqlInitModel.JOB_HISTORY.max("JOB_HISTORY_ID");

      for (const job of jobHistory) {
        const { department, jobTitle, startDate, endDate, location } = job;
        const jobHistoryId = ++maxJobHistoryId;

        await mssqlInitModel.JOB_HISTORY.create({
          JOB_HISTORY_ID: jobHistoryId,
          EMPLOYMENT_ID: employeeId,
          DEPARTMENT: department,
          JOB_TITLE: jobTitle,
          FROM_DATE: format(new Date(startDate), "yyyy-MM-dd"),
          THRU_DATE: format(new Date(endDate), "yyyy-MM-dd"),
          LOCATION: location,
        });
      }
    }
    
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
    const { firstname, lastname, gender, email, phoneNumber, birthDay, ssNumber, driverLicense, address1, address2, city, zipCode, country, ethnicity, employmentStatus, payRateId, shareholderStatus, benefitPlanId, maritalStatus, vacationDays, hireDate, terminationDate } = req.body;

    const employee = await mySqlInitModel.employee.findByPk(_id);
    const personal = await mssqlInitModel.PERSONAL.findByPk(_id);
    const employment = await mssqlInitModel.EMPLOYMENT.findByPk(_id);

    const [CURRENT_LAST_NAME, ...CURRENT_MIDDLE_NAME] = lastname.split(" ");

    if (!employee || !personal) {
      return res.status(404).json({ statusCode: 404, error: "Employee not found" });
    }

    // upodate data
    await employee.update({
      firstName: firstname,
      lastName: lastname,
      SSN: ssNumber,
      payRates_idPayRates: payRateId,
      vacationDays: vacationDays,
    });
    
    await personal.update({
      CURRENT_FIRST_NAME: firstname,
      CURRENT_LAST_NAME,
      CURRENT_MIDDLE_NAME: CURRENT_MIDDLE_NAME.join(" "),
      BIRTH_DATE: format(new Date(birthDay), "yyyy-MM-dd"),
      SOCIAL_SECURITY_NUMBER: ssNumber,
      DRIVERS_LICENSE: driverLicense,
      CURRENT_ADDRESS_1: address1,
      CURRENT_ADDRESS_2: address2,
      CURRENT_CITY: city,
      CURRENT_COUNTRY: country,
      CURRENT_ZIP: zipCode,
      CURRENT_GENDER: gender,
      CURRENT_PHONE_NUMBER: phoneNumber,
      CURRENT_PERSONAL_EMAIL: email,
      CURRENT_MARITAL_STATUS: maritalStatus,
      ETHNICITY: ethnicity,
      SHAREHOLDER_STATUS: shareholderStatus,
      BENEFIT_PLAN_ID: benefitPlanId,
    });

    await employment.update({
      EMPLOYMENT_STATUS: employmentStatus,
      HIRE_DATE_FOR_WORKING: format(new Date(hireDate), "yyyy-MM-dd"),
      TERMINATION_DATE: format(new Date(terminationDate), "yyyy-MM-dd"),
    })

    return res.status(200).json({ statusCode: 200, message: "Update success" });
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
    const employmentWorkingTime = await mssqlInitModel.EMPLOYMENT_WORKING_TIME.findAll({
      where: { EMPLOYMENT_ID: _id },
    });
    const jobHistory = await mssqlInitModel.JOB_HISTORY.findAll({
      where: { EMPLOYMENT_ID: _id },
    });

    if (!employee || !personal || !employment) {
      return res.status(404).json({ statusCode: 404, error: "Employee not found" });
    }

    await employee.destroy();
    await personal.destroy();
    await employment.destroy();
    if (employmentWorkingTime) {
      await employmentWorkingTime.map((employment) => employment.destroy());
    }
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