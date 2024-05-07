require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts')

const connectDB = require('./server/config/db');

const app = express();
const PORT = 3000 || process.env.PORT;

//Connect to DB
connectDB();

app.use(express.urlencoded({extended: true}));
app.use(express.json()); //allows us to pass data through forms

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