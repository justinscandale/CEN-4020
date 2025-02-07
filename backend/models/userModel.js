const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true 
    },

    status: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
        required: [true, 'Please add a status']
    },

    password: {
        type: String,
        required: [true, 'Please add a password']
    },
}, 
{
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)