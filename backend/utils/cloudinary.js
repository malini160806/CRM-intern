const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (fileStr) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: 'crm_profiles',
    });
    return uploadResponse.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error.message || error);
    throw new Error(`Image upload failed: ${error.message || 'Unknown error'}`);
  }
};

module.exports = { cloudinary, uploadImage };
