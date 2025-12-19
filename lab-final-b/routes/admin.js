const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Order = require('../models/order');

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

const validTransitions = {
    'Placed': ['Processing'],     // Can only go to Processing
    'Processing': ['Delivered'],  // Can only go to Delivered
    'Delivered': []               // End of life
};

// 7. GET /admin/orders - List all orders (Read)
router.get('/orders', async (req, res) => {
    try {
        // Fetch all orders, newest first
        const orders = await Order.find({}).sort({ date: -1 });
        res.render('admin/orders', { orders });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 8. POST /admin/order/status - Update Status (State Machine Logic)
router.post('/order/status', async (req, res) => {
    try {
        const { orderId, newStatus } = req.body;
        
        // 1. Find the order
        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).send("Order not found");
        }

        // 2. Validate the Transition
        const currentStatus = order.status;
        const allowedNextSteps = validTransitions[currentStatus];

        if (!allowedNextSteps.includes(newStatus)) {
            // If the move is illegal (e.g., Placed -> Delivered), stop it.
            return res.send(`
                <h2 style="color: red;">Error: Invalid Status Change</h2>
                <p>You cannot move an order from <strong>${currentStatus}</strong> directly to <strong>${newStatus}</strong>.</p>
                <p>Allowed next step: ${allowedNextSteps.join(', ') || 'None'}</p>
                <a href="/admin/orders">Go Back</a>
            `);
        }

        // 3. Apply Update
        order.status = newStatus;
        await order.save();

        res.redirect('/admin/orders');

    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;