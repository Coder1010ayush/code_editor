// server/models/Problem.js

const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema({
    title: String,
    question: String,
    descr: { type: Object, required: true },
    test_cases: [mongoose.Schema.Types.Mixed],
    difficulty: String,
    category: String,
});

module.exports = mongoose.model('Problem', ProblemSchema, 'Questions');



// const mongoose = require('mongoose');

// const ProblemSchema = new mongoose.Schema({
//     title: String,
//     question: String,
//     description: {
//         header: String,
//         example: [
//             {
//                 input: String,
//                 output: String,
//                 explanation: String,
//             }
//         ],
//         constraints: String,
//         extra: String,
//     },
//     test_cases: [mongoose.Schema.Types.Mixed],
//     difficulty: String,
//     category: String,
// });

// module.exports = mongoose.model('Problem', ProblemSchema, 'Questions');
