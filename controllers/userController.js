const dotenv = require('dotenv');
dotenv.config();
const User = require('../models/userModel');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const randomstring = require('randomstring');
const nodemailer = require('nodemailer');

const sendResetPasswordMail = async (name, email, token) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Reset your password',
        html: `<p>Hi ` + name + `, Please click this link to <a href="http://localhost:3000/api/reset-password?token=${token}">Reset Your Password</a>.</p>`,
    }
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        }
    })
}

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
    try {
        const user_id = req.body.user_id;
        const newPassword = req.body.new_password ? (req.body.new_password.toString()) : null;
        if (!user_id || !newPassword) {
            return res.status(400).json({ success: false, message: 'user_id or new_password is missing' });
        }
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

const forgetPassword = async (req, res) => {
    const email = req.body.email;
    try {
        const userData = await User.findOne({ email: email });

        if (userData) {
            const randomString = randomstring.generate();
            await User.updateOne({ email: email }, { $set: { token: randomString } });
            sendResetPasswordMail(userData.name, userData.email, randomString)
            res.status(200).json({
                success: true,
                message: "We have sent you a confirmation email, please check your email inbox"
            });
        }
        else {
            res.status(200).json({ success: false, message: 'Email invalid! Please check your email' });
        }

    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
const resetPassword = async (req, res) => {

    try {
        const token = req.query.token;
        const newPassword = req.body.new_password ? (req.body.new_password.toString()) : null
        if (!token || !newPassword) {
            return res.status(400).json({ success: false, message: 'Request data is missing' });
        }
        const data = await User.findOne({ token: token });

        if (data) {
            const newSecurePassword = await encryptPassword(newPassword);
            const user_id = data._id;
            const userUpdatedData = await User.findByIdAndUpdate({ _id: user_id },
                { $set: { password: newSecurePassword, token: '' } },
                { new: true });

            res.status(200).json({ success: true, message: "Password has been reset.", Data: userUpdatedData });
        }
        else {
            res.status(200).json({ success: false, message: 'Token is expired or invalid.' });
        }

    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

module.exports = {
    registerUser,
    loginUser,
    updatePassword,
    forgetPassword,
    resetPassword,
}