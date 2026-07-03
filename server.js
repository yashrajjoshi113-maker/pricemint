const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(cors());
app.use(express.json());

// Fallback Mock Data for realistic UI rendering
const MOCK_PRODUCTS = [
    {
        id: 'iphone-16-pro-max', title: 'Apple iPhone 16 Pro Max (256 GB) - Desert Titanium', brand: 'Apple',
        category: 'smartphones', rating: 4.8, reviewCount: 15420,
        lowestPrice: 139900, originalPrice: 144900, discount: 3, 
        image: 'https://m.media-amazon.com/images/I/71yzJoE7WlL._SX679_.jpg',
        cheapestPlatform: 'Amazon',
        cheapestUrl: 'https://www.amazon.in/dp/B0DGJ9B5MB'
    },
    {
        id: 'samsung-s25-ultra', title: 'Samsung Galaxy S25 Ultra 5G (Titanium Gray, 256 GB)', brand: 'Samsung',
        category: 'smartphones', rating: 4.6, reviewCount: 9870,
        lowestPrice: 124999, originalPrice: 134999, discount: 7, 
        image: 'https://m.media-amazon.com/images/I/71R2oE17C8L._SX679_.jpg',
        cheapestPlatform: 'Flipkart',
        cheapestUrl: 'https://www.flipkart.com/samsung-galaxy-s25-ultra-5g/p/itm'
    },
    {
        id: 'sony-wh1000xm5', title: 'Sony WH-1000XM5 Wireless Active Noise Cancelling Headphones', brand: 'Sony',
        category: 'audio', rating: 4.7, reviewCount: 15230,
        lowestPrice: 22990, originalPrice: 29990, discount: 23, 
        image: 'https://m.media-amazon.com/images/I/51aXvjzcukL._SX522_.jpg',
        cheapestPlatform: 'Myntra',
        cheapestUrl: 'https://www.myntra.com/headphones/sony/wh-1000xm5'
    },
    {
        id: 'ps5-slim', title: 'Sony PlayStation 5 Console (Slim)', brand: 'Sony',
        category: 'gaming', rating: 4.7, reviewCount: 21000,
        lowestPrice: 47490, originalPrice: 54990, discount: 14, 
        image: 'https://m.media-amazon.com/images/I/51cM02F3J4L._SX679_.jpg',
        cheapestPlatform: 'Meesho',
        cheapestUrl: 'https://www.meesho.com/ps5-slim'
    },
    {
        id: 'macbook-air-m3', title: 'Apple MacBook Air Laptop M3 chip: 13.6-inch, 8GB RAM, 256GB SSD', brand: 'Apple',
        category: 'laptops', rating: 4.9, reviewCount: 3200,
        lowestPrice: 104990, originalPrice: 114900, discount: 9, 
        image: 'https://m.media-amazon.com/images/I/71jG+e7roXL._SX679_.jpg',
        cheapestPlatform: 'Amazon',
        cheapestUrl: 'https://www.amazon.in/dp/B0CX21C261'
    },
    {
        id: 'oneplus-12r', title: 'OnePlus 12R (Iron Gray, 8GB RAM, 128GB Storage)', brand: 'OnePlus',
        category: 'smartphones', rating: 4.5, reviewCount: 8900,
        lowestPrice: 39999, originalPrice: 42999, discount: 7, 
        image: 'https://m.media-amazon.com/images/I/71XNeka-BRL._SX679_.jpg',
        cheapestPlatform: 'Flipkart',
        cheapestUrl: 'https://www.flipkart.com/oneplus-12r/p/itm'
    }
];

// Basic Scraper function
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
            if (i > 5) return; // limit to 6
            const title = $(el).find('h2 a span').text().trim();
            const priceStr = $(el).find('.a-price-whole').first().text().replace(/,/g, '');
            const originalPriceStr = $(el).find('.a-text-price .a-offscreen').text().replace(/₹|,/g, '');
            const urlPath = $(el).find('h2 a').attr('href');
            const image = $(el).find('.s-image').attr('src');
            
            if (title && priceStr) {
                const price = parseInt(priceStr);
                const originalPrice = parseInt(originalPriceStr) || Math.round(price * 1.15);
                const discount = Math.round((1 - price/originalPrice) * 100);
                results.push({
                    id: 'amz-' + Date.now() + i,
                    title,
                    brand: title.split(' ')[0],
                    lowestPrice: price,
                    originalPrice: originalPrice,
                    discount: discount > 0 ? discount : 0,
                    image,
                    cheapestPlatform: 'Amazon',
                    cheapestUrl: 'https://www.amazon.in' + urlPath,
                    rating: (4 + Math.random()).toFixed(1)
                });
            }
        });
        return results;
    } catch (e) {
        console.error("Amazon scrape failed:", e.message);
        return [];
    }
}

app.get('/api/products', async (req, res) => {
    const q = req.query.q;
    if (q) {
        const amzResults = await scrapeAmazon(q);
        if (amzResults.length > 0) {
            return res.json(amzResults);
        }
    }
    // Return realistic mock data if scraping fails or no query is provided
    res.json(MOCK_PRODUCTS);
});

// Serve static files from the root directory for local testing
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`PriceMint Backend running on http://localhost:${PORT}`);
});
