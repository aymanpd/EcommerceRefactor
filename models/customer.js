const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const customerSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    shipping: [{
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        company: {
            type: String,
        },
        address1: {
            type: String,
            required: true
        },
        address2: {
            type: String,
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
        },
        postcode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        }
    }],
    isPayingCustomer: {
        type: Boolean,
        default: false
    },
    avatar: Buffer
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })


customerSchema.pre('save', async function (next) {
    const customer = this;
    if (customer.isModified('password')) {
        customer.password = await bcrypt.hash(customer.password.toString(), 8);
    }
    next();
})

customerSchema.statics.login = async (credentials) => {
    const { email = '', password = '' } = credentials;

    const customer = await Customer.findOne({ email });
    if (!customer) {
        return false;
    }

    const passwordVerify = await bcrypt.compare(password.toString(), customer.password);
    if (!passwordVerify) {
        return false;
    }

    const token = jwt.sign({ id: customer.id }, process.env.JWT_SECRET);
    return { customer, token }

}

customerSchema.methods.toJSON = function () {
    const customer = this;
    const customerObject = customer.toObject();

    delete customerObject.password;
    delete customerObject.isPayingCustomer;

    return customerObject;
}

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;