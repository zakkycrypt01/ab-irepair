import {StatusCodes} from 'http-status-codes';
import Product from '../models/productDB.js';
import Order from '../models/orderDB.js';
import TelegramOrderNotificationService from '../utils/telegramOrderNotification.js';
import { v4 as uuidv4 } from 'uuid';

class UserController{
    static async HttpAddProduct(request, response){
        try {
            const {productId, name, category, price, description, image} = request.body;
            const newProduct = await Product.create({productId, name, category, price, description, image});
            const data = {
                productId: newProduct.productId,
                name: newProduct.name,
                category: newProduct.category,
                price: newProduct.price,
                description: newProduct.description,
                image: newProduct.image,
            }
            response.status(StatusCodes.CREATED).json(data);
        } catch (error) {
            console.error('Error adding product:', error);
            response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
                error: 'Failed to add product' 
            });
        }
    };

    static async HttpGetAllProducts(request, response){
        try {
            const products = await Product.find();
            response.status(StatusCodes.OK).json(products);
        } catch (error) {
            console.error('Error getting products:', error);
            response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
                error: 'Failed to get products' 
            });
        }
    }

    static async HttpGetProductByName(request, response){
        try {
            const name = await Product.findOne({name: request.params.name});
            response.status(StatusCodes.OK).json(name);
        } catch (error) {
            console.error('Error getting product by name:', error);
            response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
                error: 'Failed to get product' 
            });
        }
    }

    //delete product by id
    static async HttpDeleteProductByproductId(request, response){
        try {
            const productId = request.params.productId;
            await Product.findOneAndDelete({productId: productId});
            response.status(StatusCodes.NO_CONTENT).send();
        } catch (error) {
            console.error('Error deleting product:', error);
            response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
                error: 'Failed to delete product' 
            });
        }
    }

    static async HttpsAddOrder(request, response){
        try {
            const orderData = request.body;
            const orderId = uuidv4();
            
            // Create order in database
            const newOrder = await Order.create({
                orderId,
                customerInfo: orderData.customerInfo,
                items: orderData.items,
                totalPrice: orderData.totalPrice,
                orderDate: orderData.orderDate,
                paymentInfo: orderData.paymentInfo,
                status: 'pending'
            });

            // Send notification to Telegram
            try {
                const notificationData = {
                    orderId,
                    customerInfo: orderData.customerInfo,
                    items: orderData.items,
                    totalPrice: orderData.totalPrice,
                    orderDate: orderData.orderDate,
                    paymentInfo: orderData.paymentInfo
                };
                
                await TelegramOrderNotificationService.sendOrderNotification(notificationData);
            } catch (telegramError) {
                console.error('Failed to send Telegram notification:', telegramError);
                // Don't fail the order if Telegram notification fails
            }

            const responseData = {
                orderId: newOrder.orderId,
                customerInfo: newOrder.customerInfo,
                items: newOrder.items,
                totalPrice: newOrder.totalPrice,
                orderDate: newOrder.orderDate,
                paymentInfo: newOrder.paymentInfo,
                status: newOrder.status
            };
            
            response.status(StatusCodes.CREATED).json(responseData);
        } catch (error) {
            console.error('Error adding order:', error);
            response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
                error: 'Failed to add order' 
            });
        }
    }

    static async HttpGetAllOrders(request, response){
        try {
            const orders = await Order.find().sort({ createdAt: -1 });
            response.status(StatusCodes.OK).json(orders);
        } catch (error) {
            console.error('Error getting orders:', error);
            response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
                error: 'Failed to get orders' 
            });
        }
    }

    static async HttpGetOrderById(request, response){
        try {
            const orderId = request.params.orderId;
            const order = await Order.findOne({ orderId });
            
            if (!order) {
                return response.status(StatusCodes.NOT_FOUND).json({ 
                    error: 'Order not found' 
                });
            }
            
            response.status(StatusCodes.OK).json(order);
        } catch (error) {
            console.error('Error getting order by ID:', error);
            response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
                error: 'Failed to get order' 
            });
        }
    }
}

export default UserController;