import express from 'express';
import benefitController from '../controllers/benefit.controller.js';

const router = express.Router({ mergeParams: true });

router.get('/', benefitController.getAverageBenefits);

export default router;