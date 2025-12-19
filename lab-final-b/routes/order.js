const express = require('express');
const router = express.Router();
const Order = require('../models/order');

// --- MIDDLEWARE ---
const applyDiscount = (req, res, next) => {
    // Check form body OR query params for the code
    const couponCode = req.body.coupon || req.query.coupon;

    if (couponCode === 'SAVE10') {
        req.discountRate = 0.10; // 10%
        req.discountCode = 'SAVE10';
    } else {
        req.discountRate = 0.0; // 0%
        req.discountCode = null;
    }
    next(); 
};

// 1. POST /order/preview
// We inject 'applyDiscount' here
router.post('/preview', applyDiscount, async (req, res) => {
    try {
        const customer = {
            fullname: req.body.fullname,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            city: req.body.city,
            postal: req.body.postal,
            country: req.body.country
        };

        let items = [];
        let subTotal = 0; // <--- DEFINED HERE

        // Handle array vs single item vs undefined
        const titles = Array.isArray(req.body.titles) ? req.body.titles : (req.body.titles ? [req.body.titles] : []);
        const prices = Array.isArray(req.body.prices) ? req.body.prices : (req.body.prices ? [req.body.prices] : []);
        const quantities = Array.isArray(req.body.quantities) ? req.body.quantities : (req.body.quantities ? [req.body.quantities] : []);

        if (req.body.titles) {
             for (let i = 0; i < titles.length; i++) {
                let price = parseFloat(prices[i]);
                let qty = parseInt(quantities[i]);
                let total = price * qty;
                
                // Add to Subtotal (Before Discount)
                subTotal += total; 

                items.push({
                    title: titles[i],
                    price: price,
                    quantity: qty,
                    total: total
                });
            }
        }

        // Calculate Discount
        const discountAmount = subTotal * req.discountRate;
        const grandTotal = subTotal - discountAmount;

        // Render View and PASS ALL VARIABLES
        res.render('order/preview', { 
            customer, 
            items, 
            subTotal,       // <--- PASSED HERE
            discountAmount, 
            grandTotal,
            discountCode: req.discountCode
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error generating preview");
    }
});

// 2. POST /order/confirm
router.post('/confirm', async (req, res) => {
    try {
        const orderData = JSON.parse(req.body.orderData);
        // Ensure status is set
        orderData.status = 'Placed'; 
        console.log('Order module:', Order);
        console.log('Order.modelName:', Order && Order.modelName);
        console.log('Order.create type:', Order && typeof Order.create);
        console.log('Resolved path:', require.resolve('../models/order'));
        
        const newOrder = await Order.create(orderData);
        
        // Pass the actual database ID to the success page
        res.render('order/success', { orderId: newOrder._id }); 
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving order: " + err.message);
    }
});

// 3. GET /order/my-orders
// Displays form AND list (if email provided)
router.get('/my-orders', async (req, res) => {
    try {
        const email = req.query.email;
        let orders = null; // Default: No search performed yet

        if (email) {
            // DJANGO: Order.objects.filter(customer__email=email).order_by('-date')
            // MONGOOSE: Use dot notation in quotes for nested fields
            orders = await Order.find({ 'customer.email': email }).sort({ date: -1 });
        }

        res.render('order/history', { 
            orders, 
            searchedEmail: email 
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching history");
    }
});

module.exports = router;