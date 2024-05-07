import express from "express";

import incomeController from "../controllers/income.controller.js";

const router = express.Router({ mergeParams: true });

// Get total income
router.get("/", incomeController.getTotalIncome);

export default router;