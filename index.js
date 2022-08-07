const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {userRoutes} = require('./routes/userRoute');
const {storeRoutes} = require('./routes/storeRoute');
const {categoryRoutes} = require('./routes/categoryRoute');
const {subCategoryRoutes} = require('./routes/subCategoryRoute');
const {refreshTokenRoutes} = require('./routes/refreshTokenRoute');
const cookieParser = require('cookie-parser');
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/ECOM');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

app.use('/api/user',userRoutes);
app.use('/api/store',storeRoutes);
app.use('/api/category',categoryRoutes);
app.use('/api/sub-category',subCategoryRoutes);
app.use('/api',refreshTokenRoutes);

app.listen(3000, () => {
    console.log('server is ready');
})