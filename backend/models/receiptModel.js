const mongoose = require('mongoose');

const receiptSchema = mongoose.Schema({
    
    date: {
        type: Date,
        required: [true, 'Please add a date']
    },
    
    items: [{
        name: {
            type: String,
            required: [true, 'Please add an item name']
        },
        price: {
            type: Number,
            required: [true, 'Please add an item price']
        },
        quantity: {
            type: Number,
            required: [true, 'Please add an item quantity']
        }
    }],
    
    approval: {
        type: Boolean,
        default: false,
    },
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    total: {
        type: Number,
        required: [true, 'Please add a total']
    }
}, 
{
    timestamps: true
})
