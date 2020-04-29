const express = require('express');
const bodyParser = require('body-parser');
//it is also a middleware like body-parser
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');

const app = express();
//middle ware in all our routes
 app.use(bodyParser.urlencoded({extended:true}));
 //cookie sessoion middleware wiring to app
 //keys used for encrypting the cookie
 //this cookie session library adds one additional property to the req object  and that propert is req.session...its an object we can add properties to it
 app.use(cookieSession({
     keys:['jfbhifuhfiuhgfjorgfjporgjkpokrgpfm']
 }));
app.use(authRouter);
app.listen(3000,()=>{
    console.log("listening");
})
