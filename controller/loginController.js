const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const FranchiseUser = require('../models/Login');
const config = require('../config/jwtConfig');

const updatePassword = async (req, res) => {
    try {
        const { franchiseId, currentPassword, newPassword } = req.body;

        // Validate inputs
        if (!franchiseId || !currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const user = await FranchiseUser.findById(franchiseId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });

    } catch (error) {
        console.error('Password update error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const savelogininfo = async (req, res) => {
    try {
        var { applicationId, username, password } = req.body;
        
        // Input validation
        if (!applicationId || !username || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Missing required fields' 
            });
        }

        // Check if user already exists
        const existingUser = await FranchiseUser.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        var salt = await bcrypt.genSalt(10);
        var hashedPassword = await bcrypt.hash(password, salt);
        // Create franchise user
        const franchiseUser = new FranchiseUser({
            applicationId,
            username,
            password: hashedPassword,
            role: 'franchise'
        });

        await franchiseUser.save();

        res.status(201).json({
            success: true,
            message: 'Franchise user created successfully'
        });

    } catch (error) {
        console.error('Error creating franchise user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create franchise user',
            error: error.message
        });
    }
};
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const franchiseUser = await FranchiseUser.findOne({ username });

        const isAdmin = username === "muskaanyayy@gmail.com";

        if (!franchiseUser) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const isMatch = await bcrypt.compare(password, franchiseUser.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token with user ID
        const token = jwt.sign(
            { userId: franchiseUser._id, username: franchiseUser.username },
            config.secret,
            { expiresIn: config.expiresIn }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            franchiseId: franchiseUser._id,
            username: franchiseUser.username,
            isAdmin: isAdmin
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const createLogin = async (email, password) => {
    try {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new login
        const newLogin = new Login({
            email,
            password: hashedPassword
        });

        await newLogin.save();
        return newLogin;
    } catch (error) {
        console.error('Create login error:', error);
        throw error;
    }
};

module.exports = {
    savelogininfo,
    loginUser,
    createLogin,
    updatePassword
};
