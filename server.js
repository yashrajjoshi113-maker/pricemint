const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(cors());
app.use(express.json());

// Utility to generate realistic price history (last 30 days)
const generatePriceHistory = (basePrice) => {
    const history = [];
    const today = new Date();
    let currentPrice = basePrice * 1.1; // start slightly higher
    for (let i = 30; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Random fluctuation
        if (Math.random() > 0.7) {
            currentPrice = currentPrice + (Math.random() > 0.5 ? 500 : -500);
        }
        
        // Ensure price drops toward the end to simulate a "deal"
        if (i < 5) currentPrice = basePrice;
        if (i === 0) currentPrice = basePrice;

        history.push({
            date: date.toISOString().split('T')[0],
            price: Math.round(currentPrice)
        });
    }
    return history;
};

// Robust Realistic Data Store
const MOCK_PRODUCTS = [
    {
        id: 'iphone-16-pro-max', title: 'Apple iPhone 16 Pro Max (256 GB) - Desert Titanium', brand: 'Apple',
        category: 'smartphones', rating: 4.8, reviewCount: 15420,
        lowestPrice: 139900, originalPrice: 144900, discount: 3, 
        image: 'https://m.media-amazon.com/images/I/71yzJoE7WlL._SX679_.jpg',
        cheapestPlatform: 'Amazon', cheapestUrl: 'https://www.amazon.in/dp/B0DGJ9B5MB',
        specs: { 'Screen': '6.9" Super Retina XDR', 'Processor': 'A18 Pro', 'Camera': '48MP Main' },
        prices: [
            { platform: 'Amazon', price: 139900, logo: 'https://www.logo.wine/a/logo/Amazon_(company)/Amazon_(company)-Icon-White-Dark-Background-Logo.wine.svg', url: '#' },
            { platform: 'Flipkart', price: 140500, logo: 'https://www.logo.wine/a/logo/Flipkart/Flipkart-Icon-Logo.wine.svg', url: '#' },
            { platform: 'Croma', price: 142000, logo: 'https://d2d22nphq0yz8t.cloudfront.net/88e6cc4b-eaa1-4053-af65-563d88ba8b26/https://media.croma.com/image/upload/v1660144941/Croma%20Assets/UI%20Assets/CromaLogo_bkyk3c.png/mxw_600,f_auto', url: '#' }
        ],
        history: generatePriceHistory(139900)
    },
    {
        id: 'samsung-s25-ultra', title: 'Samsung Galaxy S25 Ultra 5G (Titanium Gray, 256 GB)', brand: 'Samsung',
        category: 'smartphones', rating: 4.6, reviewCount: 9870,
        lowestPrice: 124999, originalPrice: 134999, discount: 7, 
        image: 'https://m.media-amazon.com/images/I/71R2oE17C8L._SX679_.jpg',
        cheapestPlatform: 'Flipkart', cheapestUrl: 'https://www.flipkart.com/',
        specs: { 'Screen': '6.8" Dynamic AMOLED', 'Processor': 'Snapdragon 8 Gen 4', 'Camera': '200MP Main' },
        prices: [
            { platform: 'Flipkart', price: 124999, logo: 'https://www.logo.wine/a/logo/Flipkart/Flipkart-Icon-Logo.wine.svg', url: '#' },
            { platform: 'Amazon', price: 126000, logo: 'https://www.logo.wine/a/logo/Amazon_(company)/Amazon_(company)-Icon-White-Dark-Background-Logo.wine.svg', url: '#' },
            { platform: 'Reliance', price: 128000, logo: 'https://www.logo.wine/a/logo/Reliance_Digital/Reliance_Digital-Logo.wine.svg', url: '#' }
        ],
        history: generatePriceHistory(124999)
    },
    {
        id: 'sony-wh1000xm5', title: 'Sony WH-1000XM5 Wireless Active Noise Cancelling Headphones', brand: 'Sony',
        category: 'audio', rating: 4.7, reviewCount: 15230,
        lowestPrice: 22990, originalPrice: 29990, discount: 23, 
        image: 'https://m.media-amazon.com/images/I/51aXvjzcukL._SX522_.jpg',
        cheapestPlatform: 'Myntra', cheapestUrl: 'https://www.myntra.com/',
        specs: { 'Type': 'Over-Ear', 'Battery': '30 Hours', 'Noise Cancellation': 'Industry Leading ANC' },
        prices: [
            { platform: 'Myntra', price: 22990, logo: 'https://www.logo.wine/a/logo/Myntra/Myntra-Logo.wine.svg', url: '#' },
            { platform: 'Amazon', price: 24990, logo: 'https://www.logo.wine/a/logo/Amazon_(company)/Amazon_(company)-Icon-White-Dark-Background-Logo.wine.svg', url: '#' },
            { platform: 'Flipkart', price: 25500, logo: 'https://www.logo.wine/a/logo/Flipkart/Flipkart-Icon-Logo.wine.svg', url: '#' }
        ],
        history: generatePriceHistory(22990)
    },
    {
        id: 'ps5-slim', title: 'Sony PlayStation 5 Console (Slim)', brand: 'Sony',
        category: 'gaming', rating: 4.7, reviewCount: 21000,
        lowestPrice: 47490, originalPrice: 54990, discount: 14, 
        image: 'https://m.media-amazon.com/images/I/51cM02F3J4L._SX679_.jpg',
        cheapestPlatform: 'Meesho', cheapestUrl: 'https://www.meesho.com/',
        specs: { 'Storage': '1TB SSD', 'Resolution': '4K 120Hz', 'Controller': 'DualSense included' },
        prices: [
            { platform: 'Meesho', price: 47490, logo: 'https://www.logo.wine/a/logo/Meesho/Meesho-Logo.wine.svg', url: '#' },
            { platform: 'Amazon', price: 49990, logo: 'https://www.logo.wine/a/logo/Amazon_(company)/Amazon_(company)-Icon-White-Dark-Background-Logo.wine.svg', url: '#' },
            { platform: 'Croma', price: 49990, logo: 'https://d2d22nphq0yz8t.cloudfront.net/88e6cc4b-eaa1-4053-af65-563d88ba8b26/https://media.croma.com/image/upload/v1660144941/Croma%20Assets/UI%20Assets/CromaLogo_bkyk3c.png/mxw_600,f_auto', url: '#' }
        ],
        history: generatePriceHistory(47490)
    },
    {
        id: 'macbook-air-m3', title: 'Apple MacBook Air Laptop M3 chip: 13.6-inch, 8GB RAM, 256GB SSD', brand: 'Apple',
        category: 'laptops', rating: 4.9, reviewCount: 3200,
        lowestPrice: 104990, originalPrice: 114900, discount: 9, 
        image: 'https://m.media-amazon.com/images/I/71jG+e7roXL._SX679_.jpg',
        cheapestPlatform: 'Amazon', cheapestUrl: 'https://www.amazon.in/',
        specs: { 'Screen': '13.6" Liquid Retina', 'Processor': 'Apple M3', 'RAM': '8GB', 'Storage': '256GB SSD' },
        prices: [
            { platform: 'Amazon', price: 104990, logo: 'https://www.logo.wine/a/logo/Amazon_(company)/Amazon_(company)-Icon-White-Dark-Background-Logo.wine.svg', url: '#' },
            { platform: 'Flipkart', price: 106000, logo: 'https://www.logo.wine/a/logo/Flipkart/Flipkart-Icon-Logo.wine.svg', url: '#' },
            { platform: 'Reliance', price: 109900, logo: 'https://www.logo.wine/a/logo/Reliance_Digital/Reliance_Digital-Logo.wine.svg', url: '#' }
        ],
        history: generatePriceHistory(104990)
    }
];

