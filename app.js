const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()
const passport = require('./config/passport');
const app = express();
const authRoute = require('./route/authRoute');
const cookieParser = require('cookie-parser');
var session = require('express-session')
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
    app.listen(3000)
    console.log('connected');
  })
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.use(authRoute);

// is logged in 
// const isLoggedIn = (req, res, next) => {
//   console.log(req.user);
//   req.user ? next() : res.sendStatus(401);
// }

app.use(session({
  secret: 'no compitition',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google',
passport.authenticate('google', { scope: ["email", "profile", "https://www.googleapis.com/auth/calendar"], prompt: 'select_account', display: 'popup' }));

app.get('/auth/google/callback', 
passport.authenticate('google', { successRedirect: '/smoothies', failureRedirect: '/login' }),
);

app.get('/smoothies', Auth, (req, res) => res.render('smoothies'));