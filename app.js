const express = require('express');
const bodyParser = require('body-parser');
const { userRoutes } = require('./routes/userRoute');
const { storeRoutes } = require('./routes/storeRoute');
const { categoryRoutes } = require('./routes/categoryRoute');
const { subCategoryRoutes } = require('./routes/subCategoryRoute');
const { productRoutes } = require('./routes/productRoute');
const { cartRoutes } = require('./routes/cartRoute');
const { refreshTokenRoutes } = require('./routes/refreshTokenRoute');
const cookieParser = require('cookie-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname +'public'));
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/sub-category', subCategoryRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api', refreshTokenRoutes);

module.exports = app;