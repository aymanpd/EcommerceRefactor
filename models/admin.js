const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
});

adminSchema.pre('save', async function (next) {
    const admin = this;
    if (admin.isModified('password')) {
        admin.password = await bcrypt.hash(admin.password.toString(), 8);
    }
    next();
});

adminSchema.statics.login = async (credentials) => {
    const { email = '', password = '' } = credentials;

    const admin = await Admin.findOne({ email });
    if (!admin) {
        return false;
    }

    const passwordVerify = await bcrypt.compare(password.toString(), admin.password);
    if (!passwordVerify) {
        return false;
    }

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET);
    return token;

}
const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;