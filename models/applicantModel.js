const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
    valid_id: String,
    namee: String,
    email: String,
    mobile: String,
    address: String,
    existingBusiness: String,
    businessSince: String,
    siteInfo: String,
    siteAddress: String,
    city: String,
    totalArea: String,
    floor: String,
    ownership: String,
    imageUrl: {
        type: String,
        required: false,
        trim: true
    },
    applicationDate: { type: Date, default: Date.now },
    status: { type: Number, default: 0 } 
}, { collection: 'applicantforms' });

if (mongoose.models.ApplicantForm) {
    delete mongoose.models.ApplicantForm;
}

const ApplicantForm = mongoose.model('ApplicantForm', applicantSchema);
module.exports = ApplicantForm;