const express = require('express');
const {verifyToken} = require('../middlewares/auth');
const { addToCart } = require('../controllers/cartController');

const cartRoutes = express();

cartRoutes.post('/add-to-cart', verifyToken, addToCart);

module.exports = { cartRoutes }