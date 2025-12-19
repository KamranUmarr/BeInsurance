const express = require('express');
const router = express.Router();
const Product = require('../models/product');

router.get('/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.render('admin/dashboard', { products });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/products/add', (req, res) => {
    res.render('admin/form', { product: {}, action: 'Add' });
});

router.post('/products', async (req, res) => {
    try {
        await Product.create(req.body);
        res.redirect('/admin/products');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/products/edit/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.render('admin/form', { product, action: 'Edit' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.put('/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/admin/products');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.delete('/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/admin/products');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;