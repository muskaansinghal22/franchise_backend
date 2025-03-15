const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dhhu49b01',
    api_key: '686695533372458',
    api_secret: 'hN62iRuunm9rtCC1GKRkQadQ9g0'
});

module.exports = cloudinary;