import dotenv from 'dotenv';
import express,{json} from 'express';
import cors from 'cors';

import userRouter from './routes/userRouter.js';

dotenv.config();

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:5173', // Vite default
            'https://ab-irepair.vercel.app',
            'https://ab-irepair.onrender.com',
            process.env.FRONTEND_URL
        ].filter(Boolean);
        
        // Allow any localhost port for development
        if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
            return callback(null, true);
        }
        
        // Allow any Vercel deployment
        if (origin.includes('.vercel.app')) {
            return callback(null, true);
        }
        
        // Allow specific origins
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    preflightContinue: false,
    optionsSuccessStatus: 200
};

const app = express();

// Manual CORS headers as fallback
app.use((req, res, next) => {
    const origin = req.headers.origin;
    
    // Log the request for debugging
    console.log(`${req.method} ${req.path} - Origin: ${origin || 'No origin'}`);
    
    // Always set CORS headers
    if (origin) {
        // Allow localhost and Vercel deployments
        if (origin.includes('localhost') || 
            origin.includes('127.0.0.1') || 
            origin.includes('.vercel.app') ||
            origin === 'https://ab-irepair.vercel.app' ||
            origin === 'https://ab-irepair.onrender.com') {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }
    } else {
        // No origin means it's likely a direct server request
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
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