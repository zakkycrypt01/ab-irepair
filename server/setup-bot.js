#!/usr/bin/env node

import fs from 'fs';
import readline from 'readline';
import path from 'path';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => {
        rl.question(query, resolve);
    });
}

async function setupBot() {
    console.log('🤖 Telegram Stock Bot Setup');
    console.log('============================\n');

    console.log('This script will help you set up the Telegram bot for stock management.\n');

    // Check if .env file exists
    const envPath = path.join(process.cwd(), '.env');
    const envExamplePath = path.join(process.cwd(), '.env.example');
    
    if (fs.existsSync(envPath)) {
        const overwrite = await question('⚠️  .env file already exists. Do you want to overwrite it? (y/N): ');
        if (overwrite.toLowerCase() !== 'y') {
            console.log('Setup cancelled.');
            rl.close();
            return;
        }
    }

    let envContent = '';
    
    // Read existing .env.example if it exists
    if (fs.existsSync(envExamplePath)) {
        envContent = fs.readFileSync(envExamplePath, 'utf8');
    }

    console.log('\n📋 Please provide the following information:\n');

    // Get bot token
    console.log('1. Get your Telegram bot token:');
    console.log('   - Open Telegram and search for @BotFather');
    console.log('   - Use /newbot command and follow the prompts');
    console.log('   - Copy the bot token\n');
    
    const botToken = await question('Enter your Telegram bot token: ');
    
    if (!botToken || !botToken.includes(':')) {
        console.log('❌ Invalid bot token format. Please run the setup again.');
        rl.close();
        return;
    }

    // Get admin users
    console.log('\n2. Get your Telegram user ID:');
    console.log('   - Search for @userinfobot in Telegram');
    console.log('   - Start a conversation to get your user ID\n');
    
    const adminUsers = await question('Enter admin user IDs (comma-separated): ');

    // Get MongoDB URL
    const mongoUrl = await question('Enter MongoDB connection string (or press Enter for default): ') || 'mongodb://localhost:27017/ab-irepair';

    // Get port
    const port = await question('Enter server port (or press Enter for 2000): ') || '2000';

    // Get frontend URL
    const frontendUrl = await question('Enter frontend URL (or press Enter for default): ') || 'https://ab-irepair.vercel.app';

    // Create .env content
    const newEnvContent = `# Server Configuration
PORT=${port}
MONGO_URL=${mongoUrl}

# Frontend URL for CORS
FRONTEND_URL=${frontendUrl}

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=${botToken}
ADMIN_USERS=${adminUsers}
`;

    try {
        fs.writeFileSync(envPath, newEnvContent);
        console.log('\n✅ .env file created successfully!');
        console.log('\n🚀 Next steps:');
        console.log('1. Run "npm install" to install dependencies');
        console.log('2. Run "npm run dev" to start the server');
        console.log('3. Message your bot on Telegram to start using it');
        console.log('\n📖 Bot commands:');
        console.log('   /start - Start the bot');
        console.log('   /addstock - Add new product');
        console.log('   /viewstock - View all products');
        console.log('   /deletestock - Delete a product');
        console.log('   /help - Show help message');
    } catch (error) {
        console.error('❌ Error creating .env file:', error);
    }

    rl.close();
}

setupBot().catch(console.error);
