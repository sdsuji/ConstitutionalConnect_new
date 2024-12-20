// models/Newsletter.js
const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
    heading: { type: String, required: true },
    content: { type: String, required: true },
});

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

module.exports = Newsletter;

