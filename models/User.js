const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    profession: { type: String, required: true },
    institution: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    otp: { type: String }, // Field to store OTP
    otpExpiry: { type: Date }, // Field to store OTP expiry time
});

const User = mongoose.model('User', userSchema);

module.exports = User;

