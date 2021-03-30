const express=require('express');
const dotenv=require('dotenv');
const morgan=require('morgan');
const bodyparser=require('body-parser');
const path=require('path');
const { dirname } = require('path');
const app=express();
const connectDB=require('./server/database/connection');

// place in src with index.js no need to import anywhere
const proxy = require('http-proxy-middleware')

module.exports = function(app) {
    // add other server routes to path array
    app.use(proxy(['/api' ], { target: 'http://localhost:3000' }));
}

dotenv.config({path:'config.env'})
const port=process.env.PORT||8080; 

//log request
app.use(morgan("tiny"));

//MOGODB CONNECTION
connectDB();

//parse request to body-parser
app.use(bodyparser.urlencoded({extended:true}));

//set view engine
app.set("view engine","ejs")

//load assests
app.use('/css',express.static(path.resolve(__dirname,'assests/css')));
app.use('/img',express.static(path.resolve(__dirname,'assests/img')));
app.use('/js',express.static(path.resolve(__dirname,'assests/js')));

//load routes
app.use('/',require('./server/routes/router'))
app.listen(port,()=>{
    console.log(`server started on port ${port}`);
});
