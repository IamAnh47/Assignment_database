require('dotenv').config();
const express = require('express');
const { create } = require('express-handlebars');
// const bodyParser = require('body-parser');
// const mssql = require('mssql');
 // Đảm bảo gọi sớm nhất trong file
// const mysql = require('mysql2');
const path = require('path');
const routes = require('./server/routes/user');
const app = express();
const port = process.env.PORT || 3000;

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));
// app.use(express.static('public')); 
app.use('/api', routes); //

app.engine('hbs', create({ extname: '.hbs' }).engine);
app.set('view engine', 'hbs');

//Router
app.get('/', (req, res) => {
    // res.send("<h2>This is my first app</h2>");
    res.render('home');
});


app.listen(port, () => console.log(`Listening on port ${port}`));

