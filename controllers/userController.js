const User = require('../models/userModel');
const bcryptjs = require('bcryptjs');

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

module.exports = {
    registerUser,
}