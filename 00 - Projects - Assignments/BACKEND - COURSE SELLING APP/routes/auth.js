require('dotenv').config();
const jwt = require('jsonwebtoken');
const {UserModel} = require('../db/db')

function auth(req, res, next) {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.status(403).json({
                msg: "log in first"
            });
        }

        const decryptedToken = jwt.verify(token, process.env.JWT_SECRET);

        req.username = decryptedToken.username;
        next();

    } catch (err) {
        return res.status(403).json({
            msg: "Invalid Token"
        });
    }
}

async function admin_auth_extra(req, res, next){
    const username = req.username;

    const user = await UserModel.findOne({
        username : username
    })

    req.userId = user._id;

    if(!user.admin){
        return res.status(403).json({
            msg : "You are not Admin"
        })
    }

    next();
}

module.exports = {
    auth,
    admin_auth_extra
};