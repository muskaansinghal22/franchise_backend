const express = require('express');
const router = express.Router();
const loginController = require('../controller/loginController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes (no authentication needed)
router.post('/franchise-login', loginController.loginUser);
router.post('/create-franchise-user', loginController.savelogininfo);

// Protected routes (need authentication)
router.use(authMiddleware);
router.get('/dashboard', (req, res) => {
    res.json({ message: 'Protected data' });
});
router.post('/update-password', authMiddleware, loginController.updatePassword);


module.exports = router;