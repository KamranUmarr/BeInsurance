const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;

// 1. Set View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 2. Serve Static Assets (CSS, JS, Images)
// This makes files in 'public' accessible via root URL (e.g., /css/style.css)
app.use(express.static(path.join(__dirname, 'public')));

// 3. Define Routes

// Home Page
app.get('/', (req, res) => {
    res.render('index');
});

// Shop/Products Page
app.get('/products', (req, res) => {
    res.render('products'); // This renders views/products.ejs
});

// Cart/Checkout Page
app.get('/cart', (req, res) => {
    res.render('cart'); // This renders views/cart.ejs
});

// 4. Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});