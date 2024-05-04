import express from 'express';
import employeeController from '../controllers/employee.controller.js';

const router = express.Router({ mergeParams: true });

router.get('/', employeeController.getEmployees);
router.post('/', employeeController.createEmployee);
router.get('/get/:id', employeeController.getEmployeeById);
router.get('/benefit', employeeController.getEmployeeBenefits);
router.get('/birthday', employeeController.getListBirthdayRemainder);

export default router;