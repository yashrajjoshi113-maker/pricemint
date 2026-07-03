const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, 'database.json');

// Initialize local JSON Database if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
    const initialData = {
        products: [],
        wishlists: [] // { id, user_id, product_id, target_price }
    };
    // Seed with our robust mock products
    const generatePriceHistory = (basePrice) => {
        const history = [];
        let currentPrice = basePrice * 1.1;
        for (let i = 30; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            if (Math.random() > 0.7) currentPrice = currentPrice + (Math.random() > 0.5 ? 500 : -500);
            if (i < 5) currentPrice = basePrice;
            history.push({ date: date.toISOString().split('T')[0], price: Math.round(currentPrice) });
        }
        return history;
    };
    
    initialData.products = [
        {
            id: 'iphone-16-pro-max', title: 'Apple iPhone 16 Pro Max (256 GB) - Desert Titanium', brand: 'Apple',
            category: 'smartphones', rating: 4.8,
            lowestPrice: 139900, originalPrice: 144900, discount: 3, 
            image: 'https://m.media-amazon.com/images/I/71yzJoE7WlL._SX679_.jpg',
            cheapestPlatform: 'Amazon', cheapestUrl: 'https://www.amazon.in/dp/B0DGJ9B5MB',
            specs: { 'Screen': '6.9" Super Retina XDR', 'Processor': 'A18 Pro', 'Camera': '48MP Main' },
            prices: [
                { platform: 'Amazon', price: 139900, logo: 'https://www.logo.wine/a/logo/Amazon_(company)/Amazon_(company)-Icon-White-Dark-Background-Logo.wine.svg', url: '#' },
                { platform: 'Flipkart', price: 140500, logo: 'https://www.logo.wine/a/logo/Flipkart/Flipkart-Icon-Logo.wine.svg', url: '#' }
            ],
            history: generatePriceHistory(139900)
        },
        {
            id: 'samsung-s25-ultra', title: 'Samsung Galaxy S25 Ultra 5G (Titanium Gray, 256 GB)', brand: 'Samsung',
            category: 'smartphones', rating: 4.6,
            lowestPrice: 124999, originalPrice: 134999, discount: 7, 
            image: 'https://m.media-amazon.com/images/I/71R2oE17C8L._SX679_.jpg',
            cheapestPlatform: 'Flipkart', cheapestUrl: 'https://www.flipkart.com/',
            specs: { 'Screen': '6.8" Dynamic AMOLED', 'Processor': 'Snapdragon 8 Gen 4', 'Camera': '200MP Main' },
            prices: [
                { platform: 'Flipkart', price: 124999, logo: 'https://www.logo.wine/a/logo/Flipkart/Flipkart-Icon-Logo.wine.svg', url: '#' },
                { platform: 'Amazon', price: 126000, logo: 'https://www.logo.wine/a/logo/Amazon_(company)/Amazon_(company)-Icon-White-Dark-Background-Logo.wine.svg', url: '#' }
            ],
            history: generatePriceHistory(124999)
        },
        {
            id: 'sony-wh1000xm5', title: 'Sony WH-1000XM5 Wireless Active Noise Cancelling Headphones', brand: 'Sony',
            category: 'audio', rating: 4.7,
            lowestPrice: 22990, originalPrice: 29990, discount: 23, 
            image: 'https://m.media-amazon.com/images/I/51aXvjzcukL._SX522_.jpg',
            cheapestPlatform: 'Myntra', cheapestUrl: 'https://www.myntra.com/',
            specs: { 'Type': 'Over-Ear', 'Battery': '30 Hours', 'Noise Cancellation': 'Industry Leading ANC' },
            prices: [
                { platform: 'Myntra', price: 22990, logo: 'https://www.logo.wine/a/logo/Myntra/Myntra-Logo.wine.svg', url: '#' },
                { platform: 'Amazon', price: 24990, logo: 'https://www.logo.wine/a/logo/Amazon_(company)/Amazon_(company)-Icon-White-Dark-Background-Logo.wine.svg', url: '#' }
            ],
            history: generatePriceHistory(22990)
        }
    ];
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
}

// DB Helper Functions
const readDB = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// API Endpoints

app.get('/api/products', (req, res) => {
    const db = readDB();
    const { q, category } = req.query;
    let products = db.products;
    
    if (q) {
        products = products.filter(p => p.title.toLowerCase().includes(q.toLowerCase()) || p.brand.toLowerCase().includes(q.toLowerCase()));
    } else if (category) {
        products = products.filter(p => p.category === category);
    }
    res.json(products);
});

app.get('/api/products/:id', (req, res) => {
    const db = readDB();
    const product = db.products.find(p => p.id === req.params.id);
    if (product) res.json(product);
    else res.status(404).json({ error: 'Not found' });
});

app.get('/api/deals', (req, res) => {
    const db = readDB();
    const deals = [...db.products].sort((a, b) => b.discount - a.discount);
    res.json(deals);
});

// WISHLIST API
app.post('/api/wishlist', (req, res) => {
    const { user_id, product_id, target_price } = req.body;
    if (!user_id || !product_id || !target_price) {
        return res.status(400).json({ error: 'Missing fields' });
    }
    const db = readDB();
    const id = Date.now().toString();
    db.wishlists.push({ id, user_id, product_id, target_price });
    writeDB(db);
    res.json({ success: true, id });
});

app.get('/api/wishlist/:user_id', (req, res) => {
    const db = readDB();
    const userWishlist = db.wishlists.filter(w => w.user_id === req.params.user_id);
    
    // Join with product data
    const populated = userWishlist.map(w => {
        const product = db.products.find(p => p.id === w.product_id);
        return { ...w, product };
    });
    res.json(populated);
});

app.delete('/api/wishlist/:id', (req, res) => {
    const db = readDB();
    db.wishlists = db.wishlists.filter(w => w.id !== req.params.id);
    writeDB(db);
    res.json({ success: true });
});

app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Live Backend running on port ${PORT}`);
});
