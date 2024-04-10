import express from 'express';
import employeeRoute from './employee.route.js';

const router = express.Router();

router.use('/employees', employeeRoute);

export default router;