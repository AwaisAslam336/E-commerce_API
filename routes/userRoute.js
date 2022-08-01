const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const { registerUser, loginUser } = require('../controllers/userController');
const path = require('path');

const userRoutes = express();

userRoutes.use(bodyParser.json());
userRoutes.use(bodyParser.urlencoded({ extended: true }));
userRoutes.use(express.static('public'));

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, '../public/userImages'),
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

userRoutes.post('/register', upload.single('image'), registerUser);

userRoutes.post('/login', loginUser);

module.exports = {userRoutes};