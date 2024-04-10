import express from 'express';
import employeeController from '../controllers/employee.controller.js';

const router = express.Router({ mergeParams: true });

router.get('/', employeeController.getListEmployee);
router.get('/all', employeeController.getAll);
router.post('/create', employeeController.createPersonal);

export default router;