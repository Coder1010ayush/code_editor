const mongoose = require('mongoose');


// Schema for individual attempted question
const AttemptedSchema = new mongoose.Schema({
    qid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Questions',
        required: true
    },
    sid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Submissions',
        required: true
    },
    marks: {
        type: Number,
        default: 0
    },
    kind: {
        type: String,
        required: true
    }
}, { _id: false });

// Schema for each participant
const ParticipantSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    attempted: {
        type: [AttemptedSchema],
        default: []
    },
    latest_time: {
        type: Date,
        default: Date.now
    },
    curr_score: {
        type: Number,
        default: 0
    }
}, { _id: false });

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
    participants: {
        type: [ParticipantSchema],
        default: []
    },
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
