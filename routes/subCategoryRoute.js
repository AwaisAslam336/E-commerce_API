const express = require('express');
const {verifyToken} = require('../middlewares/auth');
const { addSubCatogory, countSubCategories } = require('../controllers/subCategoryController');

const subCategoryRoutes = express();

subCategoryRoutes.post('/add', verifyToken, addSubCatogory);

subCategoryRoutes.get('/count', verifyToken, countSubCategories);

module.exports = { subCategoryRoutes }