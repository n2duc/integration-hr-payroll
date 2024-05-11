import express from 'express';
import employeeController from '../controllers/employee.controller.js';

const router = express.Router({ mergeParams: true });

// Get all employees
router.get('/', employeeController.getEmployees);
// Create a new employee
router.post('/', employeeController.createEmployee);
// Get an employee by id
router.get('/:id', employeeController.getEmployeeById);
// Update an employee by id
router.put('/:id', employeeController.updateEmployee);
// Delete an employee by id
router.delete('/:id', employeeController.deleteEmployee);

export default router;