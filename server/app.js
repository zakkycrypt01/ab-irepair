import dotenv from 'dotenv';
import express,{json} from 'express';
import cors from 'cors';

import userRouter from './routes/userRouter.js';

dotenv.config();

const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://localhost:3001', 
        'https://ab-irepair.vercel.app',
        'https://ab-irepair.onrender.com',
        process.env.FRONTEND_URL
    ].filter(Boolean), // Remove any undefined values
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    preflightContinue: false,
    optionsSuccessStatus: 200
};

const app = express();

// Manual CORS headers as fallback
app.use((req, res, next) => {
    const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://ab-irepair.vercel.app',
        'https://ab-irepair.onrender.com',
        process.env.FRONTEND_URL
    ].filter(Boolean);
    
    const origin = req.headers.origin;
    
    // Log the request for debugging
    console.log(`${req.method} ${req.path} - Origin: ${origin || 'No origin'}`);
    
    if (allowedOrigins.includes(origin) || !origin) {
        res.setHeader('Access-Control-Allow-Origin', origin || '*');
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
    
    if (req.method === 'OPTIONS') {
        console.log('Handling OPTIONS preflight request');
        res.status(200).end();
        return;
    }
    
    next();
});

// Handle preflight requests
app.options('*', cors(corsOptions));

app
    .use(cors(corsOptions))
    .use(json())
    .use("/api", userRouter);
export default app;