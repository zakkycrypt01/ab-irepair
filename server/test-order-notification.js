import dotenv from 'dotenv';
import TelegramOrderNotificationService from '../utils/telegramOrderNotification.js';

dotenv.config();

async function testOrderNotification() {
    console.log('🧪 Testing Telegram Order Notification...\n');

    // Check environment variables
    if (!process.env.TELEGRAM_BOT_TOKEN) {
        console.error('❌ TELEGRAM_BOT_TOKEN not found in environment variables');
        return;
    }

    if (!process.env.ADMIN_USERS) {
        console.error('❌ ADMIN_USERS not found in environment variables');
        return;
    }

    console.log('✅ Environment variables configured');

    // Test order data
    const testOrderData = {
        orderId: 'TEST_ORDER_' + Date.now(),
        customerInfo: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1234567890',
            address: '123 Test Street',
            city: 'Test City',
            country: 'Test Country',
            zipCode: '12345'
        },
        items: [
            {
                productId: 'TEST_PRODUCT_1',
                name: 'Test Product 1',
                price: 99.99,
                quantity: 2
            },
            {
                productId: 'TEST_PRODUCT_2',
                name: 'Test Product 2',
                price: 149.99,
                quantity: 1
            }
        ],
        totalPrice: 349.97,
        orderDate: new Date().toISOString()
    };

    console.log('📦 Sending test order notification...');
    
    try {
        const result = await TelegramOrderNotificationService.sendOrderNotification(testOrderData);
        
        if (result) {
            console.log('✅ Test order notification sent successfully!');
            console.log('📱 Check your Telegram bot for the notification message');
        } else {
            console.log('⚠️ Test order notification failed to send');
        }
    } catch (error) {
        console.error('❌ Error sending test notification:', error);
    }
}

testOrderNotification().catch(console.error);
