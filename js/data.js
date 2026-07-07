// ============================================
// PriceMint — Site Data Store
// Marketing/content data stays static here.
// PRODUCT data is fetched live from Supabase
// (see supabase-schema.sql) so every page —
// home, search, deals, product, wishlist —
// shows the exact same catalog.
//
// Loaded as a classic (non-module) script so its
// top-level `let`/`const` bindings stay visible as
// bare identifiers to app.js, exactly like before.
// It uses a dynamic import() internally to reach
// the Supabase-backed functions in products.js.
// ============================================

// --- Utility: Format price in INR ---
function formatPrice(price) {
  return '₹' + (Number(price) || 0).toLocaleString('en-IN');
}

// --- Utility: Generate product placeholder image (SVG data URL) ---
function generateProductImage(name, gradientColors) {
  const [c1, c2] = gradientColors;
  const words = name.split(' ');
  const initials = words.length > 1
    ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
    : words[0].substring(0, 2).toUpperCase();
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient></defs><rect width="400" height="400" fill="url(#g)" rx="24"/><text x="200" y="215" font-family="system-ui,sans-serif" font-size="96" font-weight="800" fill="white" text-anchor="middle" opacity="0.85">${initials}</text><text x="200" y="280" font-family="system-ui,sans-serif" font-size="18" font-weight="500" fill="white" text-anchor="middle" opacity="0.6">${name.length > 25 ? name.substring(0, 22) + '...' : name}</text></svg>`)}`;
}

// --- Category gradient palettes ---
const categoryGradients = {
  smartphones: ['#667eea', '#764ba2'],
  laptops: ['#f093fb', '#f5576c'],
  audio: ['#4facfe', '#00f2fe'],
  tvs: ['#43e97b', '#38f9d7'],
  wearables: ['#fa709a', '#fee140'],
  home_appliances: ['#a18cd1', '#fbc2eb'],
  fashion: ['#ff9a9e', '#fecfef'],
  gaming: ['#f7971e', '#ffd200'],
  tablets: ['#89f7fe', '#66a6ff'],
  beauty: ['#fdcbf1', '#e6dee9'],
  kitchen: ['#d4fc79', '#96e6a1'],
  smart_home: ['#84fab0', '#8fd3f4'],
  books: ['#ffecd2', '#fcb69f'],
  watches: ['#c471f5', '#fa71cd'],
  cameras: ['#616161', '#9bc5c3'],
  office: ['#bdc3c7', '#2c3e50'],
  sports: ['#11998e', '#38ef7d'],
};

// --- SELLERS (display metadata only) ---
const sellers = [
  { id: 'amazon', name: 'Amazon.in', color: '#FF9900', url: 'https://amazon.in' },
  { id: 'flipkart', name: 'Flipkart', color: '#2874F0', url: 'https://flipkart.com' },
  { id: 'croma', name: 'Croma', color: '#4CAF50', url: 'https://croma.com' },
  { id: 'reliance', name: 'Reliance Digital', color: '#003399', url: 'https://reliancedigital.in' },
  { id: 'tatacliq', name: 'Tata CLiQ', color: '#E91E63', url: 'https://tatacliq.com' },
  { id: 'myntra', name: 'Myntra', color: '#FF3F6C', url: 'https://myntra.com' },
];

// --- CATEGORIES (counts recomputed once products load) ---
const categories = [
  { id: 'smartphones', name: 'Smartphones', slug: 'smartphones', icon: '📱', productCount: 0 },
  { id: 'laptops', name: 'Laptops', slug: 'laptops', icon: '💻', productCount: 0 },
  { id: 'audio', name: 'Audio', slug: 'audio', icon: '🎧', productCount: 0 },
  { id: 'tvs', name: 'TVs & Displays', slug: 'tvs', icon: '📺', productCount: 0 },
  { id: 'wearables', name: 'Wearables', slug: 'wearables', icon: '⌚', productCount: 0 },
  { id: 'home_appliances', name: 'Home Appliances', slug: 'home-appliances', icon: '🏠', productCount: 0 },
  { id: 'fashion', name: 'Fashion', slug: 'fashion', icon: '👟', productCount: 0 },
  { id: 'gaming', name: 'Gaming', slug: 'gaming', icon: '🎮', productCount: 0 },
  { id: 'tablets', name: 'Tablets', slug: 'tablets', icon: '📋', productCount: 0 },
  { id: 'beauty', name: 'Beauty', slug: 'beauty', icon: '✨', productCount: 0 },
  { id: 'kitchen', name: 'Kitchen', slug: 'kitchen', icon: '🍳', productCount: 0 },
  { id: 'smart_home', name: 'Smart Home', slug: 'smart-home', icon: '🔊', productCount: 0 },
  { id: 'books', name: 'Books', slug: 'books', icon: '📚', productCount: 0 },
  { id: 'watches', name: 'Watches', slug: 'watches', icon: '🕐', productCount: 0 },
  { id: 'cameras', name: 'Cameras', slug: 'cameras', icon: '📷', productCount: 0 },
  { id: 'office', name: 'Office Supplies', slug: 'office', icon: '🖨️', productCount: 0 },
  { id: 'sports', name: 'Sports', slug: 'sports', icon: '⚽', productCount: 0 },
];

