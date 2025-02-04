import {Router} from 'express';
import UserController from '../controllers/user.controller.js';
import { get } from 'http';
const userRouter = Router();
userRouter
    .post('/addproduct', UserController.HttpAddProduct)
    .get('/products', UserController.HttpGetAllProducts)
    .get('/products/:name', UserController.HttpGetProductByName)
    .delete('/products/:productId', UserController.HttpDeleteProductById);

export default userRouter;