import { createServer } from "http";
import dotenv from "dotenv";
import connectDB from "./db.js";
import app from "./app.js";
import { initializeBot } from "./bot/index.js";

dotenv.config();
const PORT = process.env.PORT|| 2000;
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
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
})();
    
