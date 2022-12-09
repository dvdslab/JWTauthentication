const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()
const app = express();
const authRoute = require('./route/authRoute');
const cookieParser = require('cookie-parser');
const {
  Auth,
  checkUser
} = require('./middleware/auth');

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = process.env.dbURI;
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then((result) => {
    app.listen(3300)
    console.log('connected');
  })
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', Auth, (req, res) => res.render('smoothies'));
app.use(authRoute);