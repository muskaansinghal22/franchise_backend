const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const applicantRoutes = require('./routes/applicantRoutes');
const loginRoutes = require('./routes/loginRoutes');
const salesRoutes = require('./routes/salesRoutes');

require('dotenv').config();

const app = express();

// Enable CORS
app.use(cors({
    origin: 'https://zippy-elf-922637.netlify.app', // Your Netlify URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use('/api/applicant', applicantRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api', loginRoutes);

// MongoDB Atlas connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true  
        })
        console.log('Connected to MongoDB Atlas');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        setTimeout(connectDB, 5000);
    }
};

connectDB();

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected. Attempting to reconnect...');
    setTimeout(connectDB, 5000);
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB error:', err);
});

app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Server error occurred',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
});

module.exports=connectDB;