// --- PRODUCTS / DEALS / FEATURED LISTS ---
// Populated asynchronously from Supabase. Start empty so every page
// renders its "loading" state correctly, then re-renders once ready.
let products = [];
let deals = [];
let trendingIds = [];
let priceDropIds = [];
let editorPickIds = [];
let aiRecommendedIds = [];
let mostComparedIds = [];

// --- TRUST / SOCIAL PROOF DATA (static marketing content) ---
const siteStats = [
  { id: 'shoppers', value: 2100000, suffix: '+', label: 'Smart Shoppers', icon: '🧑\u200d🤝\u200d🧑' },
  { id: 'products', value: 48500, suffix: '+', label: 'Products Tracked', icon: '📦' },
  { id: 'sellers', value: 6, suffix: '', label: 'Trusted Retailers', icon: '🏬' },
  { id: 'saved', value: 38, suffix: ' Cr+', label: 'Saved For Users (₹)', icon: '💰' },
];

const testimonials = [
  { id: 1, name: 'Ritika Sharma', location: 'Bengaluru', avatarInitials: 'RS', rating: 5, text: 'I was about to buy the S25 Ultra on Amazon at full price. PriceMint showed me a coupon that saved me ₹5,000 in two clicks. Never buying without checking here first.' },
  { id: 2, name: 'Aditya Verma', location: 'Delhi', avatarInitials: 'AV', rating: 5, text: 'The price history charts are what sold me. I could actually see the Sony XM5 was at an all-time low before buying — no more guessing if a "deal" is real.' },
  { id: 3, name: 'Fatima Khan', location: 'Hyderabad', avatarInitials: 'FK', rating: 4, text: 'Set a price alert on the MacBook Air and got notified the moment it dropped. Saved me from checking five different sites every day.' },
  { id: 4, name: 'Karan Mehta', location: 'Pune', avatarInitials: 'KM', rating: 5, text: 'Compared the same TV across four sellers side by side, including hidden shipping fees. Reliance actually turned out cheaper than Amazon that day — wouldn\'t have known otherwise.' },
  { id: 5, name: 'Sneha Iyer', location: 'Chennai', avatarInitials: 'SI', rating: 5, text: 'The AI summary of reviews saves me so much scrolling. It genuinely reads like a friend who already tested the product told me the pros and cons.' },
  { id: 6, name: 'Rohit Nair', location: 'Mumbai', avatarInitials: 'RN', rating: 4, text: 'Found a laptop deal here that wasn\'t even showing on the retailer\'s own homepage. This is now my first stop before any big purchase.' },
];

const trustBadges = [
  { icon: '🔒', title: 'Secure Redirects', desc: 'We link you straight to the verified retailer checkout — never a third-party middleman.' },
  { icon: '📊', title: '30-Day Price History', desc: 'See exactly how a price has moved before you decide.' },
  { icon: '🔔', title: 'Free Price Alerts', desc: 'Tell us your target price — we\'ll save it to your account the moment it hits.' },
  { icon: '🤖', title: 'AI Review Summaries', desc: 'Thousands of reviews condensed into honest pros, cons, and a verdict.' },
];

const howItWorksSteps = [
  { step: 1, title: 'Search or browse', desc: 'Find any product across categories and 6 major Indian retailers in one search bar.' },
  { step: 2, title: 'Compare instantly', desc: 'See live prices, coupons, cashback, delivery time, and warranty side by side.' },
  { step: 3, title: 'Buy at the best price', desc: 'Click through to the cheapest verified seller and check out directly on their site.' },
];

const faqs = [
  { q: 'Is PriceMint free to use?', a: 'Yes, completely free. We earn a small commission from retailers when you make a purchase through our links — this never affects the price you pay.' },
  { q: 'How often are prices updated?', a: 'Prices are refreshed continuously throughout the day as retailers change them, so what you see is as close to real-time as possible.' },
  { q: 'Do you sell products directly?', a: 'No. PriceMint is a comparison platform only. When you click "Buy Now" you\'re taken to the retailer\'s own site to complete your purchase securely.' },
  { q: 'How do price alerts work?', a: 'Set your target price on any product page and we\'ll save it to your account so you can check back the moment any tracked seller drops to or below that price.' },
  { q: 'Which retailers do you compare?', a: 'We currently track Amazon.in, Flipkart, Croma, Reliance Digital, Tata CLiQ, and Myntra, with more being added regularly.' },
];

const partnerBrands = ['Apple', 'Samsung', 'Sony', 'OnePlus', 'Dell', 'LG', 'JBL', 'Nike', 'Dyson', 'Lenovo', 'ASUS', 'Google'];

// --- HELPER FUNCTIONS (operate on the live `products` array above) ---
function getProductById(id) {
  return products.find(p => p.id === id);
}

function getProductsByCategory(categoryId) {
  return products.filter(p => p.category === categoryId);
}

