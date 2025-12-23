import { createServer } from "http";
import dotenv from "dotenv";
import connectDB from "./db.js";
import app from "./app.js";
import { initializeBot } from "./bot/index.js";

dotenv.config();
const PORT = process.env.PORT || 2000;
const uri = process.env.MONGO_URL;
const server = createServer(app);

(async () => {
    try {
        await connectDB(uri);

        // Initialize Telegram bot
        await initializeBot();

        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log('🤖 Telegram bot integration ready');

            // Health ping every 2 minutes (120000 ms)
            setInterval(() => {
                fetch(`http://localhost:${PORT}/health`)
                    .then(res => {
                        if (res.ok) console.log('✅ Health ping successful');
                        else console.error('❌ Health ping failed:', res.status);
                    })
                    .catch(err => console.error('❌ Health ping error:', err.message));
            }, 120000);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
})();