// Fallback search logic
async function scrapeAmazon(query) {
    try {
        const url = `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9'
            },
            timeout: 5000
        });
        const $ = cheerio.load(data);
        const results = [];
        $('.s-result-item[data-component-type="s-search-result"]').each((i, el) => {
            if (i > 5) return;
            const title = $(el).find('h2 a span').text().trim();
            const priceStr = $(el).find('.a-price-whole').first().text().replace(/,/g, '');
            const originalPriceStr = $(el).find('.a-text-price .a-offscreen').text().replace(/₹|,/g, '');
            const urlPath = $(el).find('h2 a').attr('href');
            const image = $(el).find('.s-image').attr('src');
            
            if (title && priceStr) {
                const price = parseInt(priceStr);
                const originalPrice = parseInt(originalPriceStr) || Math.round(price * 1.15);
                const discount = Math.round((1 - price/originalPrice) * 100);
                const id = 'amz-' + Date.now() + i;
                results.push({
                    id,
                    title,
                    brand: title.split(' ')[0],
                    lowestPrice: price,
                    originalPrice: originalPrice,
                    discount: discount > 0 ? discount : 0,
                    image,
                    cheapestPlatform: 'Amazon',
                    cheapestUrl: 'https://www.amazon.in' + urlPath,
                    rating: (4 + Math.random()).toFixed(1),
                    specs: { 'Info': 'Scraped directly from Amazon' },
                    prices: [{ platform: 'Amazon', price: price, logo: 'https://www.logo.wine/a/logo/Amazon_(company)/Amazon_(company)-Icon-White-Dark-Background-Logo.wine.svg', url: 'https://www.amazon.in' + urlPath }],
                    history: generatePriceHistory(price)
                });
            }
        });
        return results;
    } catch (e) {
        console.error("Amazon scrape failed:", e.message);
        return [];
    }
}

// API Endpoints

// 1. Get all products (with optional search query & category filter)
app.get('/api/products', async (req, res) => {
    const q = req.query.q;
    const cat = req.query.category;
    
    if (q) {
        // Try scraping live first
        const liveResults = await scrapeAmazon(q);
        if (liveResults.length > 0) return res.json(liveResults);
        
        // Fallback to local mock data filtered by query
        const filtered = MOCK_PRODUCTS.filter(p => p.title.toLowerCase().includes(q.toLowerCase()) || p.brand.toLowerCase().includes(q.toLowerCase()));
        return res.json(filtered);
    }
    
    if (cat) {
        const filtered = MOCK_PRODUCTS.filter(p => p.category === cat);
        return res.json(filtered);
    }

    res.json(MOCK_PRODUCTS);
});

// 2. Get single product by ID (for product.html)
app.get('/api/products/:id', (req, res) => {
    const product = MOCK_PRODUCTS.find(p => p.id === req.params.id);
    if (product) {
        res.json(product);
    } else {
        // If ID is dynamically scraped, generate a mock response
        res.json({
            id: req.params.id, title: 'Generic Searched Product', brand: 'Unknown',
            category: 'electronics', rating: 4.5, reviewCount: 100,
            lowestPrice: 10000, originalPrice: 12000, discount: 16,
            image: 'https://via.placeholder.com/400x400.png?text=Product',
            cheapestPlatform: 'Amazon', cheapestUrl: '#',
            specs: { 'Detail': 'Dynamic generated product' },
            prices: [
                { platform: 'Amazon', price: 10000, logo: 'https://www.logo.wine/a/logo/Amazon_(company)/Amazon_(company)-Icon-White-Dark-Background-Logo.wine.svg', url: '#' },
                { platform: 'Flipkart', price: 10500, logo: 'https://www.logo.wine/a/logo/Flipkart/Flipkart-Icon-Logo.wine.svg', url: '#' }
            ],
            history: generatePriceHistory(10000)
        });
    }
});

// 3. Get daily deals (for deals.html)
app.get('/api/deals', (req, res) => {
    // Sort by highest discount
    const deals = [...MOCK_PRODUCTS].sort((a, b) => b.discount - a.discount);
    res.json(deals);
});

// Serve static files
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`PriceMint Backend running on http://localhost:${PORT}`);
});
