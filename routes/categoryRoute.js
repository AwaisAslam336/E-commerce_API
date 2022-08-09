const express = require('express');
const {verifyToken} = require('../middlewares/auth');
const { addCatogory, countCategories } = require('../controllers/categoryController');

const categoryRoutes = express();

categoryRoutes.post('/add', verifyToken, addCatogory);

categoryRoutes.get('/count', verifyToken, countCategories);

module.exports = { categoryRoutes }