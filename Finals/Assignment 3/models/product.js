const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { // Using 'title' to match your existing frontend code
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: ['electronics', 'jewelery', "men's clothing", "women's clothing"]
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/300' // Default image if none provided
    }
});

module.exports = mongoose.model('Product', productSchema);