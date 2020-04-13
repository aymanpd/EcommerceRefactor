const mongoose = require('mongoose');
const { getNames } = require('country-list')


const shippingZonesSchema = new mongoose.Schema({

    name: { //local, international etc ..
        type: String,
        required: true
    },
    places: {
        type: [String],
        enum: getNames()
    },
    shippingMethods: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'ShippingMethod'
    }]
});


const ShippingZone = mongoose.model('ShippingZone', shippingZonesSchema);
module.exports = ShippingZone;