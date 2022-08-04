const express = require('express');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const {verifyToken} = require('../middlewares/auth');
const { createStore } = require('../controllers/storeController');

const storeRoutes = express();

storeRoutes.use(bodyParser.json());
storeRoutes.use(bodyParser.urlencoded({ extended: true }));
storeRoutes.use(express.static('public'));

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

module.exports = { storeRoutes }