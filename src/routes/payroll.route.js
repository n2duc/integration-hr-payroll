import express from 'express';
import payrollController from '../controllers/payroll.controller.js';

const router = express.Router({ mergeParams: true });

// Get all payrolls
router.get('/', payrollController.getEmployees);

export default router;