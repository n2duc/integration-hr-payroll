import express from "express";
import employeeRoute from "./employee.route.js";
import vacationRoute from "./vacation.route.js";
import incomeRoute from "./income.route.js";
import alertRoute from "./alert.route.js";
import benefitRoute from "./benefit.route.js"
import dataRoute from "./data.route.js";

const router = express.Router();

router.use("/employees", employeeRoute);
router.use("/vacations", vacationRoute);
router.use("/incomes", incomeRoute);
router.use("/alert", alertRoute);
router.use("/benefits", benefitRoute);
router.use("/data", dataRoute);

export default router;