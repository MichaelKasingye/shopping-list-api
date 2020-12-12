const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
// const bodyParser = require('body-parser');
const items = require('./routes/api/items');
const users = require('./routes/api/user');
const path = require('path');
const app = express();
const dotenv = require('dotenv').config();

// console.log(dotenv.parsed)
//Bodyparser Middleware
app.use(express.json());
//config
//const db = require('./config/keys').mongoURI;

//process.env.process
let mongoLdb = process.env.MONGO_URI;
//let MONGOD_MLAB = process.env.mongoURI;
//const db = config.get('mongoURI');

//mongoo connect
mongoose
.connect(mongoLdb,{ useUnifiedTopology: true , useNewUrlParser: true, useCreateIndex:true })
.then(()=> console.log('👌 Connected to Mongodb.....Michael..'))
.catch(err => console.log('🚨 failed Server to connect..'+(err)));
 
//Use Routes
app.use('/api/items',items);
app.use('/api/users',users);
app.use('/api/auth',require('./routes/api/auth'));
//Serve static assets if in production
if(process.env.NODE_ENV === 'production'){
    //Set static folder
    app.use(express.static('client/build'));
    
    app.get('*',(req,res) => {
        res.sendFile(path.resolve(__dirname,'client','build','index.html'));
    });
    
}

const port = process.env.PORT || 5000;
app.listen(port,()=>
 console.log(`Server started at port ${port}`))

