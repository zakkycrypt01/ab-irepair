import pkg , {Types} from "mongoose";
import { type } from "os";
import dotenv from "dotenv";
const {Schema, model} = pkg;
dotenv.config();

const productSchema = new Schema({
    id: {type: Number, required: true},
    name: {type: String, required: true},
    category : {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    image: {type: String, required: true},
});

export default model("Product", productSchema);