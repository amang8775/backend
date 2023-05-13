const mongoose = require("mongoose");
require('dotenv').config() ; 



const connectToDB = () => {
  const URL = process.env.URL;
  mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to DB "))
  .catch((error)=>{
    console.log("there is problem in db connection ") ; 
    console.log(error);
    process.exit(1) ; 
  })
};

module.exports = connectToDB ; 
