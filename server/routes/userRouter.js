import {Router} from 'express';
import UserController from '../controllers/user.controller.js';
import { get } from 'http';
const userRouter = Router();
userRouter
    .post('/addproduct', UserController.HttpAddProduct)
    .post('/addorder', UserController.HttpsAddOrder)
    .get('/products', UserController.HttpGetAllProducts)
    .get('/products/:name', UserController.HttpGetProductByName)
    .delete('/products/:productId', UserController.HttpDeleteProductByproductId);

export default userRouter;