function getProductsByIds(ids) {
  return ids.map(id => getProductById(id)).filter(Boolean);
}

function getSellerById(id) {
  return sellers.find(s => s.id === id);
}

function searchProducts(query) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return products.filter(p => {
    const searchable = [p.title, p.brand, p.category].join(' ').toLowerCase();
    return q.split(' ').every(word => searchable.includes(word));
  });
}

function formatDiscount(discount) {
  return discount + '% off';
}

function formatCompactNumber(num) {
  if (num >= 10000000) return (num / 10000000).toFixed(1).replace(/\.0$/, '') + 'Cr';
  if (num >= 100000) return (num / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(num);
}

function getStarHTML(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.3 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

// --- WISHLIST (localStorage — instant, no login required) ---
const WISHLIST_KEY = 'pm_wishlist';

function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function isInWishlist(productId) {
  return getWishlist().includes(productId);
}

function toggleWishlist(productId) {
  let list = getWishlist();
  let added;
  if (list.includes(productId)) {
    list = list.filter(id => id !== productId);
    added = false;
  } else {
    list.push(productId);
    added = true;
  }
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
  return added;
}

// --- RECENTLY VIEWED (persisted in localStorage) ---
const RECENTLY_VIEWED_KEY = 'pm_recently_viewed';
const RECENTLY_VIEWED_MAX = 8;

function getRecentlyViewed() {
  try {
    const ids = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY)) || [];
    return getProductsByIds(ids);
  } catch (e) {
    return [];
  }
}

function addRecentlyViewed(productId) {
  try {
    let ids = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY)) || [];
    ids = ids.filter(id => id !== productId);
    ids.unshift(productId);
    ids = ids.slice(0, RECENTLY_VIEWED_MAX);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(ids));
  } catch (e) { /* ignore quota errors */ }
}

// --- EXPORT TO GLOBAL (kept identical shape to before) ---
window.PriceMint = {
  products, sellers, categories, deals, trendingIds, priceDropIds, editorPickIds,
  aiRecommendedIds, mostComparedIds, categoryGradients, siteStats, testimonials,
  trustBadges, howItWorksSteps, faqs, partnerBrands,
  formatPrice, formatDiscount, formatCompactNumber, getProductById,
  getProductsByCategory, getProductsByIds, getSellerById, searchProducts,
  getStarHTML, generatePriceHistory: null, generateProductImage,
  getWishlist, isInWishlist, toggleWishlist, getRecentlyViewed, addRecentlyViewed,
};

// ============================================
// LIVE DATA LOADING (Supabase)
// Maps snake_case DB rows onto the camelCase-ish
// shape the existing rendering code expects, then
// signals `pricemint:data-ready` for app.js.
// ============================================

function mapRow(row) {
  return {
    ...row,
    currentLowestPrice: row.lowest_price,
    originalPrice: row.original_price,
    thumbnail: row.thumbnail,
    cheapestPlatform: row.cheapest_platform,
    cheapestUrl: row.cheapest_url,
    reviewCount: row.review_count,
  };
}

window.PriceMint.ready = (async () => {
  try {
    const mod = await import('./products.js');
    const { data } = await mod.getProducts({ limit: 200 });
    products = data.map(mapRow);

    // Keep the exported object's `products` reference in sync too,
    // in case any code grabbed a reference to window.PriceMint early.
    window.PriceMint.products = products;

    trendingIds = products.filter(p => p.is_trending).map(p => p.id);
    priceDropIds = [...products].filter(p => p.discount > 0)
      .sort((a, b) => b.discount - a.discount).slice(0, 14).map(p => p.id);
    editorPickIds = products.filter(p => p.is_editor_pick).map(p => p.id);
    aiRecommendedIds = products.filter(p => p.is_ai_recommended).map(p => p.id);
    mostComparedIds = products.filter(p => p.is_most_compared).map(p => p.id);

    window.PriceMint.trendingIds = trendingIds;
    window.PriceMint.priceDropIds = priceDropIds;
    window.PriceMint.editorPickIds = editorPickIds;
    window.PriceMint.aiRecommendedIds = aiRecommendedIds;
    window.PriceMint.mostComparedIds = mostComparedIds;

    // Recompute real category counts
    categories.forEach(c => {
      c.productCount = products.filter(p => p.category === c.id).length;
    });

    // Build 4 "flash deal" cards from the biggest live discounts.
    const top = [...products].filter(p => p.discount > 0)
      .sort((a, b) => b.discount - a.discount).slice(0, 4);
    deals = top.map(p => ({
      productId: p.id,
      type: 'flash',
      isActive: true,
      dealPrice: p.currentLowestPrice,
      originalPrice: p.originalPrice,
      endTime: Date.now() + 1000 * 60 * 60 * (6 + Math.random() * 12),
    }));
    window.PriceMint.deals = deals;
  } catch (err) {
    console.error('Failed to load products from Supabase:', err);
  }

  window.dispatchEvent(new Event('pricemint:data-ready'));
})();
