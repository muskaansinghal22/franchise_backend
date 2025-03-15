const ApplicantForm = require('../models/applicantModel');
const cloudinary = require('../cloudinaryConfig');

async function savee(req, res) {
    try {
        console.log('Received form data:', req.body);
        const { imageUrl, ...otherData } = req.body;
        
        const newApplication = new ApplicantForm({
            ...otherData,
            imageUrl: imageUrl, // Store in imageUrl field instead of valid_id
            applicationDate: new Date()
        });

        const savedApplication = await newApplication.save();
        console.log('Saved application with image:', savedApplication);

        res.json({
            success: true,
            message: 'Application submitted successfully',
            data: savedApplication
        });
    } catch (error) {
        console.error('Error saving application:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function getAllApplicants(req, res) {
    try {
        const applicants = await ApplicantForm.find();
        console.log('Found applicants:', applicants); // Debug log
        
        const formattedApplicants = applicants.map(applicant => {
            const appData = applicant.toObject();
            console.log('Processing applicant imageUrl:', appData.imageUrl); // Debug log
            return appData;
        });

        res.json(formattedApplicants);
    } catch (error) {
        console.error('Error fetching applicants:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function updateApplicantStatus(req, res) {
    try {
        const { id, status } = req.body;
        const updatedApplicant = await ApplicantForm.findByIdAndUpdate(id, { status }, { new: true });
        res.json({
            success: true,
            message: 'Applicant status updated successfully',
            data: updatedApplicant
        });
    } catch (error) {
        console.error('Error updating applicant status:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function getApplicantById(req, res) {
    try {
        const { id } = req.params;
        console.log('Fetching applicant with ID:', id); // Debug log

        const applicant = await ApplicantForm.findById(id);
        console.log('Found applicant:', applicant); // Debug log

        if (!applicant) {
            return res.status(404).json({
                success: false,
                message: 'Applicant not found'
            });
        }
        res.json({
            success: true,
            data: applicant
        });
    } catch (error) {
        console.error('Error fetching applicant details:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching applicant details'
        });
    }
}

module.exports = {
    savee,
    getAllApplicants,
    updateApplicantStatus,
    getApplicantById
};
