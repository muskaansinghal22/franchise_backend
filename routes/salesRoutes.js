const express = require('express');
const router = express.Router();
const salesController = require('../controller/salesController');
const Sales=require('../models/salesModel');

router.post('/today', async (req, res) => {
    try {
        const {email, date, totalSales, totalCustomers } = req.body;
        
        // Input validation
        if (!email || !date || !totalSales || !totalCustomers) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Generate unique sales_id
        const sales_id = nanoid(10);

        const newSale = new Sales({
            email,
            sales_id,
            date: new Date(date),
            totalSales: Number(totalSales),
            totalCustomers: Number(totalCustomers)
        });

        const savedSale = await newSale.save();
        console.log('Saved sale:', savedSale); // For debugging

        res.status(201).json({
            success: true,
            message: 'Sales data saved successfully',
            data: savedSale
        });

    } catch (error) {
        console.error('Error saving sales data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save sales data',
            error: error.message
        });
    }
});
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