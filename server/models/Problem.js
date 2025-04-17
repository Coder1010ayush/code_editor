// server/models/Problem.js

const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema({
    title: String,
    question: String,
    descr: String,
    test_cases: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'TestCases',
            default: [],
        },
    difficulty: String,
    category: String,
});

module.exports = mongoose.model('Problem', ProblemSchema, 'Questions');
