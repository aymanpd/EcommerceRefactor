const mongoose = require('mongoose');

const shippingMethodSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    fees: Number,
    timeToDeliver: Number // in days
});

const ShippingMethod = mongoose.model('ShippingMethod', shippingMethodSchema);
module.exports = ShippingMethod;