import express from 'express';
import alertController from '../controllers/alert.controller.js';

const router = express.Router({ mergeParams: true });

// Get all alerts for birthday
router.get('/birthday', alertController.getListBirthdayRemainder);
// Get all alerts for anniversary
router.get('/anniversary', alertController.getListAnniversaryRemainder);
// Get all alerts for employee with excess vacation
router.get('/excess-vacation', alertController.getListEmployeesWithExcessVacation);

export default router;