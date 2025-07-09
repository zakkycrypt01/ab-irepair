import TelegramStockBot from './telegramBot.js';
import dotenv from 'dotenv';

dotenv.config();

let bot = null;
let retryCount = 0;
const MAX_RETRIES = 3;

export const initializeBot = async () => {
    if (!process.env.TELEGRAM_BOT_TOKEN) {
        console.warn('⚠️  TELEGRAM_BOT_TOKEN not found in environment variables. Bot will not start.');
        return null;
    }

    if (bot) {
        console.log('Bot already initialized');
        return bot;
    }

    try {
        bot = new TelegramStockBot();
        
        // Skip token validation for now - let the bot handle connection issues
        console.log('⚠️  Skipping token validation due to network issues. Bot will attempt to start...');
        
        bot.start();
        console.log('✅ Telegram bot initialized successfully');
        return bot;
    } catch (error) {
        console.error('❌ Error initializing Telegram bot:', error.message);
        
        if (error.code === 'ETELEGRAM') {
            console.error('   Please check your TELEGRAM_BOT_TOKEN');
        } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNRESET' || error.code === 'EFATAL') {
            console.error('   Network connection issue. Bot will retry automatically.');
        }
        
        return null;
    }
};

export const getBot = () => {
    return bot;
};

export const stopBot = () => {
    if (bot) {
        bot.stop();
        bot = null;
        console.log('🛑 Telegram bot stopped');
    }
};

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n🔄 Received SIGINT. Shutting down gracefully...');
    stopBot();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🔄 Received SIGTERM. Shutting down gracefully...');
    stopBot();
    process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    
    // If it's a telegram-related error, try to restart the bot
    if (reason && reason.message && reason.message.includes('ETELEGRAM')) {
        console.log('🔄 Telegram error detected. Attempting to restart bot...');
        setTimeout(() => {
            if (bot) {
                bot.restart();
            }
        }, 3000);
    }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    
    // Gracefully shutdown
    stopBot();
    process.exit(1);
});
