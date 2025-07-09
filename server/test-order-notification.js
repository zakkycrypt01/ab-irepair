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
            phone: '+2348123456789',
            address: '123 Test Street, Victoria Island',
            city: 'Lagos',
            country: 'Nigeria',
            zipCode: '101001'
        },
        items: [
            {
                productId: 'TEST_PRODUCT_1',
                name: 'Test Product 1',
                price: 15000,
                quantity: 2
            },
            {
                productId: 'TEST_PRODUCT_2',
                name: 'Test Product 2',
                price: 25000,
                quantity: 1
            }
        ],
        totalPrice: 55000,
        orderDate: new Date().toISOString(),
        paymentInfo: {
            transferId: 'TXN_TEST_' + Date.now(),
            paymentMethod: 'Bank Transfer',
            paymentStatus: 'pending'
        }
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
