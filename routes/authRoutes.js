const express = require('express');
const router = express.Router();

const { register, login, logout } = require('../controllers/authController');
const rateLimiter = require('express-rate-limit')

const apiLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
    message: {
        msg: 'Too may requests from this IP, please try again after 15mins',
    }
})


router.post('/register', apiLimiter, register);
router.post('/login', apiLimiter, login);
router.get('/logout', logout);

module.exports = router;
