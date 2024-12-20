const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String, // URL or file path
        required: true,
    },
    video: {
        type: String, // URL or file path
        required: true,
    },
    pdf: {
        type: String, // URL or file path
        required: true,
    },
    quiz: [
        {
            question: { type: String, required: true },
            options: [String],
            correctAnswer: { type: Number, required: true }, // Index of the correct option
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});



module.exports = mongoose.model('Module', ModuleSchema);