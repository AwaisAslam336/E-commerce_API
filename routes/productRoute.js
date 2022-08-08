const express = require('express');
const multer = require('multer');
const { addProduct, getAllProduct } = require('../controllers/productController');
const path = require('path');
const {verifyToken} = require('../middlewares/auth');

const productRoutes = express();

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, '../public/productImages'),
            (error, success) => {
                if (error) throw error;
            });
    },
    filename: (req, file, callback) => {
        const name = Date.now() + '-' + file.originalname;
        callback(null, name,
            (error, success) => {
                if (error) throw error;
            });
    }
})

const upload = multer({ storage: storage });

productRoutes.post('/add', upload.array('images'), verifyToken, addProduct);

productRoutes.get('/get', verifyToken, getAllProduct);

module.exports = {productRoutes};