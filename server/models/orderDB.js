import pkg,{Types} from "mongoose";
import dotenv from "dotenv";
const {Schema, model} = pkg;
dotenv.config();

const orderSchema = new Schema({
    orderId: {type: String, required: true, unique: true},
    customerInfo: {
        name: {type: String, required: true},
        email: {type: String, required: true},
        phone: {type: String, required: true},
        address: {type: String, required: true},
        city: {type: String, required: true},
        country: {type: String, required: true},
        zipCode: {type: String, required: true}
    },
    items: [{
        productId: {type: String, required: true},
        name: {type: String, required: true},
        price: {type: Number, required: true},
        quantity: {type: Number, required: true}
    }],
    totalPrice: {type: Number, required: true},
    orderDate: {type: Date, required: true},
    paymentInfo: {
        transferId: {type: String, required: true},
        paymentMethod: {type: String, default: 'Bank Transfer'},
        paymentStatus: {type: String, default: 'pending', enum: ['pending', 'verified', 'failed']}
    },
    status: {type: String, default: 'pending', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']}
}, {
    timestamps: true
});

export default model("Order", orderSchema);