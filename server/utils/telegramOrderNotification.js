import { getBot } from '../bot/index.js';

class TelegramOrderNotificationService {
    /**
     * Send order notification to Telegram
     * @param {Object} orderData - Order data including customer info and items
     * @returns {Promise<boolean>} - Success status
     */
    static async sendOrderNotification(orderData) {
        try {
            const bot = getBot();
            
            if (!bot) {
                console.warn('Telegram bot not available for order notification');
                return false;
            }

            // Find admin users to send notification to
            const adminUsers = process.env.ADMIN_USERS ? 
                process.env.ADMIN_USERS.split(',').map(id => parseInt(id.trim())) : [];

            if (adminUsers.length === 0) {
                console.warn('No admin users configured for order notifications');
                return false;
            }

            // Format order notification message
            const message = this.formatOrderMessage(orderData);

            // Send notification to all admin users
            const sendPromises = adminUsers.map(async (adminId) => {
                try {
                    await bot.bot.sendMessage(adminId, message, {
                        parse_mode: 'HTML',
                        disable_web_page_preview: true
                    });
                    console.log(`Order notification sent to admin ${adminId}`);
                    return true;
                } catch (error) {
                    console.error(`Failed to send order notification to admin ${adminId}:`, error);
                    return false;
                }
            });

            const results = await Promise.allSettled(sendPromises);
            const successCount = results.filter(r => r.status === 'fulfilled' && r.value).length;
            
            return successCount > 0;
        } catch (error) {
            console.error('Error sending order notification:', error);
            return false;
        }
    }

    /**
     * Format order data into a readable message
     * @param {Object} orderData - Order data
     * @returns {string} - Formatted message
     */
    static formatOrderMessage(orderData) {
        const { customerInfo, items, totalPrice, orderDate, orderId } = orderData;
        
        let message = `🛒 <b>New Order Received!</b>\n\n`;
        
        // Order ID and date
        message += `📋 <b>Order ID:</b> ${orderId || 'N/A'}\n`;
        message += `📅 <b>Date:</b> ${new Date(orderDate).toLocaleString()}\n\n`;
        
        // Customer information
        message += `👤 <b>Customer Information:</b>\n`;
        message += `• Name: ${customerInfo.name}\n`;
        message += `• Email: ${customerInfo.email}\n`;
        message += `• Phone: ${customerInfo.phone || 'Not provided'}\n\n`;
        
        // Shipping address
        message += `📍 <b>Shipping Address:</b>\n`;
        message += `• Address: ${customerInfo.address}\n`;
        message += `• City: ${customerInfo.city}\n`;
        message += `• Country: ${customerInfo.country}\n`;
        message += `• ZIP Code: ${customerInfo.zipCode}\n\n`;
        
        // Order items
        message += `📦 <b>Items Ordered:</b>\n`;
        items.forEach((item, index) => {
            message += `${index + 1}. ${item.name}\n`;
            message += `   • Price: $${item.price.toFixed(2)}\n`;
            message += `   • Quantity: ${item.quantity}\n`;
            message += `   • Subtotal: $${(item.price * item.quantity).toFixed(2)}\n\n`;
        });
        
        // Total
        message += `💰 <b>Total Amount: $${totalPrice.toFixed(2)}</b>\n\n`;
        
        // Footer
        message += `🏪 <i>ABTECH iREPAIR</i>\n`;
        message += `📞 Please contact the customer to confirm the order.`;
        
        return message;
    }
}

export default TelegramOrderNotificationService;
