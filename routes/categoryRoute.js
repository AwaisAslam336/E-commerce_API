const express = require('express');
const bodyParser = require('body-parser');
const {verifyToken} = require('../middlewares/auth');
const { addCatogory } = require('../controllers/categoryController');

const categoryRoutes = express();

categoryRoutes.use(bodyParser.json());
categoryRoutes.use(bodyParser.urlencoded({ extended: true }));

categoryRoutes.post('/add-category', verifyToken, addCatogory);

module.exports = { categoryRoutes }