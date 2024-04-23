import express from 'express';
import employeeRoute from './employee.route.js';
import vacationRoute from './vacation.route.js';

const router = express.Router();

router.use('/employees', employeeRoute);
router.use('/vacations', vacationRoute);

export default router;