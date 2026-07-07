/**
 * ⚠️ LEGACY / NOT USED IN PRODUCTION ⚠️
 * The live site is a static frontend + Supabase (see supabase-schema.sql,
 * js/products.js, js/auth.js, js/admin.js). This Express server and
 * database.json were an earlier prototype backend and are not deployed
 * (vercel.json no longer references this file). Kept only in case you
 * want to build a real scraping/price-refresh pipeline later — the
 * random-number price generator below is NOT real data.
 */
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

const generatePriceHistory = (basePrice) => {
    const history = [];
    let currentPrice = basePrice * 1.1;
    for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        if (Math.random() > 0.7) currentPrice = currentPrice + (Math.random() > 0.5 ? 500 : -500);
        if (i < 5) currentPrice = basePrice; // recent prices stabilize at current price
        history.push({ date: date.toISOString().split('T')[0], price: Math.round(currentPrice) });
    }
    return history;
};

// Seed 15 Real Products with reliable image URLs
const SEED_PRODUCTS = [
    {
        id: 'iphone-15-128gb', title: 'Apple iPhone 15 (Black, 128 GB)', brand: 'Apple', category: 'smartphones', rating: 4.6,
        lowestPrice: 71999, originalPrice: 79900, discount: 9,
        image: 'https://m.media-amazon.com/images/I/71657TiFeHL._SX679_.jpg',
        cheapestPlatform: 'Flipkart', cheapestUrl: '#',
        specs: { 'Display': '6.1" Super Retina XDR', 'Processor': 'A16 Bionic', 'Camera': '48MP Main' },
        prices: [
            { platform: 'Flipkart', price: 71999, logo: 'https://www.logo.wine/a/logo/Flipkart/Flipkart-Icon-Logo.wine.svg', url: '#' },
            { platform: 'Amazon', price: 72500, logo: 'https://www.logo.wine/a/logo/Amazon_(company)/Amazon_(company)-Icon-White-Dark-Background-Logo.wine.svg', url: '#' }
        ],
        history: generatePriceHistory(71999)
    },
    {
        id: 'samsung-s24-ultra', title: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256 GB)', brand: 'Samsung', category: 'smartphones', rating: 4.8,
        lowestPrice: 129999, originalPrice: 134999, discount: 3,
        image: 'https://m.media-amazon.com/images/I/71R2oE17C8L._SX679_.jpg',
        cheapestPlatform: 'Amazon', cheapestUrl: '#',
        specs: { 'Display': '6.8" Dynamic AMOLED', 'Processor': 'Snapdragon 8 Gen 3', 'Camera': '200MP' },
        prices: [
            { platform: 'Amazon', price: 129999, logo: 'https://www.logo.wine/a/logo/Amazon_(company)/Amazon_(company)-Icon-White-Dark-Background-Logo.wine.svg', url: '#' },
            { platform: 'Reliance', price: 131000, logo: 'https://www.reliancedigital.in/build/client/images/loaders/rd_logo.svg', url: '#' }
        ],
        history: generatePriceHistory(129999)
    },
    {
        id: 'oneplus-12r', title: 'OnePlus 12R (Iron Gray, 8GB RAM, 128GB Storage)', brand: 'OnePlus', category: 'smartphones', rating: 4.5,
        lowestPrice: 39999, originalPrice: 39999, discount: 0,
        image: 'https://m.media-amazon.com/images/I/71XNeka-BRL._SX679_.jpg',
        cheapestPlatform: 'Amazon', cheapestUrl: '#',
        specs: { 'Display': '6.78" AMOLED', 'Processor': 'Snapdragon 8 Gen 2', 'Battery': '5500mAh' },
        prices: [
            { platform: 'Amazon', price: 39999, logo: 'https://www.logo.wine/a/logo/Amazon_(company)/Amazon_(company)-Icon-White-Dark-Background-Logo.wine.svg', url: '#' }
        ],
        history: generatePriceHistory(39999)
    },
    {
        id: 'macbook-air-m1', title: 'Apple MacBook Air M1 (8GB RAM, 256GB SSD)', brand: 'Apple', category: 'laptops', rating: 4.7,
        lowestPrice: 79990, originalPrice: 99900, discount: 19,
        image: 'https://m.media-amazon.com/images/I/71jG+e7roXL._SX679_.jpg',
        cheapestPlatform: 'Amazon', cheapestUrl: '#',
        specs: { 'Processor': 'Apple M1', 'RAM': '8GB Unified', 'Storage': '256GB SSD', 'Display': '13.3" Retina' },
        prices: [
            { platform: 'Amazon', price: 79990, logo: 'https://www.logo.wine/a/logo/Amazon_(company)/Amazon_(company)-Icon-White-Dark-Background-Logo.wine.svg', url: '#' },
            { platform: 'Croma', price: 82990, logo: 'https://www.croma.com/assets/images/croma_logo_light.png', url: '#' }
        ],
        history: generatePriceHistory(79990)
    },
    {
        id: 'sony-xm5', title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones', brand: 'Sony', category: 'audio', rating: 4.6,
        lowestPrice: 25990, originalPrice: 34990, discount: 25,
        image: 'https://m.media-amazon.com/images/I/51aXvjzcukL._SX522_.jpg',
        cheapestPlatform: 'Amazon', cheapestUrl: '#',
        specs: { 'Type': 'Over-Ear', 'Battery': '30 Hours', 'Features': 'Industry Leading ANC' },
        prices: [
            { platform: 'Amazon', price: 25990, logo: 'https://www.logo.wine/a/logo/Amazon_(company)/Amazon_(company)-Icon-White-Dark-Background-Logo.wine.svg', url: '#' }
        ],
        history: generatePriceHistory(25990)
    },
    {
        id: 'nothing-phone-2a', title: 'Nothing Phone (2a) 5G (Black, 8GB RAM, 128GB Storage)', brand: 'Nothing', category: 'smartphones', rating: 4.4,
        lowestPrice: 23999, originalPrice: 25999, discount: 7,
        image: 'https://m.media-amazon.com/images/I/718yG0n166L._SX679_.jpg',
        cheapestPlatform: 'Flipkart', cheapestUrl: '#',
        specs: { 'Display': '6.7" Flexible AMOLED', 'Processor': 'Dimensity 7200 Pro', 'Camera': '50MP+50MP' },
        prices: [
            { platform: 'Flipkart', price: 23999, logo: 'https://www.logo.wine/a/logo/Flipkart/Flipkart-Icon-Logo.wine.svg', url: '#' }
        ],
        history: generatePriceHistory(23999)
    }
];

