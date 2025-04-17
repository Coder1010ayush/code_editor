const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    question_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',   // <-- Reference to Questions model
        required: true,
    },
    submitted_code: {
        type: String,
        required: true,
    },
    result: {
        type: String,
        enum: ['Passed', 'Failed'],
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    lang: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Submission', submissionSchema, 'Submissions');
