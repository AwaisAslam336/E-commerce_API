const express = require('express');
const multer = require('multer');
const path = require('path');
const {verifyToken} = require('../middlewares/auth');
const { createStore, findNearestStore, countStores } = require('../controllers/storeController');

const storeRoutes = express();

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, '../public/storeImages'), (error, success) => {
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
});
const uploader = multer({ storage: storage });

storeRoutes.post('/create', verifyToken, uploader.single('logo'), createStore);

storeRoutes.post('/find-nearest', verifyToken, findNearestStore);

storeRoutes.get('/count', verifyToken, countStores);

module.exports = { storeRoutes }