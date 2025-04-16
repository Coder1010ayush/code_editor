const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true,
        trim: true,
    },
    enrol_no: {
        type: String,
        trim: true,
    },
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email',
        ],
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 5,
        select: false,
    },
    
    submissions: {
        type: [mongoose.Schema.Types.ObjectId], 
        ref: 'Submission', 
        default: [],
    },
    contests: {
        type: [mongoose.Schema.Types.ObjectId], 
        ref: 'Contest', 
        default: [],
    },
}, {
    timestamps: true, 
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    // Hash the password with cost factor 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare entered password with hashed password in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
    console.log("init password is ", this.password);
    console.log("init password is ", enteredPassword);
    return await bcrypt.compare(enteredPassword, this.password);
    // return await this.password == enteredPassword;
};

module.exports = mongoose.model('User', userSchema, 'Users');
