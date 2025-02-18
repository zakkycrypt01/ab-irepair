import {StatusCodes} from 'http-status-codes';
import Product from '../models/productDB.js';
import Order from '../models/orderDB.js';

class UserController{
    static async HttpAddProduct(request, response){
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
    };

    static async HttpGetAllProducts(request, response){
        const products = await Product.find();
        response.status(StatusCodes.OK).json(products);
    }

    static async HttpGetProductByName(request, response){
        const name = await Product.findOne({name: request.params.name});
        response.status(StatusCodes.OK).json(name);
    }

    //delete product by id
    static async HttpDeleteProductByproductId(request, response){
        const productId = request.params.productId;
        await Product.findOneAndDelete({productId: productId});
        response.status(StatusCodes.NO_CONTENT).send();
    }

    static async HttpsAddOrder(request, response){
        const {productId, name, price, quantity} = request.body;
        const newOrder = await Order.create({productId, name, price, quantity});
        const data = {
            productId: newOrder.productId,
            name: newOrder.name,
            price: newOrder.price,
            quantity: newOrder.quantity,
        }
        response.status(StatusCodes.CREATED).json(data);
    }
}

export default UserController;