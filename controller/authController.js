const User = require('../model/user');
const jwt = require('jsonwebtoken');
require('dotenv').config()

// VALIDATING FUNCTIONS
const handleError = (err) => {
    let errors = {
        email: '',
        password: ''
    };
    // duplicate error code
    if (err.code === 11000) {
        errors.email = 'that email is already registered';
    }

    // validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({
            properties
        }) => {
            errors[properties.path] = properties.message;
        });
    }

    // incorrect email
    if (err.message === 'Email is not registered') {
        errors.email = 'Email is not registered';
    }

    // incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'incorrect password';

    }
    return errors;

}

const maxAge = 3 * 24 * 60 * 60
const createToken = (id) => {
    return jwt.sign({
        id
    }, process.env.JWTSECRET, {
        expiresIn: maxAge
    });
}


const signupGet = (req, res) => {
    res.render('signup');
}

const signupPost = async (req, res) => {
    const {
        email,
        password
    } = req.body
    // console.log(req.body);
    try {
        const user = await User.create({
            email,
            password
        });
        const token = createToken(user._id)
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: maxAge * 1000
        })
        res.status(201).json({
            user: user._id
        });
    } catch (err) {
        const errors = handleError(err);
        res.status(400).json({
            errors
        });
    }
}

const loginGet = (req, res) => {
    res.render('login');
}

const loginPost = async (req, res) => {
    const {
        email,
        password
    } = req.body

    try {
        const user = await User.login(email, password)
        const token = createToken(user._id)
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: maxAge * 1000
        })
        res.status(200).json({
            user: user._id
        });
    } catch (err) {
        const errors = handleError(err);
        res.status(400).json({
            errors
        });
    }
}

const logoutGet = (req, res) => {
    res.cookie('token', '', {
        maxAge: 1
    });
    res.redirect('/');
}

module.exports = {
    signupGet,
    signupPost,
    loginGet,
    loginPost,
    logoutGet
}