import express from 'express';
import employeeController from '../controllers/employee.controller.js';

const router = express.Router({ mergeParams: true });

router.get('/', employeeController.getListEmployee);
router.get('/all', employeeController.getAll);
router.get('/integration', employeeController.getEmployeeIntegration);
router.post('/', employeeController.createPersonal);
router.delete('/:id', employeeController.deletePersonal);

export default router;