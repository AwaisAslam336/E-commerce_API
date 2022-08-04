const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const { registerUser, loginUser, updatePassword, forgetPassword } = require('../controllers/userController');
const path = require('path');
const {verifyToken} = require('../middlewares/auth');

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

userRoutes.get('/test',verifyToken, function (req, res) {
    res.status(200).send('OKkk');
});

userRoutes.post('/update-password',verifyToken, updatePassword);

userRoutes.post('/forget-password',forgetPassword);
module.exports = {userRoutes};