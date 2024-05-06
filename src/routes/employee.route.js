import express from 'express';
import employeeController from '../controllers/employee.controller.js';

const router = express.Router({ mergeParams: true });

// Get all employees
router.get('/', employeeController.getEmployees);
// Create a new employee
router.post('/', employeeController.createEmployee);
// Get an employee by id
router.get('/get/:id', employeeController.getEmployeeById);
// Get employee benefits
router.get('/benefit', employeeController.getEmployeeBenefits);
// Get employee birthday remainder
router.get('/birthday', employeeController.getListBirthdayRemainder);
// Update an employee by id
router.put('/update/:id', employeeController.updateEmployee);

export default router;