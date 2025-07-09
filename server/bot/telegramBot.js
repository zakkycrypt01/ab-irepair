import TelegramBot from 'node-telegram-bot-api';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import UserController from '../controllers/user.controller.js';
import CloudinaryService from '../utils/cloudinaryService.js';
import TelegramImageHandler from '../utils/telegramImageHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class TelegramStockBot {
    constructor() {
        this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { 
            polling: {
                interval: 1000,
                autoStart: false,
                params: {
                    timeout: 10
                }
            }
        });
        this.adminUsers = process.env.ADMIN_USERS ? process.env.ADMIN_USERS.split(',').map(id => parseInt(id)) : [];
        this.awaitingProductData = new Map();
        this.isRunning = false;
        this.setupBot();
    }

    setupBot() {
        console.log('Setting up Telegram bot...');
        
        // Handle /start command
        this.bot.onText(/\/start/, (msg) => {
            const chatId = msg.chat.id;
            const welcomeMessage = `
🏪 Welcome to AB-iRepair Stock Management Bot!

Available commands:
📦 /addstock - Add new product to inventory
📋 /viewstock - View all products
🗑️ /deletestock - Delete a product
❌ /cancel - Cancel current operation
ℹ️ /help - Show this help message

Only authorized admins can use this bot.
            `;
            this.bot.sendMessage(chatId, welcomeMessage);
        });

        // Handle /help command
        this.bot.onText(/\/help/, (msg) => {
            const chatId = msg.chat.id;
            const helpMessage = `
📖 Help - Available Commands:

📦 /addstock - Add new product to inventory
   • You'll be guided through entering product details
   • You can send product images
   
📋 /viewstock - View all products in inventory
   • Shows all products with their details
   
🗑️ /deletestock - Delete a product from inventory
   • You'll need to provide the product ID
   
❌ /cancel - Cancel current operation
   • Cancels any ongoing product creation or deletion
   
ℹ️ /help - Show this help message

Note: Only authorized admins can use this bot.
            `;
            this.bot.sendMessage(chatId, helpMessage);
        });

        // Handle /addstock command
        this.bot.onText(/\/addstock/, (msg) => {
            const chatId = msg.chat.id;
            
            if (!this.isAdmin(msg.from.id)) {
                this.bot.sendMessage(chatId, '❌ You are not authorized to use this bot.');
                return;
            }

            this.startProductInput(chatId);
        });

        // Handle /viewstock command
        this.bot.onText(/\/viewstock/, async (msg) => {
            const chatId = msg.chat.id;
            
            if (!this.isAdmin(msg.from.id)) {
                this.bot.sendMessage(chatId, '❌ You are not authorized to use this bot.');
                return;
            }

            await this.viewAllProducts(chatId);
        });

        // Handle /deletestock command
        this.bot.onText(/\/deletestock/, (msg) => {
            const chatId = msg.chat.id;
            
            if (!this.isAdmin(msg.from.id)) {
                this.bot.sendMessage(chatId, '❌ You are not authorized to use this bot.');
                return;
            }

            this.bot.sendMessage(chatId, 'Please enter the Product ID to delete:');
            this.awaitingProductData.set(chatId, { step: 'delete_product_id', timestamp: Date.now() });
        });

        // Handle /cancel command
        this.bot.onText(/\/cancel/, (msg) => {
            const chatId = msg.chat.id;
            
            if (!this.isAdmin(msg.from.id)) {
                this.bot.sendMessage(chatId, '❌ You are not authorized to use this bot.');
                return;
            }

            if (this.awaitingProductData.has(chatId)) {
                this.awaitingProductData.delete(chatId);
                this.bot.sendMessage(chatId, '✅ Operation cancelled. You can start a new operation anytime.');
            } else {
                this.bot.sendMessage(chatId, 'ℹ️ No operation to cancel.');
            }
        });

        // Handle regular messages
        this.bot.on('message', (msg) => {
            const chatId = msg.chat.id;
            const text = msg.text;

            if (!this.isAdmin(msg.from.id)) {
                return;
            }

            // Skip command messages
            if (text && text.startsWith('/')) {
                return;
            }

            // Only handle text messages in this handler
            if (!text) {
                return;
            }

            this.handleProductInput(chatId, msg);
        });

        // Handle photo uploads
        this.bot.on('photo', (msg) => {
            const chatId = msg.chat.id;
            
            if (!this.isAdmin(msg.from.id)) {
                return;
            }

            this.handlePhotoUpload(chatId, msg);
        });

        console.log('Telegram bot setup complete!');
    }

    isAdmin(userId) {
        return this.adminUsers.includes(userId) || this.adminUsers.length === 0;
    }

    startProductInput(chatId) {
        const productData = {
            step: 'name',
            productId: this.generateProductId(),
            name: '',
            category: '',
            price: '',
            description: '',
            image: '',
            imagePublicId: '',
            timestamp: Date.now()
        };

        this.awaitingProductData.set(chatId, productData);
        
        // Set timeout to clear data after 10 minutes
        setTimeout(() => {
            const currentData = this.awaitingProductData.get(chatId);
            if (currentData && currentData.timestamp === productData.timestamp) {
                this.awaitingProductData.delete(chatId);
                this.bot.sendMessage(chatId, '⏰ Product creation timed out. Please start again with /addstock');
            }
        }, 10 * 60 * 1000); // 10 minutes

        this.bot.sendMessage(chatId, `📦 Adding new product (ID: ${productData.productId})

Please enter the product name:`);
    }

    async handleProductInput(chatId, msg) {
        const productData = this.awaitingProductData.get(chatId);
        
        if (!productData) {
            return;
        }

        const text = msg.text;
        
        // Check if text is undefined or null
        if (!text) {
            this.bot.sendMessage(chatId, '❌ Please send a text message. Images should be sent only when prompted for product image.');
            return;
        }

        switch (productData.step) {
            case 'name':
                if (!text || text.trim() === '') {
                    this.bot.sendMessage(chatId, '❌ Product name cannot be empty. Please enter a product name:');
                    return;
                }
                productData.name = text.trim();
                productData.step = 'category';
                this.bot.sendMessage(chatId, 'Great! Now enter the product category:');
                break;

            case 'category':
                if (!text || text.trim() === '') {
                    this.bot.sendMessage(chatId, '❌ Product category cannot be empty. Please enter a category:');
                    return;
                }
                productData.category = text.trim();
                productData.step = 'price';
                this.bot.sendMessage(chatId, 'Perfect! Now enter the product price:');
                break;

            case 'price':
                if (!text || isNaN(text) || parseFloat(text) <= 0) {
                    this.bot.sendMessage(chatId, '❌ Please enter a valid price (numbers only):');
                    return;
                }
                productData.price = parseFloat(text);
                productData.step = 'description';
                this.bot.sendMessage(chatId, 'Excellent! Now enter the product description:');
                break;

            case 'description':
                if (!text || text.trim() === '') {
                    this.bot.sendMessage(chatId, '❌ Product description cannot be empty. Please enter a description:');
                    return;
                }
                productData.description = text.trim();
                productData.step = 'image';
                this.bot.sendMessage(chatId, `Almost done! Please send a product image or type "skip" to continue without image.

📷 Image will be uploaded to cloud storage for better performance.
💡 Tip: Send high-quality images for best results!`);
                break;

            case 'image':
                if (text && text.toLowerCase() === 'skip') {
                    productData.image = '';
                    await this.saveProduct(chatId, productData);
                } else {
                    this.bot.sendMessage(chatId, '📷 Please send an image file or type "skip" to continue without image.');
                }
                break;

            case 'delete_product_id':
                if (!text || text.trim() === '') {
                    this.bot.sendMessage(chatId, '❌ Please enter a valid Product ID:');
                    return;
                }
                await this.deleteProduct(chatId, text.trim());
                break;

            default:
                this.bot.sendMessage(chatId, '❌ Something went wrong. Please try again with /addstock');
                this.awaitingProductData.delete(chatId);
        }
    }    async handlePhotoUpload(chatId, msg) {
        const productData = this.awaitingProductData.get(chatId);
        
        if (!productData || productData.step !== 'image') {
            this.bot.sendMessage(chatId, '❌ Please use /addstock to start adding a product first.');
            return;
        }

        try {
            // Check if photo exists
            if (!msg.photo || msg.photo.length === 0) {
                this.bot.sendMessage(chatId, '❌ No photo received. Please send a photo or type "skip".');
                return;
            }

            // Get the largest photo
            const photo = msg.photo[msg.photo.length - 1];
            const fileId = photo.file_id;
            
            if (!fileId) {
                this.bot.sendMessage(chatId, '❌ Error processing photo. Please try again.');
                return;
            }

            // Check if Cloudinary is configured
            if (!CloudinaryService.isConfigured()) {
                console.error('Cloudinary is not configured');
                this.bot.sendMessage(chatId, '❌ Image upload service is not configured. Please contact admin.');
                return;
            }

            // Show uploading message
            this.bot.sendMessage(chatId, '📤 Uploading image to cloud storage...');

            // Download from Telegram and upload to Cloudinary
            const uploadResult = await TelegramImageHandler.downloadAndUploadImage(
                this.bot, 
                fileId, 
                productData.productId
            );

            if (uploadResult.success) {
                // Store the Cloudinary URL as the image
                productData.image = uploadResult.url;
                productData.imagePublicId = uploadResult.publicId;
                
                this.bot.sendMessage(chatId, '✅ Image uploaded successfully!');
                await this.saveProduct(chatId, productData);
            } else {
                console.error('Upload failed:', uploadResult.error);
                this.bot.sendMessage(chatId, `❌ Failed to upload image: ${uploadResult.error}. Please try again or type "skip".`);
            }
            
        } catch (error) {
            console.error('Error handling photo upload:', error);
            this.bot.sendMessage(chatId, '❌ Error uploading image. Please try again or type "skip".');
        }
    }

    async saveProduct(chatId, productData) {
        try {
            const product = {
                productId: productData.productId,
                name: productData.name,
                category: productData.category,
                price: productData.price,
                description: productData.description,
                image: productData.image
            };

            // Create a mock request/response for the controller
            const mockRequest = { body: product };
            const mockResponse = {
                status: (code) => ({
                    json: (data) => {
                        if (code === 201) {
                            this.sendProductSummary(chatId, product);
                        } else {
                            this.bot.sendMessage(chatId, '❌ Error saving product. Please try again.');
                        }
                    }
                })
            };

            await UserController.HttpAddProduct(mockRequest, mockResponse);
            this.awaitingProductData.delete(chatId);

        } catch (error) {
            console.error('Error saving product:', error);
            this.bot.sendMessage(chatId, '❌ Error saving product. Please try again.');
            this.awaitingProductData.delete(chatId);
        }
    }

    sendProductSummary(chatId, product) {
        const summary = `
✅ Product Added Successfully!

📦 Product ID: ${product.productId}
📝 Name: ${product.name}
🏷️ Category: ${product.category}
💰 Price: $${product.price}
📄 Description: ${product.description}
${product.image ? '📷 Image: Uploaded to cloud storage' : '📷 Image: None'}

The product has been added to your inventory!
        `;

        this.bot.sendMessage(chatId, summary);
        
        // If there's an image, send it as a preview
        if (product.image && product.image.startsWith('http')) {
            this.bot.sendPhoto(chatId, product.image, {
                caption: `📷 Product image for: ${product.name}`
            }).catch(error => {
                console.error('Error sending image preview:', error);
            });
        }
    }

    async viewAllProducts(chatId) {
        try {
            const mockRequest = {};
            const mockResponse = {
                status: (code) => ({
                    json: (data) => {
                        if (code === 200) {
                            this.displayProducts(chatId, data);
                        } else {
                            this.bot.sendMessage(chatId, '❌ Error retrieving products.');
                        }
                    }
                })
            };

            await UserController.HttpGetAllProducts(mockRequest, mockResponse);

        } catch (error) {
            console.error('Error retrieving products:', error);
            this.bot.sendMessage(chatId, '❌ Error retrieving products. Please try again.');
        }
    }

    displayProducts(chatId, products) {
        if (!products || products.length === 0) {
            this.bot.sendMessage(chatId, '📦 No products in inventory.');
            return;
        }

        let message = '📋 Current Inventory:\n\n';
        
        products.forEach((product, index) => {
            const hasImage = product.image && (product.image.startsWith('http') || product.image.startsWith('https'));
            message += `${index + 1}. 📦 ${product.name}\n`;
            message += `   🆔 ID: ${product.productId}\n`;
            message += `   🏷️ Category: ${product.category}\n`;
            message += `   💰 Price: $${product.price}\n`;
            message += `   📄 Description: ${product.description}\n`;
            message += `   ${hasImage ? '📷 Cloud Image Available' : '📷 No Image'}\n\n`;
        });

        // Split message if it's too long
        if (message.length > 4096) {
            const chunks = this.splitMessage(message, 4096);
            chunks.forEach(chunk => {
                this.bot.sendMessage(chatId, chunk);
            });
        } else {
            this.bot.sendMessage(chatId, message);
        }

        // Send images for products that have them (limit to first 3 to avoid spam)
        const productsWithImages = products.filter(p => p.image && p.image.startsWith('http')).slice(0, 3);
        
        if (productsWithImages.length > 0) {
            this.bot.sendMessage(chatId, '📸 Product Images:');
            
            productsWithImages.forEach((product, index) => {
                setTimeout(() => {
                    this.bot.sendPhoto(chatId, product.image, {
                        caption: `📦 ${product.name} - $${product.price}`
                    }).catch(error => {
                        console.error('Error sending product image:', error);
                    });
                }, index * 500); // Delay to avoid rate limiting
            });
        }
    }

    async deleteProduct(chatId, productId) {
        try {
            const mockRequest = { params: { productId } };
            const mockResponse = {
                status: (code) => ({
                    send: () => {
                        if (code === 204) {
                            this.bot.sendMessage(chatId, `✅ Product ${productId} has been deleted successfully!`);
                        } else {
                            this.bot.sendMessage(chatId, '❌ Error deleting product. Please check the Product ID.');
                        }
                    },
                    json: (data) => {
                        this.bot.sendMessage(chatId, '❌ Error deleting product. Please try again.');
                    }
                })
            };

            await UserController.HttpDeleteProductByproductId(mockRequest, mockResponse);
            this.awaitingProductData.delete(chatId);

        } catch (error) {
            console.error('Error deleting product:', error);
            this.bot.sendMessage(chatId, '❌ Error deleting product. Please try again.');
            this.awaitingProductData.delete(chatId);
        }
    }

    generateProductId() {
        return 'PROD_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5).toUpperCase();
    }

    splitMessage(message, maxLength) {
        const chunks = [];
        let currentChunk = '';
        const lines = message.split('\n');

        for (const line of lines) {
            if (currentChunk.length + line.length + 1 <= maxLength) {
                currentChunk += line + '\n';
            } else {
                if (currentChunk) {
                    chunks.push(currentChunk);
                }
                currentChunk = line + '\n';
            }
        }

        if (currentChunk) {
            chunks.push(currentChunk);
        }

        return chunks;
    }

    start() {
        if (this.isRunning) {
            console.log('🤖 Telegram bot is already running');
            return;
        }

        console.log('🤖 Starting Telegram Stock Bot...');
        
        // Handle bot errors
        this.bot.on('error', (error) => {
            console.error('Bot error:', error.message);
            if (error.code === 'EFATAL') {
                console.error('Fatal error occurred. Bot will restart automatically...');
                this.restart();
            } else if (error.code === 'ETELEGRAM') {
                console.error('Telegram API error. Please check your bot token.');
            } else {
                console.error('Unexpected error occurred:', error.code);
            }
        });

        // Handle polling errors
        this.bot.on('polling_error', (error) => {
            console.error('Polling error:', error.message);
            if (error.code === 'ETELEGRAM') {
                console.error('Telegram API error. Check your bot token.');
            } else if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND' || error.code === 'EFATAL') {
                console.error('Network error. Bot will retry automatically...');
                setTimeout(() => {
                    if (!this.isRunning) {
                        console.log('🔄 Retrying bot connection...');
                        this.start();
                    }
                }, 5000);
            }
        });

        // Handle webhook errors
        this.bot.on('webhook_error', (error) => {
            console.error('Webhook error:', error.message);
        });

        try {
            this.bot.startPolling();
            this.isRunning = true;
            console.log('🤖 Telegram Stock Bot is running...');
        } catch (error) {
            console.error('Error starting bot:', error.message);
            this.isRunning = false;
        }
    }

    stop() {
        if (!this.isRunning) {
            console.log('🛑 Telegram bot is not running');
            return;
        }

        console.log('🛑 Stopping Telegram bot...');
        try {
            this.bot.stopPolling();
            this.isRunning = false;
            console.log('🛑 Telegram bot stopped');
        } catch (error) {
            console.error('Error stopping bot:', error.message);
        }
    }

    restart() {
        console.log('🔄 Restarting Telegram bot...');
        this.stop();
        setTimeout(() => {
            this.start();
        }, 2000);
    }
}

export default TelegramStockBot;
