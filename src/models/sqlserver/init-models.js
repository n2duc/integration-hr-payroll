import { DataTypes } from "sequelize";
import benefitPlanModel from "./BENEFIT_PLANS.js";
import employmentModel from "./EMPLOYMENT.js";
import employmentWorkingTimeModel from "./EMPLOYMENT_WORKING_TIME.js";
import jobHistoryModel from "./JOB_HISTORY.js";
import personalModel from "./PERSONAL.js";

export default function initMssqlModels(sequelize) {
  const BENEFIT_PLANS = benefitPlanModel(sequelize, DataTypes);
  const EMPLOYMENT = employmentModel(sequelize, DataTypes);
  const EMPLOYMENT_WORKING_TIME = employmentWorkingTimeModel(sequelize, DataTypes);
  const JOB_HISTORY = jobHistoryModel(sequelize, DataTypes);
  const PERSONAL = personalModel(sequelize, DataTypes);

  PERSONAL.belongsTo(BENEFIT_PLANS, { as: "BENEFIT_PLAN", foreignKey: "BENEFIT_PLAN_ID"});
  BENEFIT_PLANS.hasMany(PERSONAL, { as: "PERSONAL", foreignKey: "BENEFIT_PLAN_ID"});
  EMPLOYMENT_WORKING_TIME.belongsTo(EMPLOYMENT, { as: "EMPLOYMENT", foreignKey: "EMPLOYMENT_ID"});
  EMPLOYMENT.hasMany(EMPLOYMENT_WORKING_TIME, { as: "EMPLOYMENT_WORKING_TIME", foreignKey: "EMPLOYMENT_ID"});
  JOB_HISTORY.belongsTo(EMPLOYMENT, { as: "EMPLOYMENT", foreignKey: "EMPLOYMENT_ID"});
  EMPLOYMENT.hasMany(JOB_HISTORY, { as: "JOB_HISTORY", foreignKey: "EMPLOYMENT_ID"});
  EMPLOYMENT.belongsTo(PERSONAL, { as: "PERSONAL", foreignKey: "PERSONAL_ID"});
  PERSONAL.hasMany(EMPLOYMENT, { as: "EMPLOYMENT", foreignKey: "PERSONAL_ID"});

  return {
    BENEFIT_PLANS,
    EMPLOYMENT,
    EMPLOYMENT_WORKING_TIME,
    JOB_HISTORY,
    PERSONAL,
  };
}