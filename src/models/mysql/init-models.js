import { DataTypes } from "sequelize";
import employeeModel from "./employee.js";
import payratesModel from "./payrates.js";

export default function initMySQLModels(sequelize) {
  const employee = employeeModel(sequelize, DataTypes);
  const payrates = payratesModel(sequelize, DataTypes);

  employee.belongsTo(payrates, { as: "payrates", foreignKey: "payRates_idPayRates"});
  payrates.hasMany(employee, { as: "employee", foreignKey: "payRates_idPayRates"});

  return {
    employee,
    payrates,
  };
}