const express = require('express');
const {verifyToken} = require('../middlewares/auth');
const { addCatogory } = require('../controllers/categoryController');

const categoryRoutes = express();

categoryRoutes.post('/add-category', verifyToken, addCatogory);

module.exports = { categoryRoutes }