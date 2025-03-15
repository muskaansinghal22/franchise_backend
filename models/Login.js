const mongoose = require('mongoose');

const franchiseUserSchema = new mongoose.Schema({
    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Application'
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'franchise'
    }
    },
    {
        collection: 'FranchiseUser' 
});

const FranchiseUser = mongoose.model('FranchiseUser', franchiseUserSchema);
module.exports = FranchiseUser;