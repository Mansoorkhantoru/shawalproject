const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    discountPrice:{
        type:Number,
        required:true 
    }, 
    description:{
        type:String,
    },
    imageUrl:{
        type:String,
        required:false
    },
    publicId:{
        type:String,
        required:false
    },
    requiresPrescription:{
    type:Boolean,
    default:false
},
   
    createdAt:{
        type:Date,
        default:Date.now
    }
    
})

module.exports = mongoose.model("Medicine" , productSchema)