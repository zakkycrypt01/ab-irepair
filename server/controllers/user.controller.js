import {StatusCodes} from 'http-status-codes';
import Product from '../models/productDB.js';
import Order from '../models/orderDB.js';

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
            const {productId, name, price, quantity} = request.body;
            const newOrder = await Order.create({productId, name, price, quantity});
            const data = {
                productId: newOrder.productId,
                name: newOrder.name,
                price: newOrder.price,
                quantity: newOrder.quantity,
            }
            response.status(StatusCodes.CREATED).json(data);
        } catch (error) {
            console.error('Error adding order:', error);
            response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
                error: 'Failed to add order' 
            });
        }
    }
}

export default UserController;