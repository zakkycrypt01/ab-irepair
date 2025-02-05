import pkg,{Types} from "mongoose";
import dotenv from "dotenv";
const {Schema, model} = pkg;
dotenv.config();

const orderSchema = new Schema({
    productId : {type: String, required: true},
    name : {type: String, required: true},
    price: {type: Number, required: true},
    quantity: {type: Number, required: true},
});

export default model("Order", orderSchema);