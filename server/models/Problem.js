// server/models/Problem.js

const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema({
    title: String,
    question: String,
    descr: String,
    test_cases: [mongoose.Schema.Types.Mixed],
    difficulty: String,
    category: String,
});

module.exports = mongoose.model('Problem', ProblemSchema, 'Questions');
