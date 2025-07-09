import {Router} from 'express';
import UserController from '../controllers/user.controller.js';
import { get } from 'http';
import botWebhookHandler from '../bot/webhookHandler.js';

const userRouter = Router();

// Health check endpoint
userRouter.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        cors: 'enabled'
    });
});

// Bot webhook routes
userRouter.use('/bot', botWebhookHandler);

userRouter
    .post('/addproduct', UserController.HttpAddProduct)
    .post('/addorder', UserController.HttpsAddOrder)
    .get('/products', UserController.HttpGetAllProducts)
    .get('/products/:name', UserController.HttpGetProductByName)
    .delete('/products/:productId', UserController.HttpDeleteProductByproductId);

export default userRouter;