// will be binned with authinticate customer

const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

const authinticate_admin = async (req, res, next) => {
    try {

        const bearerToken = req.header('Authorization');
        if (!bearerToken || bearerToken.indexOf('Bearer') == -1) {
            res.status(401).send();
        }

        const token = bearerToken.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            res.status(401).send();
            return;
        }

        req.token = token;
        req.admin = admin;
        next();
    } catch (e) {
        console.log('invalid token');
        res.status(401).send();
    }

}

module.exports = authinticate_admin;