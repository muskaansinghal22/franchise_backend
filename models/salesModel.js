const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    sales_id: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        required: true
    },
    totalSales: {
        type: Number,
        required: true
    },
    totalCustomers: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    collection: 'Sales'
});

const Sales = mongoose.model('Sales', salesSchema);
module.exports = Sales;