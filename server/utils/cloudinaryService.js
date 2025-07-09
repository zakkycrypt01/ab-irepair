import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

class CloudinaryService {
    
    /**
     * Upload image buffer to Cloudinary
     * @param {Buffer} imageBuffer - Image buffer data
     * @param {string} fileName - Original file name
     * @param {string} folder - Cloudinary folder (optional)
     * @returns {Promise<Object>} Upload result
     */
    static async uploadImageBuffer(imageBuffer, fileName, folder = 'ab-irepair/products') {
        try {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        folder: folder,
                        public_id: `${Date.now()}_${fileName}`,
                        resource_type: 'auto',
                        transformation: [
                            { width: 800, height: 800, crop: 'limit' },
                            { quality: 'auto' },
                            { format: 'auto' }
                        ]
                    },
                    (error, result) => {
                        if (error) {
                            console.error('Cloudinary upload error:', error);
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                ).end(imageBuffer);
            });
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            throw error;
        }
    }

    /**
     * Upload image from file path to Cloudinary
     * @param {string} filePath - Path to the image file
     * @param {string} folder - Cloudinary folder (optional)
     * @returns {Promise<Object>} Upload result
     */
    static async uploadImageFile(filePath, folder = 'ab-irepair/products') {
        try {
            const fileName = path.basename(filePath, path.extname(filePath));
            
            const result = await cloudinary.uploader.upload(filePath, {
                folder: folder,
                public_id: `${Date.now()}_${fileName}`,
                transformation: [
                    { width: 800, height: 800, crop: 'limit' },
                    { quality: 'auto' },
                    { format: 'auto' }
                ]
            });

            return result;
        } catch (error) {
            console.error('Error uploading file to Cloudinary:', error);
            throw error;
        }
    }

    /**
     * Delete image from Cloudinary
     * @param {string} publicId - Public ID of the image
     * @returns {Promise<Object>} Delete result
     */
    static async deleteImage(publicId) {
        try {
            const result = await cloudinary.uploader.destroy(publicId);
            return result;
        } catch (error) {
            console.error('Error deleting image from Cloudinary:', error);
            throw error;
        }
    }

    /**
     * Get optimized image URL
     * @param {string} publicId - Public ID of the image
     * @param {Object} options - Transformation options
     * @returns {string} Optimized image URL
     */
    static getOptimizedImageUrl(publicId, options = {}) {
        const defaultOptions = {
            width: 400,
            height: 400,
            crop: 'fill',
            quality: 'auto',
            format: 'auto'
        };

        const transformOptions = { ...defaultOptions, ...options };
        
        return cloudinary.url(publicId, transformOptions);
    }

    /**
     * Check if Cloudinary is configured
     * @returns {boolean} Configuration status
     */
    static isConfigured() {
        return !!(
            process.env.CLOUDINARY_CLOUD_NAME &&
            process.env.CLOUDINARY_API_KEY &&
            process.env.CLOUDINARY_API_SECRET
        );
    }
}

export default CloudinaryService;
