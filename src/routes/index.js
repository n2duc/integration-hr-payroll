import express from "express";
import employeeRoute from "./employee.route.js";
import vacationRoute from "./vacation.route.js";
import payrollRoute from "./payroll.route.js";
import incomeRoute from "./income.route.js";

const router = express.Router();

router.use("/employees", employeeRoute);
router.use("/vacations", vacationRoute);
router.use("/payrolls", payrollRoute);
router.use("/incomes", incomeRoute);

export default router;