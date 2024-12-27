const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');// get this from npm multer storage cloudnary

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
cloudinary: cloudinary,
params: {
    folder: "wanderlust_DEV",
    allowedFormat:["png", "jpg","jpeg"],
},
});

module.exports = { cloudinary, storage };