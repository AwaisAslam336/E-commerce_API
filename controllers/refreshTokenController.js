const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    //instead of email & password, we'r using refreshToken to generate a new accessToken
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    const userFoundData = await User.findOne({ refreshToken: refreshToken });

    if (!userFoundData) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || userFoundData._id.toString() !== decoded._id) return res.sendStatus(403);

        const accessToken = jwt.sign(
            { _id: decoded._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '5m' });
        res.json({ accessToken });
    });
}

module.exports = { handleRefreshToken }