import express from 'express';

import dataController from '../controllers/data.controller.js';

const router = express.Router({ mergeParams: true });

// Get list of payrates
router.get('/payrates', dataController.getListPayRates);
// Get list of benefits
router.get('/benefits', dataController.getListBenefits);

export default router;