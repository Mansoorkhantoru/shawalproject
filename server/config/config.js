const mongoose = require("mongoose")

const connect = async()=>{
    try{
        const con = await mongoose.connect(process.env.MONGO_URI)
        .then(()=>console.log("DB Connected"))
        
    }catch(error){
        console.error(error.message)
    }
}

module.exports = connect; 