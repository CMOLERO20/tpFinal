const mongoose = require("mongoose");

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"products"
                },
                quantity:{
                    type:Number
                }
            }
        ],
        default:[]
    },
               
        amount: {
            type: Number,
            default: 0
        },
        user: {
            type: String,
        
        }

});
cartSchema.pre('find',function(){
    this.populate('products')
})
const cartModel = mongoose.model(cartCollection, cartSchema);
module.exports = cartModel;