const express = require('express');
const multer = require('multer');
const { registerUser, loginUser, updatePassword, forgetPassword, resetPassword, logoutUser } = require('../controllers/userController');
const path = require('path');
const {verifyToken} = require('../middlewares/auth');

const userRoutes = express();

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

userRoutes.get('/test',verifyToken, function (req, res) {
    res.status(200).json('OKkk');
});

userRoutes.post('/update-password',verifyToken, updatePassword);

userRoutes.post('/forget-password',forgetPassword);

userRoutes.post('/reset-password',resetPassword);

userRoutes.get('/logout',logoutUser);

module.exports = {userRoutes};