import https from 'https';
import http from 'http';
import CloudinaryService from './cloudinaryService.js';

class TelegramImageHandler {
    
    /**
     * Download image from Telegram and upload to Cloudinary
     * @param {TelegramBot} bot - Telegram bot instance
     * @param {string} fileId - Telegram file ID
     * @param {string} productId - Product ID for naming
     * @returns {Promise<Object>} Cloudinary upload result
     */
    static async downloadAndUploadImage(bot, fileId, productId) {
        try {
            console.log('📥 Downloading image from Telegram...');
            
            // Get file info from Telegram
            const file = await bot.getFile(fileId);
            const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;
            
            console.log('🔗 File URL:', fileUrl);
            
            // Download image buffer
            const imageBuffer = await this.downloadImageBuffer(fileUrl);
            
            console.log('📤 Uploading image to Cloudinary...');
            
            // Upload to Cloudinary
            const fileName = `${productId}_${Date.now()}`;
            const uploadResult = await CloudinaryService.uploadImageBuffer(
                imageBuffer, 
                fileName, 
                'ab-irepair/products'
            );
            
            console.log('✅ Image uploaded successfully:', uploadResult.secure_url);
            
            return {
                success: true,
                url: uploadResult.secure_url,
                publicId: uploadResult.public_id,
                originalSize: imageBuffer.length,
                cloudinaryResult: uploadResult
            };
            
        } catch (error) {
            console.error('❌ Error downloading/uploading image:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Download image buffer from URL
     * @param {string} url - Image URL
     * @returns {Promise<Buffer>} Image buffer
     */
    static downloadImageBuffer(url) {
        return new Promise((resolve, reject) => {
            const protocol = url.startsWith('https') ? https : http;
            
            protocol.get(url, (response) => {
                if (response.statusCode !== 200) {
                    reject(new Error(`Failed to download image: ${response.statusCode}`));
                    return;
                }

                const chunks = [];
                
                response.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                
                response.on('end', () => {
                    const buffer = Buffer.concat(chunks);
                    resolve(buffer);
                });
                
                response.on('error', (error) => {
                    reject(error);
                });
                
            }).on('error', (error) => {
                reject(error);
            });
        });
    }

    /**
     * Get image info from Telegram
     * @param {TelegramBot} bot - Telegram bot instance
     * @param {string} fileId - Telegram file ID
     * @returns {Promise<Object>} File info
     */
    static async getImageInfo(bot, fileId) {
        try {
            const file = await bot.getFile(fileId);
            return {
                file_id: fileId,
                file_path: file.file_path,
                file_size: file.file_size,
                file_url: `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`
            };
        } catch (error) {
            console.error('Error getting image info:', error);
            throw error;
        }
    }

    /**
     * Validate image file
     * @param {Object} file - Telegram file object
     * @returns {boolean} Validation result
     */
    static validateImage(file) {
        const maxSize = 20 * 1024 * 1024; // 20MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        
        if (file.file_size > maxSize) {
            return { valid: false, error: 'File size too large (max 20MB)' };
        }
        
        return { valid: true };
    }
}

export default TelegramImageHandler;
