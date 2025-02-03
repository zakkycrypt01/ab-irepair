import {StatusCodes} from 'http-status-codes';
import Product from '../models/productDB.js';

class UserController{
    static async HttpAddProduct(request, response){
        const {id, name, category, price, description, image} = request.body;
        const newProduct = await Product.create({id, name, category, price, description, image});
        const data = {
            id: newProduct.id,
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
    static async HttpDeleteProductById(request, response){
        await Product.findByIdAndDelete(request.params.id);
        response.status(StatusCodes.NO_CONTENT).send();
    }
}

export default UserController;