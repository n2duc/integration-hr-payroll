import express from 'express';
import vacationController from '../controllers/vacation.controller.js';

const router = express.Router({ mergeParams: true });

router.get('/', vacationController.getTotalVacation)

export default router;