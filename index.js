const express = require('express');
const connectToDB = require('./config/database');
require('dotenv').config() ; 
const cookieParser = require('cookie-parser')
const cors = require('cors');




const app = express() ; 

app.use(express.json()) ; 
app.use(cors()) ; 
app.use(cookieParser()) ; 

app.use('/user' , require('./routes/userRoutes') )  ; 
app.use('/request' , require('./routes/requestRoutes')) ; 





const port  = process.env.PORT ; 
app.listen(port  , ()=>{
    console.log(`Process started at Port ${port}`);
})

connectToDB()  ; 