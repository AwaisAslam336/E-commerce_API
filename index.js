const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/ECOM');

app.listen(3000, () => {
    console.log('server is ready');
})