const jwt = require('jsonwebtoken');
const Customer = require('../models/customer');

const authinticateCustomer = async (req, res, next) => {
    try {

        const bearerToken = req.header('Authorization');
        if (!bearerToken || bearerToken.indexOf('Bearer') == -1) {
            res.status(401).send();
        }

        const token = bearerToken.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const customer = await Customer.findById(decoded.id);
        if (!customer) {
            res.status(401).send();
            return;
        }

        req.token = token;
        req.customer = customer;
        next();
    } catch (e) {
        console.log('invalid token');
        res.status(401).send();
    }

}

module.exports = authinticateCustomer;