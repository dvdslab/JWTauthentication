const jwt = require('jsonwebtoken');
const User = require('../model/user');
require('dotenv').config()

// Authorize user
const Auth = (req, res, next) => {
    if (req.cookies.token) {
        const token = req.cookies.token;
        if (token) {
            jwt.verify(token, process.env.JWTSECRET, (err, decodedToken) => {
                if (err) {
                    res.redirect('/login');
                } else {
                    next();
                }
            });
        } else {
            res.redirect('/login');
        }
    }
    if(req.user){
        req.user ? next() : res.sendStatus(401);
    }
}

// Check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, process.env.JWTSECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                next();
            } else {
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
}

module.exports = {
    Auth,
    checkUser
};