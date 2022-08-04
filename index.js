const express = require('express');
const mongoose = require('mongoose');
const {userRoutes} = require('./routes/userRoute');
const {storeRoutes} = require('./routes/storeRoute');
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/ECOM');

app.use('/api/user',userRoutes);
app.use('/api/store',storeRoutes);

app.listen(3000, () => {
    console.log('server is ready');
})