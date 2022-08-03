const dotenv = require('dotenv');
dotenv.config();
const User = require('../models/userModel');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createToken = async (id) => {
    try {
        const token = await jwt.sign({ _id: id }, process.env.JWT_SECRET_KEY);
        return token;
    } catch (error) {
        console.log(error);
    }
}

const encryptPassword = async (password) => {
    try {
        return await bcryptjs.hash(password, 10);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const registerUser = async (req, res) => {
    try {
        const ePassword = await encryptPassword(req.body.password);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: ePassword,
            image: req.file.filename,
            type: req.body.type,
            mobile: req.body.mobile
        });
        const userExisted = await User.findOne({ email: req.body.email });
        if (userExisted) {
            return res.status(400).send(
                {
                    success: false,
                    message: "Error: Email already registered"
                });
        }
        const userData = await user.save();
        return res.status(200).send({ success: true, userData: userData });
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

const loginUser = async (req, res) => {
    const email = req.body.email;
    const password = (req.body.password).toString();
    const userData = await User.findOne({ email: email });
    if (userData) {
        const passwordMatch = await bcryptjs.compare(password, userData.password);
        if (passwordMatch) {
            const tokenData = await createToken(userData._id);
            const userResult = {
                _id: userData._id,
                name: userData.name,
                email: userData.email,
                password: userData.password,
                image: userData.image,
                mobile: userData.mobile,
                type: userData.type,
                token: tokenData
            }
            const response = {
                success: true,
                message: "User Details",
                data: userResult,
            }
            res.status(200).send(response);
        } else {
            res.status(403).send({ success: false, message: 'Login Details are incorrect' });
        }
    } else {
        res.status(403).send({ success: false, message: 'Login Details are incorrect' });
    }
}

const updatePassword = async (req, res) => {
    const user_id = req.body.user_id;
    const newPassword = (req.body.new_password.toString());
    if (!user_id  || !newPassword) {
        return res.status(400).json({ success: false, message: 'user_id or new_password is missing' });
    }
    try {
        const data = await User.findOne({ _id: user_id });

        if (data) {
            const newSecurePassword = await encryptPassword(newPassword);
            await User.findByIdAndUpdate({ _id: user_id },
                { $set: { password: newSecurePassword } });
            
            res.status(200).json({ success: true, message: "Password updated successfully." });
        }
        else {
            res.status(404).json({ success: false, message: 'User ID Not Found' });
        }

    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

module.exports = {
    registerUser,
    loginUser,
    updatePassword
}