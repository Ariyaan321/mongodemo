const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        Username: {
            type: String,
            required: true
        },
        Email: {
            type: String,
            required: true
        },
        Phone: {
            type: Number,
            required: true
        }
    });

const User = mongoose.model('User', userSchema);

module.exports = User;
