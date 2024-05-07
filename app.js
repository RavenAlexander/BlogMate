require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser'); //saves session 
const session = require('express-session');
const MongoStore = require('connect-mongo');

const connectDB = require('./server/config/db');

const app = express();
const PORT = 3000 || process.env.PORT;

//Connect to DB
connectDB();

//Middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json()); //allows us to pass data through forms
app.use(cookieParser());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    //cookie: {maxAge: new Date ( Date.now() + (3600000))}
   
}))

app.use(express.static(__dirname + '/public'));
//Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

app.listen(PORT, ()=> {
    console.log(`App listening on port ${PORT}`);
})