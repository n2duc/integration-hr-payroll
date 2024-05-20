import express from 'express';
import alertController from '../controllers/alert.controller.js';

const router = express.Router({ mergeParams: true });

// Get all alerts for birthday
router.get('/birthday', alertController.getListBirthdayRemainder);
// Get all alerts for anniversary
router.get('/anniversary', alertController.getListAnniversaryRemainder);
// Get all alerts for employee with excess vacation
router.get('/excess-vacation', alertController.getListEmployeesWithExcessVacation);
// Employees make a change to their benefits plan that affects their payroll
router.get('/benefit-plan-change', alertController.getEmployeesChangeBenefitPlan);

export default router;