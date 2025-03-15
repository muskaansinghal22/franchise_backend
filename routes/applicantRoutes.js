const express = require('express');
const router = express.Router();
const applicantController = require('../controller/applicantController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/submit', applicantController.savee);
router.get('/', authMiddleware , applicantController.getAllApplicants);
router.put('/status', authMiddleware , applicantController.updateApplicantStatus);
router.get('/:id', authMiddleware , applicantController.getApplicantById);

module.exports = router;
