const express = require('express');
const router = express.Router();
const Product = require('../models/product');

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/products', async (req, res) => {
    try {
   
        let query = {};
        
        if (req.query.category && req.query.category !== '') {
            query.category = req.query.category;
        }

        if (req.query.min || req.query.max) {
            query.price = {};
            if (req.query.min) query.price.$gte = Number(req.query.min);
            if (req.query.max) query.price.$lte = Number(req.query.max);
        }

        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 6; 
        const skip = (page - 1) * limit;
        
        const products = await Product.find(query)
            .skip(skip)
            .limit(limit);

        const count = await Product.countDocuments(query); 
        const totalPages = Math.ceil(count / limit);
        
        res.render('products', {
            products,      
            currentPage: page,
            totalPages: totalPages,
            filterParams: req.query 
        });

    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching products");
    }
});

router.get('/cart', (req, res) => {
    res.render('cart');
});

module.exports = router;