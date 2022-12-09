const {
    Router
} = require('express');
const authRoute = Router();
const authController = require('../controller/authController');

authRoute.get('/signup', authController.signupGet);

authRoute.post('/signup', authController.signupPost);

authRoute.get('/login', authController.loginGet);

authRoute.post('/login', authController.loginPost);

authRoute.get('/logout', authController.logoutGet);

module.exports = authRoute;