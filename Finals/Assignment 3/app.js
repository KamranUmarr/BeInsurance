const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/product'); // Import the model

const PORT = 3000;

// 1. Database Connection
mongoose.connect('mongodb://127.0.0.1:27017/beinsurance')
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => console.log('MongoDB Connection Error:', err));

// Middleware to parse body data (needed for forms later)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// ---------------------------------------------------------
// ROUTES
// ---------------------------------------------------------

app.get('/', (req, res) => {
    res.render('index');
});

// DYNAMIC PRODUCTS ROUTE (Filter + Pagination)
app.get('/products', async (req, res) => {
    try {
        // 1. Filtering Logic
        let query = {};
        
        // Filter by Category
        if (req.query.category && req.query.category !== '') {
            query.category = req.query.category;
        }

        // Filter by Price Range (e.g. min=10&max=100)
        if (req.query.min || req.query.max) {
            query.price = {};
            if (req.query.min) query.price.$gte = Number(req.query.min);
            if (req.query.max) query.price.$lte = Number(req.query.max);
        }

        // 2. Pagination Logic
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 6; // Default 6 items per page
        const skip = (page - 1) * limit;

        // 3. Fetch Data from DB
        const products = await Product.find(query)
            .skip(skip)
            .limit(limit);

        const count = await Product.countDocuments(query); // Total items for this filter
        const totalPages = Math.ceil(count / limit);

        // 4. Render View
        res.render('products', {
            products,      // The array of product objects
            currentPage: page,
            totalPages: totalPages,
            filterParams: req.query // To keep filters active in pagination links
        });

    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching products");
    }
});

app.get('/cart', (req, res) => {
    res.render('cart');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});