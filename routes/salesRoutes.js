const express = require('express');
const router = express.Router();
const salesController = require('../controller/salesController');
const Sales=require('../models/salesModel');

router.post('/today', salesController.createSales);
router.get('/history', async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;
        
        const query = {
            date: {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            }
        };

        const sales = await Sales.find(query).sort({ date: -1 });
        res.json(sales);
    } catch (error) {
        console.error('Error fetching sales history:', error);
        res.status(500).json({ message: 'Error fetching sales history' });
    }
});

module.exports = router;