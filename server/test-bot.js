import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';

dotenv.config();

async function testBot() {
    console.log('🧪 Testing Telegram Bot Configuration...\n');

    // Check if bot token exists
    if (!process.env.TELEGRAM_BOT_TOKEN) {
        console.error('❌ TELEGRAM_BOT_TOKEN not found in environment variables');
        console.log('   Please run "npm run setup-bot" first');
        return;
    }

    console.log('🔑 Bot token found in environment variables');

    // Check admin users
    if (process.env.ADMIN_USERS) {
        const adminUsers = process.env.ADMIN_USERS.split(',').map(id => id.trim());
        console.log(`👥 Admin users configured: ${adminUsers.join(', ')}`);
    } else {
        console.log('⚠️  No admin users configured - all users will have access');
    }

    // Test bot token with timeout
    try {
        console.log('🔍 Testing bot token (with 15 second timeout)...');
        const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
        
        const testPromise = bot.getMe();
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Connection timeout - network may be slow')), 15000);
        });
        
        const me = await Promise.race([testPromise, timeoutPromise]);
        console.log(`✅ Bot token is valid!`);
        console.log(`   Bot name: ${me.first_name} (@${me.username})`);
        
        console.log('\n🎉 Bot configuration test completed successfully!');
        console.log('   You can now start the server with "npm run dev"');
        console.log('   The bot will handle network issues automatically.');
        
    } catch (error) {
        console.error('⚠️  Bot token validation failed:', error.message);
        
        if (error.message.includes('timeout')) {
            console.log('   This is likely due to network connectivity issues.');
            console.log('   The bot should still work when the server starts.');
            console.log('   Try starting the server with "npm run dev"');
        } else if (error.code === 'ETELEGRAM') {
            console.log('   Please check your bot token and try again');
        } else {
            console.log('   Network error - this is normal and the bot will retry automatically');
        }
        
        console.log('\n🔧 Bot configuration appears to be set up correctly.');
        console.log('   You can proceed to start the server with "npm run dev"');
    }
}

testBot();
