const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        fullname: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        postal: { type: String, required: true },
        country: { type: String, required: true }
    },
    items: [
        {
            title: String,
            price: Number,
            quantity: Number,
            total: Number
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'Placed',
        enum: ['Placed', 'Processing', 'Delivered'] // Preparing for Task 4
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);