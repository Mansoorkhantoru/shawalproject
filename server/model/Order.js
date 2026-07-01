const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    items:[{
        productId:String,
        name:String,
        price:Number,
        quantity:{
            type:Number,
            default:1 
        }
    }],
    name:{
        type:String
    },
    address:{
        type:String,
        required:true
    },
    phone:{
        type:String
    },
    email:{
        type:String 
    },
    prescription:{
        type:String,
        default:null
    },
     status: {  // Add this field
        type: String,
        enum: ["Pending", "On The Way", "Received by Client"],
        default: "Pending"
    },
    createdAt:{
        type:Date ,
        default:Date.now
    }

})

module.exports = mongoose.model("MedicineOrder" , orderSchema)