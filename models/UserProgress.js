const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
    moduleId: { type: String, required: true },
    score: { type: Number, required: true },
    responses: [{ question: String, userAnswer: String, correctAnswer: String }],
});

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

module.exports = UserProgress;
