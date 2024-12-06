require('dotenv').config();
const express = require('express');
const { create } = require('express-handlebars');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const routes = require('./server/routes/user');
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
// Cấu hình session
app.use(cookieParser());
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'defaultSecret',
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false, // Đặt true nếu dùng HTTPS
            httpOnly: true, // Bảo mật cookie
            maxAge: 3600000, // Hạn sử dụng: 1 giờ
        }
    })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.engine('hbs', create({ extname: '.hbs' }).engine);
app.set('view engine', 'hbs');

app.use('/api', routes); // API

app.get('/', (req, res) => {
    res.redirect('/api/login');
});

app.listen(port, () => console.log(`Listening on port ${port}`));
