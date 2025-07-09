import express from 'express';
import { getBot } from './index.js';

const router = express.Router();

// Webhook endpoint for Telegram bot (optional - for production)
router.post('/webhook', express.json(), (req, res) => {
    const bot = getBot();
    
    if (!bot) {
        return res.status(500).json({ error: 'Bot not initialized' });
    }

    try {
        // Process the update
        bot.bot.processUpdate(req.body);
        res.status(200).json({ status: 'ok' });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check for bot
router.get('/bot-status', async (req, res) => {
    const bot = getBot();
    
    if (!bot) {
        return res.status(503).json({ 
            status: 'Bot not running',
            reason: 'Bot not initialized or token missing',
            timestamp: new Date().toISOString()
        });
    }

    try {
        // Try to get bot info to verify connection
        const botInfo = await bot.bot.getMe();
        
        res.status(200).json({ 
            status: 'Bot running',
            isRunning: bot.isRunning,
            botInfo: {
                id: botInfo.id,
                username: botInfo.username,
                first_name: botInfo.first_name
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(503).json({ 
            status: 'Bot connection error',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

export default router;
