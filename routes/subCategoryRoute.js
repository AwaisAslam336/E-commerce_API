const express = require('express');
const {verifyToken} = require('../middlewares/auth');
const { addSubCatogory } = require('../controllers/subCategoryController');

const subCategoryRoutes = express();

subCategoryRoutes.post('/add', verifyToken, addSubCatogory);

module.exports = { subCategoryRoutes }