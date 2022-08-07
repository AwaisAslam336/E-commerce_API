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
        html: `<p>Hi ` + name + `, Please click this link to <a href="http://localhost:3000/api/user/reset-password?refreshToken=${token}">Reset Your Password</a>.</p>`,
    }
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        }
    })
}

const createToken = async (id) => {
    try {
        const accessToken = jwt.sign(
            { _id: id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '5m' });
        const refreshToken = jwt.sign(
            { _id: id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' });

        return { accessToken, refreshToken };
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
            const { accessToken, refreshToken } = await createToken(userData._id);
            await User.findByIdAndUpdate({ _id: userData._id },
                { $set: { refreshToken: refreshToken } });
            // accessToken needs to be stored in memory but not in locale storage or cookies
            const response = {
                success: true,
                message: "User Login Successfully",
                accessToken: accessToken,
            }
            // refresh token will be in httpOnly cookies
            res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
            res.status(200).send(response);
        } else {
            res.status(403).send({ success: false, message: 'Login Details are incorrect' });
        }
    } else {
        res.status(403).send({ success: false, message: 'Login Details are incorrect' });
    }
}

const logoutUser = async (req, res) => {
    //On client, also delete the accessToken from memory
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //no refresh token
    const refreshToken = cookies.jwt;

    const userFoundData = await User.findOne({ refreshToken: refreshToken });

    if (!userFoundData) {
        res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        return res.sendStatus(204);
    }
    // Delete refresh token in DB
    await User.findByIdAndUpdate({ _id: userFoundData._id }, { refreshToken: '' });
    res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); //secure:true in production mode
    res.status(204).json({ success: true });
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
            await User.updateOne({ email: email }, { $set: { refreshToken: randomString } });
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
        const token = req.query.refreshToken;
        const newPassword = req.body.new_password ? (req.body.new_password.toString()) : null
        if (!token || !newPassword) {
            return res.status(400).json({ success: false, message: 'Request data is missing' });
        }
        const data = await User.findOne({ refreshToken: token });

        if (data) {
            const newSecurePassword = await encryptPassword(newPassword);
            const user_id = data._id;
            const userUpdatedData = await User.findByIdAndUpdate({ _id: user_id },
                { $set: { password: newSecurePassword, refreshToken: '' } },
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
    logoutUser,
}