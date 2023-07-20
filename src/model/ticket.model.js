const mongoose = require("mongoose");

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
            required: true,
            unique: true,
    },
    purchase_datetime: {
        type: Date,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    purchaser:{
        type: String,
        required: true
    },
    products: {
        type: [
            {
                product:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"products"
                }
            }
        ],
        default:[]
    },
    }
);

ticketSchema.pre('find',function(){
    this.populate('products.product')
}) 

const ticketModel = mongoose.model(ticketCollection, ticketSchema)

module.exports = ticketModel;