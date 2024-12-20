const mongoose = require('mongoose');

// Admin Schema
const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
});

// Create Admin model
const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;
