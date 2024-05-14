// import { Sequelize, where } from "sequelize";
// import { format } from "date-fns";

import db from "../configs/db.config.js";
import initMySQLModels from "../models/mysql/init-models.js";
import initMssqlModels from "../models/sqlserver/init-models.js";

const mySqlInitModel = initMySQLModels(db.mySQL);
const mssqlInitModel = initMssqlModels(db.sqlServer);

const getListPayRates = async (req, res) => {
    try {
        const payRates = await mySqlInitModel.payrates.findAll();
        return res.status(200).json(payRates);
    } catch (error) {
        return res.status(500).json({ statusCode: 500, error: error.message });
    }
}

const getListBenefits = async (req, res) => {
    try {
        const benefits = await mssqlInitModel.BENEFIT_PLANS.findAll();
        return res.status(200).json(benefits);
    } catch (error) {
        return res.status(500).json({ statusCode: 500, error: error.message });
    }
}

export default {
    getListPayRates,
    getListBenefits,
}