import { Sequelize, where } from "sequelize";
// import { format } from "date-fns";

import db from "../configs/db.config.js";
import initMySQLModels from "../models/mysql/init-models.js";
import initMssqlModels from "../models/sqlserver/init-models.js";

const mySqlInitModel = initMySQLModels(db.mySQL);
const mssqlInitModel = initMssqlModels(db.sqlServer);

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

// get list of employees who is within a certain number of days of their hiring anniversary
const getListAnniversaryRemainder = async (req, res) => {
  try {
    const thresholdDays = 7;
    const today = new Date();
    const personal = await mssqlInitModel.PERSONAL.findAll({
      attributes: ["PERSONAL_ID", "CURRENT_FIRST_NAME", "CURRENT_LAST_NAME", "CURRENT_MIDDLE_NAME", "BIRTH_DATE", "CURRENT_GENDER"],
      include: [
        {
          attributes: ["EMPLOYMENT_ID", "HIRE_DATE_FOR_WORKING"],
          model: mssqlInitModel.EMPLOYMENT,
          required: true,
          as: "EMPLOYMENT",
        }
      ],
      raw: true,
    })

    const anniversaryRemainder = personal.filter((person) => {
      const hireDate = new Date(person["EMPLOYMENT.HIRE_DATE_FOR_WORKING"]);
      const hireDateThisYear = new Date(today.getFullYear(), hireDate.getMonth(), hireDate.getDate());
      const diffTime = Math.abs(hireDateThisYear - today);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return diffDays <= thresholdDays;
    });

    return res.status(200).json(anniversaryRemainder);
  } catch (error) {
    return res.status(500).json({ statusCode: 500, error: error.message });
  }
};

// 2)	An employee has accumulated more than a certain number of days of vacation time (employees With Excess Vacation)
const getListEmployeesWithExcessVacation = async (req, res) => {
  try {
    const personals = await mssqlInitModel.PERSONAL.findAll({
      attributes: ["PERSONAL_ID", "CURRENT_FIRST_NAME", "CURRENT_LAST_NAME", "CURRENT_MIDDLE_NAME", "CURRENT_GENDER"],
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

    const employes = await mySqlInitModel.employee.findAll({
      attributes: ['idEmployee', 'lastName', 'firstName', 'vacationDays'],
    })

    const employeesWithExcessVacation = employes.filter((employee) => {
      const matchData = mergeData.find(
        (data) => data.PERSONAL_ID === employee.idEmployee
      );
      
      return matchData.totalVacationDaysCurrentYear > employee.vacationDays;
    });

    const listData = employeesWithExcessVacation.map((employee) => {
      const matchData = mergeData.find(
        (data) => data.PERSONAL_ID === employee.idEmployee
      );

      return {
        idEmployee: employee.idEmployee,
        ...employee.dataValues,
        totalVacationDays: matchData.totalVacationDaysCurrentYear,
      }
    });

    return res.status(200).json(listData);
  } catch (error) {
    return res.status(500).json({ statusCode: 500, error: error.message });
  }
}

export default { 
  getListBirthdayRemainder,
  getListAnniversaryRemainder,
  getListEmployeesWithExcessVacation,
};