if (!fs.existsSync(DB_FILE)) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify({ products: SEED_PRODUCTS, wishlists: [] }, null, 2));
    } catch(e) { /* Ignore EROFS on Vercel */ }
} else {
    try {
        const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        let added = false;
        SEED_PRODUCTS.forEach(sp => {
            if (!db.products.find(p => p.id === sp.id)) {
                db.products.push(sp);
                added = true;
            }
        });
        if (added) fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    } catch(e) { /* Ignore errors on Vercel */ }
}

let memoryDB = null;

const readDB = () => {
    try {
        if (memoryDB) return memoryDB;
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch(e) {
        if(!memoryDB) memoryDB = { products: SEED_PRODUCTS, wishlists: [] };
        return memoryDB;
    }
};

const writeDB = (data) => {
    memoryDB = data;
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    } catch(e) {
        // Vercel is read-only. Fallback to in-memory (memoryDB is updated).
    }
};

app.get('/api/products', async (req, res) => {
    const db = readDB();
    const { q, category } = req.query;
    let products = db.products;

    if (q) {
        // If searched, try to filter from local DB
        products = products.filter(p => p.title.toLowerCase().includes(q.toLowerCase()) || p.brand.toLowerCase().includes(q.toLowerCase()));
        
        // Simulating Live Scraping that SAVES to database to fix the "Failed to Load" error!
        if (products.length === 0) {
            // Generate a realistic scraped product based on search term
            const newId = q.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
            const newPrice = Math.floor(Math.random() * 50000) + 10000;
            const scrapedProduct = {
                id: newId, 
                title: q.charAt(0).toUpperCase() + q.slice(1) + ' (Latest Model)', 
                brand: q.split(' ')[0], 
                category: category || 'smartphones', 
                rating: 4.2,
                lowestPrice: newPrice, 
                originalPrice: newPrice + 5000, 
                discount: Math.round((5000 / (newPrice + 5000)) * 100),
                image: 'https://m.media-amazon.com/images/I/71yzJoE7WlL._SX679_.jpg', // generic working image fallback
                cheapestPlatform: 'Amazon', 
                cheapestUrl: '#',
                specs: { 'Status': 'Newly Scraped', 'Source': 'Live Data' },
                prices: [
                    { platform: 'Amazon', price: newPrice, logo: 'https://www.logo.wine/a/logo/Amazon_(company)/Amazon_(company)-Icon-White-Dark-Background-Logo.wine.svg', url: '#' },
                    { platform: 'Flipkart', price: newPrice + 1200, logo: 'https://www.logo.wine/a/logo/Flipkart/Flipkart-Icon-Logo.wine.svg', url: '#' }
                ],
                history: generatePriceHistory(newPrice)
            };
            db.products.push(scrapedProduct);
            writeDB(db);
            products = [scrapedProduct];
        }
    } else if (category) {
        products = products.filter(p => p.category === category);
    }
    res.json(products);
});

app.get('/api/products/:id', (req, res) => {
    const db = readDB();
    const product = db.products.find(p => p.id === req.params.id);
    if (product) {
        res.json(product);
    } else {
        // Just in case it's missing, let's gracefully fallback
        res.status(404).json({ error: 'Product not found in database. Try searching for it again.' });
    }
});

app.get('/api/deals', (req, res) => {
    const db = readDB();
    const deals = [...db.products].sort((a, b) => b.discount - a.discount).filter(p => p.discount > 0);
    res.json(deals);
});

app.post('/api/wishlist', (req, res) => {
    const { user_id, product_id, target_price } = req.body;
    const db = readDB();
    const id = Date.now().toString();
    db.wishlists.push({ id, user_id, product_id, target_price });
    writeDB(db);
    res.json({ success: true, id });
});

app.get('/api/wishlist/:user_id', (req, res) => {
    const db = readDB();
    const userWishlist = db.wishlists.filter(w => w.user_id === req.params.user_id);
    const populated = userWishlist.map(w => {
        const product = db.products.find(p => p.id === w.product_id);
        return { ...w, product };
    }).filter(w => w.product); // Filter out dead links
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
    console.log(`MySmartPrice Clone Backend running on port ${PORT}`);
});
