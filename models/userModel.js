const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstName :  {
       type : String , 
       required  : true  , 
    } , 
    lastName : {
        type : String , 
        required  : true  , 
    },
    email : {
        type : String , 
        required  : true  , 
        unique : true 
    } , 
    password : {
        type : String ,
        required  : true  , 

    },
    bloodGrp : {
        type : String ,
        required  : true  , 
    },
    pincode : { 
        type : Number , 
        required  : true  , 
    },
    lastDonated : {
        type : Date , 
        default : Date.now()
    },
    requests : [{
        type : mongoose.Schema.Types.ObjectId , 
        ref : "Request"
    }] , 
    donates : [{
        type : mongoose.Schema.Types.ObjectId , 
        ref : "Request"
    }] , 
    createdAt : {
        type : Date , 
        default : Date.now() 
    },
    updatedAT : {
        type : Date , 
        default : Date.now() 
    },
    

});

module.exports = mongoose.model("Users", userSchema);
