const mongoose = require("mongoose");

const requestSchema = mongoose.Schema({
    user_id:{
        type : mongoose.Schema.Types.ObjectId , 
        ref : "Users"
    }, 
    donor_id : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : "Users" , 
        default : null 
    },
    
    status : {
        type : String , 
        default : "Pending"
    },
    desc : {
        type : String , 
        required :  true 
    },
    location : {
        type : String , 
        required :  true 
    }, 
    createdAt : {
        type : Date , 
        default : Date.now() 
    },
    updatedAT : {
        type : Date , 
        default : Date.now() 
    },



});

module.exports = mongoose.model("Request", requestSchema);
