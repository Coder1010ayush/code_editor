const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    start_time: {
        type: Date,
        required: true,
    },
    end_time: {
        type: Date,
        required: true,
    },
    participants: [
        {
            type: String, // Usernames like "shasha14_soe"
            required: true,
        }
    ],
    questions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question',
        }
    ],
    contest_no: {
        type: Number,
        required: true,
    },
    descr: {
        rules: [
            {
                type: String,
                required: true,
            }
        ],
        marking: {
            Easy: { type: Number, default: 2 },
            Medium: { type: Number, default: 3 },
            Hard: { type: Number, default: 5 },
        }
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open',
    },
    visibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'public',
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Contest', contestSchema, 'Contests');
