// ============================================
// PriceMint — Mock Data Store
// All product, seller, category, deal, and
// price history data for the MVP.
// ============================================

// --- Utility: Format price in INR ---
function formatPrice(price) {
  return '₹' + price.toLocaleString('en-IN');
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

// --- SELLERS ---
const sellers = [
  { id: 'amazon', name: 'Amazon.in', rating: 4.5, reviewCount: 284000, color: '#FF9900', url: 'https://amazon.in' },
  { id: 'flipkart', name: 'Flipkart', rating: 4.3, reviewCount: 195000, color: '#2874F0', url: 'https://flipkart.com' },
  { id: 'croma', name: 'Croma', rating: 4.1, reviewCount: 42000, color: '#4CAF50', url: 'https://croma.com' },
  { id: 'reliance', name: 'Reliance Digital', rating: 4.2, reviewCount: 67000, color: '#003399', url: 'https://reliancedigital.in' },
  { id: 'tatacliq', name: 'Tata CLiQ', rating: 4.0, reviewCount: 31000, color: '#E91E63', url: 'https://tatacliq.com' },
  { id: 'myntra', name: 'Myntra', rating: 4.2, reviewCount: 120000, color: '#FF3F6C', url: 'https://myntra.com' },
];

// --- CATEGORIES ---
const categories = [
  { id: 'smartphones', name: 'Smartphones', slug: 'smartphones', icon: '📱', productCount: 5 },
  { id: 'laptops', name: 'Laptops', slug: 'laptops', icon: '💻', productCount: 5 },
  { id: 'audio', name: 'Audio', slug: 'audio', icon: '🎧', productCount: 3 },
  { id: 'tvs', name: 'TVs & Displays', slug: 'tvs', icon: '📺', productCount: 3 },
  { id: 'wearables', name: 'Wearables', slug: 'wearables', icon: '⌚', productCount: 2 },
  { id: 'home_appliances', name: 'Home Appliances', slug: 'home-appliances', icon: '🏠', productCount: 2 },
  { id: 'fashion', name: 'Fashion', slug: 'fashion', icon: '👟', productCount: 3 },
  { id: 'gaming', name: 'Gaming', slug: 'gaming', icon: '🎮', productCount: 2 },
  { id: 'tablets', name: 'Tablets', slug: 'tablets', icon: '📋', productCount: 1 },
  { id: 'beauty', name: 'Beauty', slug: 'beauty', icon: '✨', productCount: 1 },
  { id: 'kitchen', name: 'Kitchen', slug: 'kitchen', icon: '🍳', productCount: 1 },
  { id: 'smart_home', name: 'Smart Home', slug: 'smart-home', icon: '🔊', productCount: 1 },
  { id: 'books', name: 'Books', slug: 'books', icon: '📚', productCount: 1 },
  { id: 'watches', name: 'Watches', slug: 'watches', icon: '🕐', productCount: 0 },
  { id: 'cameras', name: 'Cameras', slug: 'cameras', icon: '📷', productCount: 0 },
  { id: 'office', name: 'Office Supplies', slug: 'office', icon: '🖨️', productCount: 0 },
  { id: 'sports', name: 'Sports', slug: 'sports', icon: '⚽', productCount: 0 },
  { id: 'health', name: 'Health', slug: 'health', icon: '💊', productCount: 0 },
];

// --- PRICE HISTORY GENERATOR ---
function generatePriceHistory(basePrice, options = {}) {
  const {
    days = 365,
    volatility = 0.03,
    trend = 'stable', // 'up', 'down', 'stable'
    saleEvents = 2,
  } = options;
  const history = [];
  let price = basePrice;
  const trendFactor = trend === 'down' ? -0.0002 : trend === 'up' ? 0.0003 : 0;
  const today = new Date();

  // Pre-generate sale event days (big drops)
  const saleDays = [];
  for (let i = 0; i < saleEvents; i++) {
    saleDays.push(Math.floor(Math.random() * days));
  }

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Random daily fluctuation
    const fluctuation = (Math.random() - 0.5) * 2 * volatility * basePrice;
    price += fluctuation + (trendFactor * basePrice);

    // Sale events: 10-20% drop for ~5 days
    const nearSale = saleDays.find(d => Math.abs(d - i) < 5);
    if (nearSale !== undefined) {
      const saleDrop = 0.10 + Math.random() * 0.10;
      price = basePrice * (1 - saleDrop) + fluctuation * 0.3;
    }

    // Keep price realistic (within ±25% of base)
    price = Math.max(basePrice * 0.75, Math.min(basePrice * 1.25, price));

    history.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price)
    });
  }
  return history;
}

// --- PRODUCTS ---
const products = [
  // ===== SMARTPHONES =====
  {
    id: 'iphone-16-pro-max',
    title: 'Apple iPhone 16 Pro Max 256GB',
    brand: 'Apple',
    model: 'iPhone 16 Pro Max',
    sku: 'APPL-IP16PM-256',
    category: 'smartphones',
    rating: 4.7,
    reviewCount: 12840,
    currentLowestPrice: 139900,
    originalPrice: 144900,
    discount: 3,
    storeCount: 5,
    inStock: true,
    tags: ['trending', 'editor-pick'],
    warranty: '1 Year Apple Warranty',
    boxContents: ['iPhone 16 Pro Max', 'USB-C to USB-C Cable', 'Documentation'],
    variants: [
      { type: 'Storage', options: ['256GB', '512GB', '1TB'] },
      { type: 'Color', options: ['Desert Titanium', 'Natural Titanium', 'White Titanium', 'Black Titanium'] }
    ],
    specs: {
      'Display': '6.9" Super Retina XDR OLED, 2868x1320, 120Hz ProMotion',
      'Processor': 'A18 Pro Bionic',
      'RAM': '8 GB',
      'Storage': '256 GB',
      'Rear Camera': '48MP + 12MP + 48MP (5x Telephoto)',
      'Front Camera': '12MP TrueDepth',
      'Battery': '4685 mAh, MagSafe wireless',
      'OS': 'iOS 18',
      '5G': 'Yes',
      'SIM': 'Dual eSIM',
      'Weight': '227 g',
      'Dimensions': '163 x 77.6 x 8.25 mm',
      'Water Resistance': 'IP68',
    },
    sellerPrices: [
      { sellerId: 'flipkart', price: 139900, originalPrice: 144900, discount: 3, shipping: 0, deliveryDays: 2, deliveryEstimate: 'Jul 5', inStock: true, warranty: '1 Year Apple Warranty', coupon: null, cashback: 1500, affiliateUrl: '#' },
      { sellerId: 'amazon', price: 140900, originalPrice: 144900, discount: 3, shipping: 0, deliveryDays: 1, deliveryEstimate: 'Jul 4', inStock: true, warranty: '1 Year Apple Warranty', coupon: 'APPLE2K', couponDiscount: 2000, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'croma', price: 142900, originalPrice: 144900, discount: 1, shipping: 0, deliveryDays: 3, deliveryEstimate: 'Jul 6', inStock: true, warranty: '1 Year Apple Warranty + 1 Year Extended', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'reliance', price: 141900, originalPrice: 144900, discount: 2, shipping: 0, deliveryDays: 3, deliveryEstimate: 'Jul 6', inStock: true, warranty: '1 Year Apple Warranty', coupon: null, cashback: 2000, affiliateUrl: '#' },
      { sellerId: 'tatacliq', price: 143500, originalPrice: 144900, discount: 1, shipping: 199, deliveryDays: 5, deliveryEstimate: 'Jul 8', inStock: true, warranty: '1 Year Apple Warranty', coupon: null, cashback: 0, affiliateUrl: '#' },
    ],
    aiSummary: {
      features: ['Best-in-class camera system with 5x optical zoom', 'Titanium design — lightest Pro Max ever', 'A18 Pro chip for console-level gaming', 'All-day battery life with fast MagSafe charging'],
      pros: ['Exceptional camera quality, especially telephoto', 'Smooth 120Hz ProMotion display', 'Premium titanium build', 'Excellent battery life'],
      cons: ['USB-C still limited to USB 2.0 speeds', 'No charger in box', 'Expensive compared to competition', 'Minimal design changes from iPhone 15 Pro Max'],
      recommendation: 'Best overall flagship if you value camera quality and ecosystem integration. The Flipkart offer at ₹1,39,900 with ₹1,500 cashback is currently the best deal.'
    },
    subScores: { quality: 4.8, value: 3.9, durability: 4.6, easeOfUse: 4.7, support: 4.5 },
    reviews: [
      { author: 'Rahul M.', rating: 5, date: '2026-06-15', title: 'Best iPhone yet!', body: 'The camera improvements are incredible. Night mode photos look like they were taken on a DSLR. Battery easily lasts 1.5 days.', helpful: 234, source: 'Amazon.in' },
      { author: 'Priya S.', rating: 4, date: '2026-06-02', title: 'Great but expensive', body: 'Performance is top-notch but hard to justify the price when OnePlus offers 90% of features at half the cost.', helpful: 187, source: 'Flipkart' },
      { author: 'Amit K.', rating: 5, date: '2026-05-20', title: 'Camera king', body: 'The 5x telephoto lens is a game changer. Portrait mode is so natural now.', helpful: 156, source: 'Amazon.in' },
      { author: 'Sneha R.', rating: 4, date: '2026-05-10', title: 'Solid upgrade', body: 'Coming from iPhone 14, this is a noticeable upgrade in every way. The titanium frame feels premium.', helpful: 98, source: 'Croma' },
    ],
    faq: [
      { q: 'Does it support 5G in India?', a: 'Yes, it supports all major 5G bands used by Indian carriers including Jio, Airtel, and Vi.' },
      { q: 'Is the charger included?', a: 'No, Apple does not include a charger in the box. Only a USB-C to USB-C cable is included.' },
      { q: 'What is Apple Intelligence?', a: 'Apple Intelligence is Apple\'s on-device AI system that powers writing tools, image generation, smart notifications, and Siri enhancements.' },
    ],
    relatedProducts: ['samsung-s25-ultra', 'oneplus-13', 'pixel-9-pro'],
    addedDate: '2026-01-15',
  },
  {
    id: 'samsung-s25-ultra',
    title: 'Samsung Galaxy S25 Ultra 256GB',
    brand: 'Samsung',
    model: 'Galaxy S25 Ultra',
    sku: 'SAM-S25U-256',
    category: 'smartphones',
    rating: 4.6,
    reviewCount: 9870,
    currentLowestPrice: 124999,
    originalPrice: 134999,
    discount: 7,
    storeCount: 5,
    inStock: true,
    tags: ['trending', 'price-drop'],
    warranty: '1 Year Samsung Warranty',
    boxContents: ['Galaxy S25 Ultra', 'USB-C Cable', 'SIM Ejector', 'Documentation'],
    variants: [
      { type: 'Storage', options: ['256GB', '512GB', '1TB'] },
      { type: 'Color', options: ['Titanium Black', 'Titanium Gray', 'Titanium Blue', 'Titanium Silver'] }
    ],
    specs: {
      'Display': '6.9" Dynamic AMOLED 2X, QHD+, 120Hz LTPO',
      'Processor': 'Snapdragon 8 Elite for Galaxy',
      'RAM': '12 GB',
      'Storage': '256 GB',
      'Rear Camera': '200MP + 50MP + 10MP + 12MP',
      'Front Camera': '12MP',
      'Battery': '5000 mAh, 45W Fast Charging',
      'OS': 'Android 15, One UI 7',
      '5G': 'Yes',
      'SIM': 'Nano SIM + eSIM',
      'S Pen': 'Built-in',
      'Weight': '218 g',
      'Water Resistance': 'IP68',
    },
    sellerPrices: [
      { sellerId: 'amazon', price: 124999, originalPrice: 134999, discount: 7, shipping: 0, deliveryDays: 1, deliveryEstimate: 'Jul 4', inStock: true, warranty: '1 Year Samsung Warranty', coupon: null, cashback: 3000, affiliateUrl: '#' },
      { sellerId: 'flipkart', price: 126999, originalPrice: 134999, discount: 6, shipping: 0, deliveryDays: 2, deliveryEstimate: 'Jul 5', inStock: true, warranty: '1 Year Samsung Warranty', coupon: 'SAMS5K', couponDiscount: 5000, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'croma', price: 129999, originalPrice: 134999, discount: 4, shipping: 0, deliveryDays: 3, deliveryEstimate: 'Jul 6', inStock: true, warranty: '1 Year Samsung Warranty + 1 Year Extended', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'reliance', price: 127999, originalPrice: 134999, discount: 5, shipping: 0, deliveryDays: 4, deliveryEstimate: 'Jul 7', inStock: true, warranty: '1 Year Samsung Warranty', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'tatacliq', price: 131999, originalPrice: 134999, discount: 2, shipping: 0, deliveryDays: 5, deliveryEstimate: 'Jul 8', inStock: false, warranty: '1 Year Samsung Warranty', coupon: null, cashback: 0, affiliateUrl: '#' },
    ],
    aiSummary: {
      features: ['200MP main camera with AI-powered image processing', 'Built-in S Pen for notes and sketches', 'Snapdragon 8 Elite — fastest Android chip', '7 years of OS updates'],
      pros: ['Incredible 200MP camera detail', 'S Pen is uniquely productive', 'Best Android display quality', 'Excellent multitasking with 12GB RAM'],
      cons: ['Slightly bulky at 218g', 'No charger included', '45W charging is slower than Chinese competitors', 'S Pen tip can wear out'],
      recommendation: 'The best Android phone money can buy. Amazon at ₹1,24,999 with ₹3,000 cashback offers the best value. If S Pen isn\'t important, consider the OnePlus 13 at half the price.'
    },
    subScores: { quality: 4.7, value: 4.0, durability: 4.5, easeOfUse: 4.4, support: 4.3 },
    reviews: [
      { author: 'Vikram D.', rating: 5, date: '2026-06-20', title: 'S Pen makes it special', body: 'Nothing else on the market has an S Pen. For productivity, this phone is unmatched. Camera is insane too.', helpful: 189, source: 'Amazon.in' },
      { author: 'Ananya P.', rating: 4, date: '2026-06-10', title: 'Powerful but pricey', body: 'Galaxy AI features are actually useful. Circle to search works great. Just wish it was a bit lighter.', helpful: 134, source: 'Flipkart' },
      { author: 'Karthik N.', rating: 5, date: '2026-05-28', title: 'Camera beast', body: '200MP sensor captures so much detail. Night mode rivals the iPhone easily.', helpful: 112, source: 'Amazon.in' },
    ],
    faq: [
      { q: 'Is the S Pen included?', a: 'Yes, the S Pen is built into the phone — no separate purchase needed.' },
      { q: 'How many years of updates?', a: 'Samsung guarantees 7 years of Android OS updates and security patches.' },
    ],
    relatedProducts: ['iphone-16-pro-max', 'oneplus-13', 'pixel-9-pro'],
    addedDate: '2026-02-01',
  },
  {
    id: 'oneplus-13',
    title: 'OnePlus 13 256GB',
    brand: 'OnePlus',
    model: 'OnePlus 13',
    sku: 'OP-13-256',
    category: 'smartphones',
    rating: 4.5,
    reviewCount: 7650,
    currentLowestPrice: 64999,
    originalPrice: 69999,
    discount: 7,
    storeCount: 4,
    inStock: true,
    tags: ['trending', 'price-drop', 'best-value'],
    warranty: '1 Year OnePlus Warranty',
    specs: {
      'Display': '6.82" LTPO AMOLED, QHD+, 120Hz',
      'Processor': 'Snapdragon 8 Elite',
      'RAM': '12 GB',
      'Storage': '256 GB',
      'Rear Camera': '50MP + 50MP + 50MP (Hasselblad)',
      'Battery': '6000 mAh, 100W SUPERVOOC',
      'OS': 'Android 15, OxygenOS 15',
      'Weight': '210 g',
      'Water Resistance': 'IP69',
    },
    sellerPrices: [
      { sellerId: 'amazon', price: 64999, originalPrice: 69999, discount: 7, shipping: 0, deliveryDays: 1, deliveryEstimate: 'Jul 4', inStock: true, warranty: '1 Year', coupon: null, cashback: 1000, affiliateUrl: '#' },
      { sellerId: 'flipkart', price: 65999, originalPrice: 69999, discount: 6, shipping: 0, deliveryDays: 2, deliveryEstimate: 'Jul 5', inStock: true, warranty: '1 Year', coupon: 'OP3K', couponDiscount: 3000, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'croma', price: 67999, originalPrice: 69999, discount: 3, shipping: 0, deliveryDays: 3, deliveryEstimate: 'Jul 6', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'reliance', price: 66999, originalPrice: 69999, discount: 4, shipping: 0, deliveryDays: 3, deliveryEstimate: 'Jul 6', inStock: true, warranty: '1 Year', coupon: null, cashback: 500, affiliateUrl: '#' },
    ],
    aiSummary: {
      features: ['Hasselblad triple 50MP camera system', '6000 mAh battery — largest in flagship class', '100W charging: 0 to 100% in 36 minutes', 'IP69 — best water/dust resistance'],
      pros: ['Unbeatable battery life', 'Fastest charging in its class', 'Excellent cameras with Hasselblad tuning', 'Best value flagship'],
      cons: ['OxygenOS has some bloatware', 'Limited availability of accessories', 'No wireless charging at this price', 'Alert slider removed in some regions'],
      recommendation: 'Best value flagship phone in India. The Amazon price of ₹64,999 with ₹1,000 cashback makes it a steal. Skip the Samsung if budget matters.'
    },
    subScores: { quality: 4.5, value: 4.8, durability: 4.4, easeOfUse: 4.3, support: 4.0 },
    reviews: [
      { author: 'Rohan G.', rating: 5, date: '2026-06-18', title: 'Flagship killer returns!', body: 'The value you get at this price is unmatched. Battery life is incredible — I charge every 2 days with normal usage.', helpful: 267, source: 'Amazon.in' },
      { author: 'Deepa M.', rating: 4, date: '2026-06-05', title: 'Almost perfect', body: 'Camera is excellent in good light. Night mode could be better. 100W charging is addictive though!', helpful: 143, source: 'Flipkart' },
    ],
    relatedProducts: ['iphone-16-pro-max', 'samsung-s25-ultra', 'pixel-9-pro'],
    addedDate: '2026-01-20',
  },
  {
    id: 'pixel-9-pro',
    title: 'Google Pixel 9 Pro 128GB',
    brand: 'Google',
    model: 'Pixel 9 Pro',
    sku: 'GOOG-P9P-128',
    category: 'smartphones',
    rating: 4.5,
    reviewCount: 4230,
    currentLowestPrice: 99999,
    originalPrice: 109999,
    discount: 9,
    storeCount: 3,
    inStock: true,
    tags: ['price-drop', 'ai-recommended'],
    warranty: '1 Year Google Warranty',
    specs: {
      'Display': '6.3" LTPO OLED, QHD+, 120Hz',
      'Processor': 'Google Tensor G4',
      'RAM': '16 GB',
      'Rear Camera': '50MP + 48MP + 48MP',
      'Battery': '5060 mAh',
      'OS': 'Android 15 (Pure Google)',
    },
    sellerPrices: [
      { sellerId: 'flipkart', price: 99999, originalPrice: 109999, discount: 9, shipping: 0, deliveryDays: 2, deliveryEstimate: 'Jul 5', inStock: true, warranty: '1 Year', coupon: null, cashback: 2000, affiliateUrl: '#' },
      { sellerId: 'amazon', price: 101999, originalPrice: 109999, discount: 7, shipping: 0, deliveryDays: 1, deliveryEstimate: 'Jul 4', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'croma', price: 104999, originalPrice: 109999, discount: 5, shipping: 0, deliveryDays: 4, deliveryEstimate: 'Jul 7', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
    ],
    aiSummary: { features: ['Best AI features on any phone (Gemini built-in)', 'Pure Android experience with 7 years of updates', 'Exceptional computational photography', '16GB RAM for on-device AI'], pros: ['Best-in-class AI features', 'Pure Android, no bloatware', 'Incredible photo processing', '7 years of guaranteed updates'], cons: ['Tensor G4 less powerful than Snapdragon 8 Elite in raw benchmarks', 'Limited availability in India', 'No expandable storage'], recommendation: 'Best phone for AI enthusiasts and pure Android lovers. The 9% discount on Flipkart makes it a great time to buy.' },
    subScores: { quality: 4.5, value: 4.2, durability: 4.3, easeOfUse: 4.8, support: 4.4 },
    reviews: [
      { author: 'Sanjay T.', rating: 5, date: '2026-06-12', title: 'AI on a phone done right', body: 'Gemini integration is seamless. Magic Eraser and Best Take are features I use daily. Pure Android experience is refreshing.', helpful: 198, source: 'Flipkart' },
    ],
    relatedProducts: ['iphone-16-pro-max', 'samsung-s25-ultra', 'oneplus-13'],
    addedDate: '2026-02-10',
  },
  {
    id: 'nothing-phone-3',
    title: 'Nothing Phone (3) 256GB',
    brand: 'Nothing',
    model: 'Phone (3)',
    sku: 'NOTH-P3-256',
    category: 'smartphones',
    rating: 4.3,
    reviewCount: 3120,
    currentLowestPrice: 37999,
    originalPrice: 39999,
    discount: 5,
    storeCount: 3,
    inStock: true,
    tags: ['trending', 'best-value'],
    warranty: '1 Year Nothing Warranty',
    specs: { 'Display': '6.7" LTPO OLED, FHD+, 120Hz', 'Processor': 'Snapdragon 8s Gen 3', 'RAM': '8 GB', 'Rear Camera': '50MP + 50MP (Glyph enhanced)', 'Battery': '5000 mAh, 45W', 'OS': 'Android 15, Nothing OS 3' },
    sellerPrices: [
      { sellerId: 'flipkart', price: 37999, originalPrice: 39999, discount: 5, shipping: 0, deliveryDays: 2, deliveryEstimate: 'Jul 5', inStock: true, warranty: '1 Year', coupon: null, cashback: 500, affiliateUrl: '#' },
      { sellerId: 'amazon', price: 38499, originalPrice: 39999, discount: 4, shipping: 0, deliveryDays: 1, deliveryEstimate: 'Jul 4', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'croma', price: 39499, originalPrice: 39999, discount: 1, shipping: 0, deliveryDays: 4, deliveryEstimate: 'Jul 7', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
    ],
    aiSummary: { features: ['Unique transparent Glyph interface', 'Clean Nothing OS with minimal bloat', 'Flagship-grade cameras at mid-range price', 'Distinctive design stands out'], pros: ['Unique design language', 'Clean, fast software', 'Great value for money', 'Excellent haptics'], cons: ['Limited service centers in India', 'Glyph is a novelty that fades', 'No telephoto camera', 'Average battery life'], recommendation: 'Best phone under ₹40K if you want something that stands out. Flipkart\'s ₹37,999 deal with cashback is the way to go.' },
    subScores: { quality: 4.3, value: 4.6, durability: 4.1, easeOfUse: 4.4, support: 3.8 },
    reviews: [],
    relatedProducts: ['oneplus-13', 'pixel-9-pro'],
    addedDate: '2026-03-01',
  },

  // ===== LAPTOPS =====
  {
    id: 'macbook-air-m4',
    title: 'Apple MacBook Air 13" M4 (2026)',
    brand: 'Apple',
    model: 'MacBook Air M4',
    sku: 'APPL-MBA-M4-13',
    category: 'laptops',
    rating: 4.8,
    reviewCount: 5670,
    currentLowestPrice: 109900,
    originalPrice: 114900,
    discount: 4,
    storeCount: 5,
    inStock: true,
    tags: ['editor-pick', 'ai-recommended'],
    warranty: '1 Year Apple Warranty',
    specs: { 'Display': '13.6" Liquid Retina, 2560x1664, 500 nits', 'Processor': 'Apple M4 (10-core CPU, 10-core GPU)', 'RAM': '16 GB Unified Memory', 'Storage': '256 GB SSD', 'Battery': 'Up to 18 hours', 'Weight': '1.24 kg', 'Ports': '2x Thunderbolt 4, MagSafe, 3.5mm jack', 'OS': 'macOS Sequoia' },
    sellerPrices: [
      { sellerId: 'amazon', price: 109900, originalPrice: 114900, discount: 4, shipping: 0, deliveryDays: 1, deliveryEstimate: 'Jul 4', inStock: true, warranty: '1 Year Apple Warranty', coupon: 'MAC3K', couponDiscount: 3000, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'flipkart', price: 110900, originalPrice: 114900, discount: 3, shipping: 0, deliveryDays: 2, deliveryEstimate: 'Jul 5', inStock: true, warranty: '1 Year', coupon: null, cashback: 1500, affiliateUrl: '#' },
      { sellerId: 'croma', price: 112900, originalPrice: 114900, discount: 2, shipping: 0, deliveryDays: 3, deliveryEstimate: 'Jul 6', inStock: true, warranty: '1 Year + 1 Year Extended', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'reliance', price: 111900, originalPrice: 114900, discount: 3, shipping: 0, deliveryDays: 3, deliveryEstimate: 'Jul 6', inStock: true, warranty: '1 Year', coupon: null, cashback: 2000, affiliateUrl: '#' },
      { sellerId: 'tatacliq', price: 113500, originalPrice: 114900, discount: 1, shipping: 0, deliveryDays: 5, deliveryEstimate: 'Jul 8', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
    ],
    aiSummary: { features: ['M4 chip delivers 50% faster performance than M3', 'Fanless, silent operation', '18-hour battery life', 'Stunning Liquid Retina display'], pros: ['Incredible performance per watt', 'Best laptop display in its class', 'Absolutely silent operation', 'Outstanding build quality'], cons: ['Only 2 Thunderbolt ports', 'Base model has 256GB storage', 'No touchscreen', 'Limited to 1 external display (without workaround)'], recommendation: 'The best laptop for 90% of people. Amazon\'s ₹1,09,900 with the MAC3K coupon for additional ₹3,000 off is unbeatable.' },
    subScores: { quality: 4.9, value: 4.5, durability: 4.7, easeOfUse: 4.9, support: 4.6 },
    reviews: [
      { author: 'Meera J.', rating: 5, date: '2026-06-22', title: 'Perfect everyday laptop', body: 'Silent, fast, and the battery lasts all day. M4 handles everything I throw at it. Best laptop purchase ever.', helpful: 312, source: 'Amazon.in' },
    ],
    relatedProducts: ['dell-xps-15', 'hp-spectre-x360'],
    addedDate: '2026-03-15',
  },
  {
    id: 'dell-xps-15',
    title: 'Dell XPS 15 (2025) Intel Core Ultra 9',
    brand: 'Dell',
    model: 'XPS 15 9530',
    sku: 'DELL-XPS15-2025',
    category: 'laptops',
    rating: 4.4,
    reviewCount: 3450,
    currentLowestPrice: 142990,
    originalPrice: 154990,
    discount: 8,
    storeCount: 4,
    inStock: true,
    tags: ['price-drop'],
    warranty: '1 Year Dell Warranty',
    specs: { 'Display': '15.6" OLED 3.5K, 3456x2160, 400 nits, Touch', 'Processor': 'Intel Core Ultra 9 285H', 'RAM': '32 GB DDR5', 'Storage': '1 TB SSD', 'GPU': 'NVIDIA RTX 4070 (8GB)', 'Battery': '86 Whr, ~12 hours', 'Weight': '1.86 kg' },
    sellerPrices: [
      { sellerId: 'amazon', price: 142990, originalPrice: 154990, discount: 8, shipping: 0, deliveryDays: 2, deliveryEstimate: 'Jul 5', inStock: true, warranty: '1 Year', coupon: null, cashback: 3000, affiliateUrl: '#' },
      { sellerId: 'flipkart', price: 145990, originalPrice: 154990, discount: 6, shipping: 0, deliveryDays: 2, deliveryEstimate: 'Jul 5', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'croma', price: 149990, originalPrice: 154990, discount: 3, shipping: 0, deliveryDays: 4, deliveryEstimate: 'Jul 7', inStock: true, warranty: '1 Year + ADP', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'reliance', price: 148990, originalPrice: 154990, discount: 4, shipping: 0, deliveryDays: 3, deliveryEstimate: 'Jul 6', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
    ],
    aiSummary: { features: ['Stunning 3.5K OLED touchscreen', 'RTX 4070 for creative workloads', '32GB DDR5 RAM standard', 'Premium machined aluminum chassis'], pros: ['Breathtaking OLED display', 'Strong GPU for content creation', 'Excellent keyboard and trackpad', 'Good port selection'], cons: ['OLED battery drain is noticeable', 'Gets warm under sustained load', 'Webcam quality is average', 'Expensive for what you get vs MacBook'], recommendation: 'Best Windows laptop for creatives. The 8% drop on Amazon to ₹1,42,990 is a solid deal — this laptop rarely goes below ₹1,45K.' },
    subScores: { quality: 4.5, value: 3.8, durability: 4.3, easeOfUse: 4.2, support: 4.0 },
    reviews: [],
    relatedProducts: ['macbook-air-m4', 'hp-spectre-x360', 'asus-rog-g16'],
    addedDate: '2026-01-05',
  },
  {
    id: 'hp-spectre-x360',
    title: 'HP Spectre x360 14" 2-in-1 OLED',
    brand: 'HP',
    model: 'Spectre x360 14',
    sku: 'HP-SPEC-X360-14',
    category: 'laptops',
    rating: 4.3,
    reviewCount: 2180,
    currentLowestPrice: 129990,
    originalPrice: 139990,
    discount: 7,
    storeCount: 3,
    inStock: true,
    tags: ['editor-pick'],
    specs: { 'Display': '14" 2.8K OLED, Touch, 120Hz', 'Processor': 'Intel Core Ultra 7 258V', 'RAM': '32 GB', 'Storage': '1 TB SSD', 'Weight': '1.34 kg' },
    sellerPrices: [
      { sellerId: 'amazon', price: 129990, originalPrice: 139990, discount: 7, shipping: 0, deliveryDays: 2, deliveryEstimate: 'Jul 5', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'flipkart', price: 132990, originalPrice: 139990, discount: 5, shipping: 0, deliveryDays: 2, deliveryEstimate: 'Jul 5', inStock: true, warranty: '1 Year', coupon: null, cashback: 1500, affiliateUrl: '#' },
      { sellerId: 'croma', price: 135990, originalPrice: 139990, discount: 3, shipping: 0, deliveryDays: 4, deliveryEstimate: 'Jul 7', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
    ],
    aiSummary: { features: ['360° hinge converts to tablet mode', 'Gorgeous 2.8K OLED touchscreen', 'Ultra-lightweight at 1.34 kg'], pros: ['Versatile 2-in-1 form factor', 'Beautiful OLED display'], cons: ['Average battery life', 'Limited GPU power'], recommendation: 'Best 2-in-1 for creative professionals who need versatility.' },
    subScores: { quality: 4.4, value: 4.0, durability: 4.2, easeOfUse: 4.5, support: 4.1 },
    reviews: [],
    relatedProducts: ['macbook-air-m4', 'dell-xps-15'],
    addedDate: '2026-02-20',
  },
  {
    id: 'asus-rog-g16',
    title: 'ASUS ROG Strix G16 (2026) RTX 4070',
    brand: 'ASUS',
    model: 'ROG Strix G16 G614',
    sku: 'ASUS-ROG-G16-2026',
    category: 'laptops',
    rating: 4.5,
    reviewCount: 4560,
    currentLowestPrice: 114990,
    originalPrice: 129990,
    discount: 12,
    storeCount: 4,
    inStock: true,
    tags: ['price-drop', 'trending'],
    specs: { 'Display': '16" QHD+ IPS, 240Hz, G-Sync', 'Processor': 'Intel Core i9-14900HX', 'RAM': '16 GB DDR5', 'Storage': '1 TB SSD', 'GPU': 'NVIDIA RTX 4070 (8GB)', 'Weight': '2.5 kg' },
    sellerPrices: [
      { sellerId: 'flipkart', price: 114990, originalPrice: 129990, discount: 12, shipping: 0, deliveryDays: 2, deliveryEstimate: 'Jul 5', inStock: true, warranty: '1 Year', coupon: null, cashback: 2000, affiliateUrl: '#' },
      { sellerId: 'amazon', price: 116990, originalPrice: 129990, discount: 10, shipping: 0, deliveryDays: 1, deliveryEstimate: 'Jul 4', inStock: true, warranty: '1 Year', coupon: 'ROG5K', couponDiscount: 5000, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'croma', price: 121990, originalPrice: 129990, discount: 6, shipping: 0, deliveryDays: 3, deliveryEstimate: 'Jul 6', inStock: true, warranty: '1 Year + ADP', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'reliance', price: 119990, originalPrice: 129990, discount: 8, shipping: 0, deliveryDays: 4, deliveryEstimate: 'Jul 7', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
    ],
    aiSummary: { features: ['240Hz QHD+ display for competitive gaming', 'RTX 4070 handles AAA games at high settings', 'Excellent cooling system'], pros: ['Great gaming performance', 'High refresh rate display', 'Solid build quality'], cons: ['Heavy at 2.5 kg', 'Average battery life', 'Fan noise under load'], recommendation: 'Best gaming laptop under ₹1.3L. The 12% discount on Flipkart is the lowest we\'ve seen in months.' },
    subScores: { quality: 4.5, value: 4.4, durability: 4.3, easeOfUse: 4.0, support: 4.1 },
    reviews: [],
    relatedProducts: ['dell-xps-15', 'ps5-slim'],
    addedDate: '2026-04-01',
  },
  {
    id: 'thinkpad-x1-carbon',
    title: 'Lenovo ThinkPad X1 Carbon Gen 12',
    brand: 'Lenovo',
    model: 'ThinkPad X1 Carbon G12',
    sku: 'LEN-X1C-G12',
    category: 'laptops',
    rating: 4.6,
    reviewCount: 2890,
    currentLowestPrice: 159990,
    originalPrice: 174990,
    discount: 9,
    storeCount: 3,
    inStock: true,
    tags: ['ai-recommended'],
    specs: { 'Display': '14" 2.8K OLED, 120Hz', 'Processor': 'Intel Core Ultra 9 185H', 'RAM': '32 GB LPDDR5x', 'Storage': '1 TB SSD', 'Battery': '57 Whr', 'Weight': '1.09 kg' },
    sellerPrices: [
      { sellerId: 'amazon', price: 159990, originalPrice: 174990, discount: 9, shipping: 0, deliveryDays: 2, deliveryEstimate: 'Jul 5', inStock: true, warranty: '3 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'flipkart', price: 162990, originalPrice: 174990, discount: 7, shipping: 0, deliveryDays: 3, deliveryEstimate: 'Jul 6', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'reliance', price: 164990, originalPrice: 174990, discount: 6, shipping: 0, deliveryDays: 4, deliveryEstimate: 'Jul 7', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
    ],
    aiSummary: { features: ['Ultra-light at 1.09 kg', 'Legendary ThinkPad keyboard', 'Enterprise-grade security features'], pros: ['Lightest 14" business laptop', 'Best keyboard on any laptop', 'Excellent reliability record'], cons: ['Expensive', 'No discrete GPU', 'Small battery capacity'], recommendation: 'The gold standard for business laptops. If your company is buying, get the 3-year warranty from Amazon.' },
    subScores: { quality: 4.8, value: 3.7, durability: 4.8, easeOfUse: 4.6, support: 4.7 },
    reviews: [],
    relatedProducts: ['macbook-air-m4', 'dell-xps-15'],
    addedDate: '2026-03-10',
  },

  // ===== AUDIO =====
  {
    id: 'sony-wh1000xm5',
    title: 'Sony WH-1000XM5 Wireless ANC Headphones',
    brand: 'Sony',
    model: 'WH-1000XM5',
    sku: 'SONY-XM5',
    category: 'audio',
    rating: 4.7,
    reviewCount: 15230,
    currentLowestPrice: 22990,
    originalPrice: 29990,
    discount: 23,
    storeCount: 5,
    inStock: true,
    tags: ['price-drop', 'editor-pick', 'most-compared'],
    specs: { 'Driver': '30mm', 'ANC': 'Yes — Industry-leading', 'Battery': '30 hours (ANC on)', 'Bluetooth': '5.3, LDAC, AAC', 'Weight': '250 g', 'Multipoint': 'Yes (2 devices)', 'Quick Charge': '3 min = 3 hours' },
    sellerPrices: [
      { sellerId: 'amazon', price: 22990, originalPrice: 29990, discount: 23, shipping: 0, deliveryDays: 1, deliveryEstimate: 'Jul 4', inStock: true, warranty: '1 Year Sony', coupon: null, cashback: 500, affiliateUrl: '#' },
      { sellerId: 'flipkart', price: 23490, originalPrice: 29990, discount: 22, shipping: 0, deliveryDays: 2, deliveryEstimate: 'Jul 5', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'croma', price: 24990, originalPrice: 29990, discount: 17, shipping: 0, deliveryDays: 3, deliveryEstimate: 'Jul 6', inStock: true, warranty: '1 Year Sony + 1 Year Extended', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'reliance', price: 24490, originalPrice: 29990, discount: 18, shipping: 0, deliveryDays: 3, deliveryEstimate: 'Jul 6', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'tatacliq', price: 25990, originalPrice: 29990, discount: 13, shipping: 199, deliveryDays: 5, deliveryEstimate: 'Jul 8', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
    ],
    aiSummary: { features: ['Industry-leading noise cancellation', '30-hour battery with ANC', 'Multipoint Bluetooth for 2 devices simultaneously', 'Speak-to-Chat auto-pause'], pros: ['Best ANC on the market', 'Incredibly comfortable for all-day wear', 'Excellent call quality', 'Premium sound signature'], cons: ['No folding design — less portable than XM4', 'Touch controls can be finicky', 'Not great for working out (no sweat resistance)', 'Expensive at full price'], recommendation: 'The 23% discount to ₹22,990 on Amazon is near the all-time low. If you\'re looking for premium ANC headphones, this is THE time to buy. Don\'t wait.' },
    subScores: { quality: 4.8, value: 4.3, durability: 4.4, easeOfUse: 4.5, support: 4.3 },
    reviews: [
      { author: 'Arjun S.', rating: 5, date: '2026-06-25', title: 'ANC is witchcraft', body: 'Put these on in a busy cafe and the world disappears. Sound quality is warm and detailed. Worth every rupee.', helpful: 456, source: 'Amazon.in' },
      { author: 'Nisha P.', rating: 4, date: '2026-06-15', title: 'Great but wish they folded', body: 'ANC is amazing, comfort is 10/10, but the flat-fold design makes them less portable than the XM4s.', helpful: 234, source: 'Flipkart' },
    ],
    relatedProducts: ['airpods-pro-2', 'jbl-charge-5'],
    addedDate: '2025-09-01',
  },
  {
    id: 'airpods-pro-2',
    title: 'Apple AirPods Pro 2 (USB-C)',
    brand: 'Apple',
    model: 'AirPods Pro 2',
    sku: 'APPL-APP2-USBC',
    category: 'audio',
    rating: 4.6,
    reviewCount: 18900,
    currentLowestPrice: 20900,
    originalPrice: 24900,
    discount: 16,
    storeCount: 4,
    inStock: true,
    tags: ['trending', 'most-compared'],
    specs: { 'Driver': 'Custom Apple H2', 'ANC': 'Yes — Adaptive', 'Battery': '6h (buds) + 30h (case)', 'Bluetooth': '5.3', 'Weight': '5.3 g per bud', 'Spatial Audio': 'Yes', 'Water Resistance': 'IPX4' },
    sellerPrices: [
      { sellerId: 'flipkart', price: 20900, originalPrice: 24900, discount: 16, shipping: 0, deliveryDays: 1, deliveryEstimate: 'Jul 4', inStock: true, warranty: '1 Year Apple', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'amazon', price: 21500, originalPrice: 24900, discount: 14, shipping: 0, deliveryDays: 1, deliveryEstimate: 'Jul 4', inStock: true, warranty: '1 Year', coupon: null, cashback: 500, affiliateUrl: '#' },
      { sellerId: 'croma', price: 22900, originalPrice: 24900, discount: 8, shipping: 0, deliveryDays: 2, deliveryEstimate: 'Jul 5', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'reliance', price: 22490, originalPrice: 24900, discount: 10, shipping: 0, deliveryDays: 3, deliveryEstimate: 'Jul 6', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
    ],
    aiSummary: { features: ['Adaptive noise cancellation', 'Spatial Audio with head tracking', 'USB-C charging case', 'Hearing aid & hearing test features'], pros: ['Best earbuds for iPhone users', 'Compact & comfortable', 'Excellent ANC for earbuds'], cons: ['iOS only for full features', 'Ear tips need replacement', 'Battery degrades over time'], recommendation: 'If you use an iPhone, these are the obvious choice. Flipkart at ₹20,900 is a steal.' },
    subScores: { quality: 4.7, value: 4.2, durability: 4.0, easeOfUse: 4.8, support: 4.5 },
    reviews: [],
    relatedProducts: ['sony-wh1000xm5'],
    addedDate: '2025-10-01',
  },
  {
    id: 'jbl-charge-5',
    title: 'JBL Charge 5 Portable Bluetooth Speaker',
    brand: 'JBL',
    model: 'Charge 5',
    sku: 'JBL-CHG5',
    category: 'audio',
    rating: 4.5,
    reviewCount: 8900,
    currentLowestPrice: 12999,
    originalPrice: 17999,
    discount: 28,
    storeCount: 4,
    inStock: true,
    tags: ['price-drop', 'best-value'],
    specs: { 'Output': '40W', 'Battery': '20 hours', 'Water Resistance': 'IP67', 'Bluetooth': '5.1', 'Weight': '960 g', 'Powerbank': 'Yes — charges your phone' },
    sellerPrices: [
      { sellerId: 'amazon', price: 12999, originalPrice: 17999, discount: 28, shipping: 0, deliveryDays: 1, deliveryEstimate: 'Jul 4', inStock: true, warranty: '1 Year JBL', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'flipkart', price: 13499, originalPrice: 17999, discount: 25, shipping: 0, deliveryDays: 2, deliveryEstimate: 'Jul 5', inStock: true, warranty: '1 Year', coupon: null, cashback: 500, affiliateUrl: '#' },
      { sellerId: 'croma', price: 14999, originalPrice: 17999, discount: 17, shipping: 0, deliveryDays: 3, deliveryEstimate: 'Jul 6', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'reliance', price: 14499, originalPrice: 17999, discount: 19, shipping: 0, deliveryDays: 3, deliveryEstimate: 'Jul 6', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
    ],
    aiSummary: { features: ['40W powerful sound', 'IP67 waterproof + dustproof', '20-hour battery life', 'Built-in powerbank to charge devices'], pros: ['Incredible bass for a portable speaker', 'Truly waterproof', 'Acts as a phone charger', 'Rugged build'], cons: ['Heavy at 960g', 'No stereo pairing with non-JBL speakers', 'No AUX input'], recommendation: 'At 28% off on Amazon, this is the best portable speaker deal available right now. IP67 + powerbank make it perfect for travel.' },
    subScores: { quality: 4.5, value: 4.7, durability: 4.8, easeOfUse: 4.6, support: 4.2 },
    reviews: [],
    relatedProducts: ['sony-wh1000xm5'],
    addedDate: '2025-06-01',
  },

  // ===== TVs =====
  {
    id: 'samsung-oled-55',
    title: 'Samsung S95D 55" 4K QD-OLED Smart TV',
    brand: 'Samsung',
    model: 'QA55S95DAKLXL',
    sku: 'SAM-S95D-55',
    category: 'tvs',
    rating: 4.7,
    reviewCount: 3200,
    currentLowestPrice: 114990,
    originalPrice: 144990,
    discount: 21,
    storeCount: 4,
    inStock: true,
    tags: ['price-drop', 'editor-pick'],
    specs: { 'Display': '55" 4K QD-OLED', 'HDR': 'HDR10+, HLG', 'Refresh Rate': '144Hz', 'Smart TV': 'Tizen OS', 'Speakers': '60W Dolby Atmos', 'HDMI': '4x HDMI 2.1' },
    sellerPrices: [
      { sellerId: 'amazon', price: 114990, originalPrice: 144990, discount: 21, shipping: 0, deliveryDays: 3, deliveryEstimate: 'Jul 6', inStock: true, warranty: '1 Year Samsung', coupon: null, cashback: 5000, affiliateUrl: '#' },
      { sellerId: 'flipkart', price: 119990, originalPrice: 144990, discount: 17, shipping: 0, deliveryDays: 3, deliveryEstimate: 'Jul 6', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'croma', price: 124990, originalPrice: 144990, discount: 14, shipping: 0, deliveryDays: 5, deliveryEstimate: 'Jul 8', inStock: true, warranty: '1 Year + Installation', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'reliance', price: 121990, originalPrice: 144990, discount: 16, shipping: 0, deliveryDays: 4, deliveryEstimate: 'Jul 7', inStock: true, warranty: '1 Year', coupon: null, cashback: 3000, affiliateUrl: '#' },
    ],
    aiSummary: { features: ['QD-OLED: perfect blacks + vibrant quantum dot colors', '144Hz for smooth gaming', '60W Dolby Atmos speakers'], pros: ['Stunning picture quality', 'Great for gaming', 'Built-in speakers are actually good'], cons: ['Expensive', 'Risk of burn-in with static content', 'Tizen OS lacks some apps'], recommendation: 'Best TV under ₹1.5L. The 21% drop to ₹1,14,990 on Amazon plus ₹5,000 cashback is exceptional value. Buy now — this price won\'t last.' },
    subScores: { quality: 4.8, value: 4.1, durability: 4.3, easeOfUse: 4.4, support: 4.2 },
    reviews: [],
    relatedProducts: ['lg-c4-55', 'sony-bravia-x90l'],
    addedDate: '2025-11-01',
  },
  {
    id: 'lg-c4-55',
    title: 'LG C4 55" 4K OLED evo Smart TV',
    brand: 'LG',
    model: 'OLED55C4',
    sku: 'LG-C4-55',
    category: 'tvs',
    rating: 4.6,
    reviewCount: 4560,
    currentLowestPrice: 104990,
    originalPrice: 129990,
    discount: 19,
    storeCount: 4,
    inStock: true,
    tags: ['most-compared', 'price-drop'],
    specs: { 'Display': '55" 4K OLED evo', 'HDR': 'Dolby Vision, HDR10, HLG', 'Refresh Rate': '120Hz', 'Smart TV': 'webOS 24', 'Speakers': '40W Dolby Atmos', 'HDMI': '4x HDMI 2.1' },
    sellerPrices: [
      { sellerId: 'flipkart', price: 104990, originalPrice: 129990, discount: 19, shipping: 0, deliveryDays: 3, deliveryEstimate: 'Jul 6', inStock: true, warranty: '1 Year LG', coupon: null, cashback: 3000, affiliateUrl: '#' },
      { sellerId: 'amazon', price: 107990, originalPrice: 129990, discount: 17, shipping: 0, deliveryDays: 2, deliveryEstimate: 'Jul 5', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'croma', price: 112990, originalPrice: 129990, discount: 13, shipping: 0, deliveryDays: 5, deliveryEstimate: 'Jul 8', inStock: true, warranty: '1 Year + Installation', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'reliance', price: 109990, originalPrice: 129990, discount: 15, shipping: 0, deliveryDays: 4, deliveryEstimate: 'Jul 7', inStock: true, warranty: '1 Year', coupon: null, cashback: 2000, affiliateUrl: '#' },
    ],
    aiSummary: { features: ['OLED evo panel with enhanced brightness', 'Dolby Vision + Dolby Atmos', 'webOS with all major streaming apps', '4x HDMI 2.1 for gaming'], pros: ['Excellent OLED picture quality', 'Great smart TV platform', 'Good value for OLED'], cons: ['40W speakers are decent but not great', '120Hz vs Samsung\'s 144Hz'], recommendation: 'Best value OLED TV. If Samsung\'s S95D is over budget, the LG C4 at ₹1,04,990 delivers 90% of the experience at 20% less cost.' },
    subScores: { quality: 4.6, value: 4.4, durability: 4.3, easeOfUse: 4.5, support: 4.1 },
    reviews: [],
    relatedProducts: ['samsung-oled-55', 'sony-bravia-x90l'],
    addedDate: '2025-10-15',
  },
  {
    id: 'sony-bravia-x90l',
    title: 'Sony Bravia 55" X90L 4K Full Array LED',
    brand: 'Sony',
    model: 'KD-55X90L',
    sku: 'SONY-X90L-55',
    category: 'tvs',
    rating: 4.4,
    reviewCount: 5670,
    currentLowestPrice: 72990,
    originalPrice: 99990,
    discount: 27,
    storeCount: 4,
    inStock: true,
    tags: ['price-drop', 'best-value'],
    specs: { 'Display': '55" 4K Full Array LED', 'HDR': 'Dolby Vision, HDR10, HLG', 'Refresh Rate': '120Hz', 'Smart TV': 'Google TV', 'Speakers': '30W Dolby Atmos' },
    sellerPrices: [
      { sellerId: 'amazon', price: 72990, originalPrice: 99990, discount: 27, shipping: 0, deliveryDays: 3, deliveryEstimate: 'Jul 6', inStock: true, warranty: '1 Year Sony', coupon: null, cashback: 2000, affiliateUrl: '#' },
      { sellerId: 'flipkart', price: 74990, originalPrice: 99990, discount: 25, shipping: 0, deliveryDays: 3, deliveryEstimate: 'Jul 6', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'croma', price: 79990, originalPrice: 99990, discount: 20, shipping: 0, deliveryDays: 5, deliveryEstimate: 'Jul 8', inStock: true, warranty: '1 Year + Installation', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'reliance', price: 76990, originalPrice: 99990, discount: 23, shipping: 0, deliveryDays: 4, deliveryEstimate: 'Jul 7', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
    ],
    aiSummary: { features: ['Full Array LED with local dimming', 'Google TV built-in', 'Dolby Vision + Atmos', 'PS5 perfect companion (120Hz HDMI 2.1)'], pros: ['Excellent value for a premium LED TV', 'Great color accuracy', 'Google TV is intuitive'], cons: ['Not OLED — less contrast', 'Blooming in dark scenes', 'Speakers are average'], recommendation: 'Best 55" TV under ₹80K. The 27% discount on Amazon makes this an incredible value pick for most living rooms.' },
    subScores: { quality: 4.4, value: 4.7, durability: 4.5, easeOfUse: 4.5, support: 4.3 },
    reviews: [],
    relatedProducts: ['samsung-oled-55', 'lg-c4-55'],
    addedDate: '2025-08-01',
  },

  // ===== WEARABLES =====
  {
    id: 'apple-watch-10',
    title: 'Apple Watch Series 10 GPS 46mm',
    brand: 'Apple',
    model: 'Apple Watch Series 10',
    sku: 'APPL-AW10-46',
    category: 'wearables',
    rating: 4.6,
    reviewCount: 6780,
    currentLowestPrice: 44900,
    originalPrice: 49900,
    discount: 10,
    storeCount: 4,
    inStock: true,
    tags: ['trending'],
    specs: { 'Display': '46mm OLED Always-On', 'Sensors': 'Heart rate, SpO2, ECG, Temp', 'Battery': '18 hours', 'Water Resistance': '50m', 'OS': 'watchOS 11' },
    sellerPrices: [
      { sellerId: 'amazon', price: 44900, originalPrice: 49900, discount: 10, shipping: 0, deliveryDays: 1, deliveryEstimate: 'Jul 4', inStock: true, warranty: '1 Year Apple', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'flipkart', price: 45500, originalPrice: 49900, discount: 9, shipping: 0, deliveryDays: 2, deliveryEstimate: 'Jul 5', inStock: true, warranty: '1 Year', coupon: null, cashback: 500, affiliateUrl: '#' },
      { sellerId: 'croma', price: 46900, originalPrice: 49900, discount: 6, shipping: 0, deliveryDays: 3, deliveryEstimate: 'Jul 6', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'reliance', price: 46500, originalPrice: 49900, discount: 7, shipping: 0, deliveryDays: 3, deliveryEstimate: 'Jul 6', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
    ],
    aiSummary: { features: ['Thinnest Apple Watch ever', 'New sleep apnea detection', 'Faster S10 chip'], pros: ['Best smartwatch display', 'Deep Apple ecosystem integration'], cons: ['iPhone only', '18-hour battery is limiting'], recommendation: 'Best smartwatch for iPhone users. Amazon at ₹44,900 is the lowest current price.' },
    subScores: { quality: 4.7, value: 3.9, durability: 4.4, easeOfUse: 4.8, support: 4.6 },
    reviews: [],
    relatedProducts: ['galaxy-watch-7'],
    addedDate: '2025-10-01',
  },
  {
    id: 'galaxy-watch-7',
    title: 'Samsung Galaxy Watch 7 44mm LTE',
    brand: 'Samsung',
    model: 'Galaxy Watch 7',
    sku: 'SAM-GW7-44',
    category: 'wearables',
    rating: 4.3,
    reviewCount: 4320,
    currentLowestPrice: 27999,
    originalPrice: 33999,
    discount: 18,
    storeCount: 3,
    inStock: true,
    tags: ['price-drop', 'best-value'],
    specs: { 'Display': '44mm AMOLED, Sapphire Crystal', 'Sensors': 'Heart rate, SpO2, BIA, Temp', 'Battery': '40 hours', 'Water Resistance': '5ATM + IP68', 'OS': 'Wear OS 5' },
    sellerPrices: [
      { sellerId: 'flipkart', price: 27999, originalPrice: 33999, discount: 18, shipping: 0, deliveryDays: 2, deliveryEstimate: 'Jul 5', inStock: true, warranty: '1 Year Samsung', coupon: null, cashback: 1000, affiliateUrl: '#' },
      { sellerId: 'amazon', price: 28999, originalPrice: 33999, discount: 15, shipping: 0, deliveryDays: 1, deliveryEstimate: 'Jul 4', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'croma', price: 30999, originalPrice: 33999, discount: 9, shipping: 0, deliveryDays: 3, deliveryEstimate: 'Jul 6', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
    ],
    aiSummary: { features: ['Wear OS 5 with full Google app support', '40-hour battery life', 'Body composition analysis'], pros: ['Works with any Android phone', 'Better battery than Apple Watch', 'Full Google app store'], cons: ['Not as polished as Apple Watch', 'Some features Samsung-only'], recommendation: 'Best smartwatch for Android users. ₹27,999 on Flipkart with cashback is a great deal.' },
    subScores: { quality: 4.3, value: 4.5, durability: 4.2, easeOfUse: 4.3, support: 4.0 },
    reviews: [],
    relatedProducts: ['apple-watch-10'],
    addedDate: '2025-08-15',
  },

  // ===== HOME APPLIANCES =====
  {
    id: 'dyson-v15',
    title: 'Dyson V15 Detect Absolute Cordless Vacuum',
    brand: 'Dyson',
    model: 'V15 Detect Absolute',
    sku: 'DYS-V15-ABS',
    category: 'home_appliances',
    rating: 4.6,
    reviewCount: 3450,
    currentLowestPrice: 54900,
    originalPrice: 62900,
    discount: 13,
    storeCount: 4,
    inStock: true,
    tags: ['editor-pick'],
    specs: { 'Suction': '230 AW', 'Runtime': '60 minutes', 'Laser': 'Green laser dust detection', 'Bin': '0.76L', 'Filter': 'HEPA', 'Weight': '3.1 kg' },
    sellerPrices: [
      { sellerId: 'amazon', price: 54900, originalPrice: 62900, discount: 13, shipping: 0, deliveryDays: 2, deliveryEstimate: 'Jul 5', inStock: true, warranty: '2 Year Dyson', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'flipkart', price: 56900, originalPrice: 62900, discount: 10, shipping: 0, deliveryDays: 2, deliveryEstimate: 'Jul 5', inStock: true, warranty: '2 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'croma', price: 58900, originalPrice: 62900, discount: 6, shipping: 0, deliveryDays: 4, deliveryEstimate: 'Jul 7', inStock: true, warranty: '2 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'reliance', price: 57900, originalPrice: 62900, discount: 8, shipping: 0, deliveryDays: 3, deliveryEstimate: 'Jul 6', inStock: true, warranty: '2 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
    ],
    aiSummary: { features: ['Green laser reveals invisible dust', 'Acoustic piezo sensor measures particles', 'HEPA filtration for allergens'], pros: ['Laser dust detection is game-changing', 'Powerful suction', 'HEPA filtration'], cons: ['Very expensive', 'Battery dies fast on max mode', 'Small dustbin'], recommendation: 'Best cordless vacuum if budget allows. Amazon at ₹54,900 is the best current price.' },
    subScores: { quality: 4.8, value: 3.8, durability: 4.5, easeOfUse: 4.6, support: 4.3 },
    reviews: [],
    relatedProducts: ['irobot-roomba-j7'],
    addedDate: '2025-12-01',
  },
  {
    id: 'irobot-roomba-j7',
    title: 'iRobot Roomba j7+ Self-Emptying Robot Vacuum',
    brand: 'iRobot',
    model: 'Roomba j7+',
    sku: 'IRB-J7PLUS',
    category: 'home_appliances',
    rating: 4.4,
    reviewCount: 2890,
    currentLowestPrice: 42900,
    originalPrice: 49900,
    discount: 14,
    storeCount: 3,
    inStock: true,
    tags: ['ai-recommended'],
    specs: { 'Navigation': 'PrecisionVision AI (avoids obstacles)', 'Self-Empty': 'Yes — Clean Base included', 'Runtime': '120 minutes', 'App Control': 'iRobot Home app', 'Smart Mapping': 'Imprint Smart Map' },
    sellerPrices: [
      { sellerId: 'amazon', price: 42900, originalPrice: 49900, discount: 14, shipping: 0, deliveryDays: 2, deliveryEstimate: 'Jul 5', inStock: true, warranty: '1 Year iRobot', coupon: null, cashback: 1500, affiliateUrl: '#' },
      { sellerId: 'flipkart', price: 44900, originalPrice: 49900, discount: 10, shipping: 0, deliveryDays: 3, deliveryEstimate: 'Jul 6', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'croma', price: 46900, originalPrice: 49900, discount: 6, shipping: 0, deliveryDays: 5, deliveryEstimate: 'Jul 8', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
    ],
    aiSummary: { features: ['AI-powered obstacle avoidance (avoids pet messes, cables)', 'Self-emptying base — hands-free for weeks', 'Smart mapping learns your home'], pros: ['Truly hands-free cleaning', 'Excellent obstacle avoidance', 'Great app and scheduling'], cons: ['Expensive', 'Replacement bags add ongoing cost', 'No mopping'], recommendation: 'Best robot vacuum for pet owners. The AI obstacle avoidance is genuinely game-changing.' },
    subScores: { quality: 4.5, value: 4.0, durability: 4.2, easeOfUse: 4.7, support: 4.1 },
    reviews: [],
    relatedProducts: ['dyson-v15'],
    addedDate: '2026-01-15',
  },

  // ===== FASHION =====
  {
    id: 'nike-air-max-270',
    title: 'Nike Air Max 270 — Men\'s',
    brand: 'Nike',
    model: 'Air Max 270',
    sku: 'NIKE-AM270-M',
    category: 'fashion',
    rating: 4.4,
    reviewCount: 12340,
    currentLowestPrice: 11497,
    originalPrice: 13995,
    discount: 18,
    storeCount: 3,
    inStock: true,
    tags: ['trending', 'best-value'],
    specs: { 'Upper': 'Mesh + synthetic leather', 'Sole': 'Air Max 270 unit', 'Closure': 'Lace-up', 'Style': 'Lifestyle / Running' },
    sellerPrices: [
      { sellerId: 'amazon', price: 11497, originalPrice: 13995, discount: 18, shipping: 0, deliveryDays: 2, deliveryEstimate: 'Jul 5', inStock: true, warranty: '6 Months', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'flipkart', price: 11997, originalPrice: 13995, discount: 14, shipping: 0, deliveryDays: 3, deliveryEstimate: 'Jul 6', inStock: true, warranty: '6 Months', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'myntra', price: 11197, originalPrice: 13995, discount: 20, shipping: 0, deliveryDays: 3, deliveryEstimate: 'Jul 6', inStock: true, warranty: '6 Months', coupon: 'SHOE10', couponDiscount: 1000, cashback: 0, affiliateUrl: '#' },
    ],
    aiSummary: { features: ['Max Air 270 unit for supreme cushioning', 'Breathable mesh upper', 'Iconic design'], pros: ['Incredible comfort', 'Timeless design', 'Great for everyday wear'], cons: ['Not ideal for running', 'Narrow fit for wide feet'], recommendation: 'Myntra offers the best price at ₹11,197 with an extra ₹1,000 off coupon SHOE10.' },
    subScores: { quality: 4.4, value: 4.5, durability: 4.2, easeOfUse: 4.6, support: 4.0 },
    reviews: [],
    relatedProducts: ['rayban-aviator', 'levis-501'],
    addedDate: '2025-05-01',
  },
  {
    id: 'rayban-aviator',
    title: 'Ray-Ban Aviator Classic — Gold/Green',
    brand: 'Ray-Ban',
    model: 'RB3025 Aviator',
    sku: 'RB-AV-GG',
    category: 'fashion',
    rating: 4.6,
    reviewCount: 8900,
    currentLowestPrice: 10490,
    originalPrice: 12490,
    discount: 16,
    storeCount: 3,
    inStock: true,
    tags: ['editor-pick'],
    specs: { 'Frame': 'Metal — Gold', 'Lens': 'Crystal green, G-15', 'UV Protection': '100% UVA/UVB', 'Size': '58mm (Large)' },
    sellerPrices: [
      { sellerId: 'amazon', price: 10490, originalPrice: 12490, discount: 16, shipping: 0, deliveryDays: 2, deliveryEstimate: 'Jul 5', inStock: true, warranty: '1 Year Luxottica', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'flipkart', price: 10990, originalPrice: 12490, discount: 12, shipping: 0, deliveryDays: 2, deliveryEstimate: 'Jul 5', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'tatacliq', price: 11490, originalPrice: 12490, discount: 8, shipping: 0, deliveryDays: 4, deliveryEstimate: 'Jul 7', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
    ],
    aiSummary: { features: ['Iconic pilot shape since 1937', 'Crystal G-15 lenses for natural color', '100% UV protection'], pros: ['Timeless iconic design', 'Excellent lens quality', 'Solid metal construction'], cons: ['Scratches easily without case', 'Many fakes in market — buy from authorized sellers'], recommendation: 'A classic that never goes out of style. Amazon at ₹10,490 is a verified genuine seller.' },
    subScores: { quality: 4.7, value: 4.3, durability: 4.1, easeOfUse: 4.5, support: 4.2 },
    reviews: [],
    relatedProducts: ['nike-air-max-270'],
    addedDate: '2025-06-15',
  },
  {
    id: 'levis-501',
    title: 'Levi\'s 501 Original Fit Jeans — Dark Wash',
    brand: 'Levi\'s',
    model: '501 Original',
    sku: 'LEV-501-DW',
    category: 'fashion',
    rating: 4.3,
    reviewCount: 15600,
    currentLowestPrice: 3599,
    originalPrice: 4599,
    discount: 22,
    storeCount: 3,
    inStock: true,
    tags: ['best-value', 'most-compared'],
    specs: { 'Fit': 'Regular — Straight Leg', 'Material': '100% Cotton Denim', 'Rise': 'Mid Rise', 'Closure': 'Button Fly' },
    sellerPrices: [
      { sellerId: 'myntra', price: 3599, originalPrice: 4599, discount: 22, shipping: 0, deliveryDays: 3, deliveryEstimate: 'Jul 6', inStock: true, warranty: '30 Day Returns', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'amazon', price: 3799, originalPrice: 4599, discount: 17, shipping: 0, deliveryDays: 2, deliveryEstimate: 'Jul 5', inStock: true, warranty: '30 Day Returns', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'flipkart', price: 3899, originalPrice: 4599, discount: 15, shipping: 0, deliveryDays: 2, deliveryEstimate: 'Jul 5', inStock: true, warranty: '30 Day Returns', coupon: null, cashback: 0, affiliateUrl: '#' },
    ],
    aiSummary: { features: ['The original jean since 1890', 'Straight fit that works for everyone', '100% cotton selvedge denim'], pros: ['Timeless design', 'Durable construction', 'Gets better with wear'], cons: ['Shrinks slightly after first wash', 'Button fly takes getting used to'], recommendation: 'A wardrobe essential. Myntra at ₹3,599 is the cheapest current option.' },
    subScores: { quality: 4.4, value: 4.7, durability: 4.6, easeOfUse: 4.2, support: 4.0 },
    reviews: [],
    relatedProducts: ['nike-air-max-270', 'rayban-aviator'],
    addedDate: '2025-04-01',
  },

  // ===== GAMING =====
  {
    id: 'ps5-slim',
    title: 'Sony PlayStation 5 Slim (Disc Edition)',
    brand: 'Sony',
    model: 'PlayStation 5 Slim',
    sku: 'SONY-PS5-SLIM',
    category: 'gaming',
    rating: 4.7,
    reviewCount: 21000,
    currentLowestPrice: 47490,
    originalPrice: 54990,
    discount: 14,
    storeCount: 4,
    inStock: true,
    tags: ['trending', 'price-drop'],
    specs: { 'CPU': 'AMD Zen 2, 8-core', 'GPU': 'AMD RDNA 2, 10.28 TFLOPS', 'Storage': '1TB SSD', 'RAM': '16 GB GDDR6', 'Disc Drive': 'Yes — 4K Blu-ray', 'Output': '4K@120Hz, 8K' },
    sellerPrices: [
      { sellerId: 'amazon', price: 47490, originalPrice: 54990, discount: 14, shipping: 0, deliveryDays: 2, deliveryEstimate: 'Jul 5', inStock: true, warranty: '1 Year Sony', coupon: null, cashback: 2000, affiliateUrl: '#' },
      { sellerId: 'flipkart', price: 48490, originalPrice: 54990, discount: 12, shipping: 0, deliveryDays: 2, deliveryEstimate: 'Jul 5', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'croma', price: 49990, originalPrice: 54990, discount: 9, shipping: 0, deliveryDays: 3, deliveryEstimate: 'Jul 6', inStock: true, warranty: '1 Year + Extra Controller', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'reliance', price: 49490, originalPrice: 54990, discount: 10, shipping: 0, deliveryDays: 3, deliveryEstimate: 'Jul 6', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
    ],
    aiSummary: { features: ['30% smaller than original PS5', '1TB SSD storage', '4K Blu-ray disc drive included', 'DualSense controller with haptic feedback'], pros: ['Best exclusive game library', 'Compact new design', 'Fast SSD for near-instant loading', 'DualSense controller is incredible'], cons: ['Online play requires PS Plus subscription', 'Limited backward compatibility with PS1/2/3', 'Fan can get noisy during intensive games'], recommendation: 'Best gaming console overall. Amazon at ₹47,490 with ₹2,000 cashback is the lowest price this quarter.' },
    subScores: { quality: 4.8, value: 4.4, durability: 4.5, easeOfUse: 4.6, support: 4.3 },
    reviews: [],
    relatedProducts: ['switch-oled', 'asus-rog-g16'],
    addedDate: '2025-11-15',
  },
  {
    id: 'switch-oled',
    title: 'Nintendo Switch OLED Model — White',
    brand: 'Nintendo',
    model: 'Switch OLED',
    sku: 'NIN-SWOLED-W',
    category: 'gaming',
    rating: 4.5,
    reviewCount: 14500,
    currentLowestPrice: 27999,
    originalPrice: 34999,
    discount: 20,
    storeCount: 3,
    inStock: true,
    tags: ['price-drop'],
    specs: { 'Display': '7" OLED', 'Storage': '64GB + microSD', 'Battery': '4.5-9 hours', 'Modes': 'TV, Tabletop, Handheld', 'Joy-Con': 'White detachable' },
    sellerPrices: [
      { sellerId: 'amazon', price: 27999, originalPrice: 34999, discount: 20, shipping: 0, deliveryDays: 1, deliveryEstimate: 'Jul 4', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'flipkart', price: 28999, originalPrice: 34999, discount: 17, shipping: 0, deliveryDays: 2, deliveryEstimate: 'Jul 5', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'croma', price: 30999, originalPrice: 34999, discount: 11, shipping: 0, deliveryDays: 4, deliveryEstimate: 'Jul 7', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
    ],
    aiSummary: { features: ['Gorgeous 7" OLED screen', 'Play anywhere — TV, tabletop, or handheld', 'Incredible exclusive games (Zelda, Mario, Pokémon)'], pros: ['Unique hybrid gaming concept', 'Best exclusive game library for families', 'OLED screen is beautiful in handheld mode'], cons: ['Underpowered compared to PS5/Xbox', 'Joy-Con drift is still an issue', 'Online service is limited'], recommendation: 'Best family/casual gaming device. At 20% off on Amazon, it\'s a great time to buy before Switch 2 potentially raises prices.' },
    subScores: { quality: 4.4, value: 4.6, durability: 4.0, easeOfUse: 4.8, support: 4.1 },
    reviews: [],
    relatedProducts: ['ps5-slim'],
    addedDate: '2025-07-01',
  },

  // ===== TABLET =====
  {
    id: 'ipad-air-m2',
    title: 'Apple iPad Air M2 11" 128GB WiFi',
    brand: 'Apple',
    model: 'iPad Air M2',
    sku: 'APPL-IPAM2-128',
    category: 'tablets',
    rating: 4.6,
    reviewCount: 5670,
    currentLowestPrice: 64900,
    originalPrice: 69900,
    discount: 7,
    storeCount: 4,
    inStock: true,
    tags: ['editor-pick', 'ai-recommended'],
    specs: { 'Display': '11" Liquid Retina, P3 Wide Color', 'Chip': 'Apple M2', 'Storage': '128 GB', 'Camera': '12MP + 12MP front', 'Battery': '10 hours', 'Apple Pencil': 'USB-C (2nd gen)' },
    sellerPrices: [
      { sellerId: 'amazon', price: 64900, originalPrice: 69900, discount: 7, shipping: 0, deliveryDays: 1, deliveryEstimate: 'Jul 4', inStock: true, warranty: '1 Year Apple', coupon: null, cashback: 1000, affiliateUrl: '#' },
      { sellerId: 'flipkart', price: 65900, originalPrice: 69900, discount: 6, shipping: 0, deliveryDays: 2, deliveryEstimate: 'Jul 5', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'croma', price: 67900, originalPrice: 69900, discount: 3, shipping: 0, deliveryDays: 3, deliveryEstimate: 'Jul 6', inStock: true, warranty: '1 Year + 1 Year Extended', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'reliance', price: 66900, originalPrice: 69900, discount: 4, shipping: 0, deliveryDays: 3, deliveryEstimate: 'Jul 6', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
    ],
    aiSummary: { features: ['M2 chip for laptop-class performance', 'Works with Apple Pencil & Magic Keyboard', 'Gorgeous Liquid Retina display'], pros: ['Powerful M2 chip', 'Lightweight and portable', 'Great for creative work'], cons: ['Base 128GB may not be enough', 'No Face ID', 'Accessories are expensive'], recommendation: 'Best tablet for most people. Amazon at ₹64,900 with ₹1,000 cashback is solid.' },
    subScores: { quality: 4.7, value: 4.2, durability: 4.5, easeOfUse: 4.7, support: 4.5 },
    reviews: [],
    relatedProducts: ['macbook-air-m4'],
    addedDate: '2025-09-15',
  },

  // ===== BEAUTY =====
  {
    id: 'dyson-airwrap',
    title: 'Dyson Airwrap Multi-Styler Complete Long',
    brand: 'Dyson',
    model: 'Airwrap Multi-Styler',
    sku: 'DYS-AW-CL',
    category: 'beauty',
    rating: 4.4,
    reviewCount: 6780,
    currentLowestPrice: 41900,
    originalPrice: 45900,
    discount: 9,
    storeCount: 3,
    inStock: true,
    tags: ['trending'],
    specs: { 'Attachments': '6 styling attachments', 'Technology': 'Coanda air styling', 'Heat Settings': '3 heat + 2 speed', 'Heat Damage': 'No extreme heat' },
    sellerPrices: [
      { sellerId: 'amazon', price: 41900, originalPrice: 45900, discount: 9, shipping: 0, deliveryDays: 2, deliveryEstimate: 'Jul 5', inStock: true, warranty: '2 Year Dyson', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'flipkart', price: 42900, originalPrice: 45900, discount: 7, shipping: 0, deliveryDays: 2, deliveryEstimate: 'Jul 5', inStock: true, warranty: '2 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'tatacliq', price: 43900, originalPrice: 45900, discount: 4, shipping: 0, deliveryDays: 4, deliveryEstimate: 'Jul 7', inStock: true, warranty: '2 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
    ],
    aiSummary: { features: ['No extreme heat damage to hair', '6 attachments for every style', 'Coanda effect wraps hair automatically'], pros: ['Healthier styling without extreme heat', 'Versatile — curls, waves, smooth, dry', 'Premium build quality'], cons: ['Very expensive', 'Learning curve to use properly', 'Heavy for travel'], recommendation: 'Worth the premium if you style your hair daily. Amazon at ₹41,900 saves you ₹4,000 from retail.' },
    subScores: { quality: 4.6, value: 3.8, durability: 4.5, easeOfUse: 3.9, support: 4.3 },
    reviews: [],
    relatedProducts: ['dyson-v15'],
    addedDate: '2025-12-15',
  },

  // ===== KITCHEN =====
  {
    id: 'instant-pot-duo',
    title: 'Instant Pot Duo Plus 6L 9-in-1 Pressure Cooker',
    brand: 'Instant Pot',
    model: 'Duo Plus 6L',
    sku: 'IP-DUO-6L',
    category: 'kitchen',
    rating: 4.5,
    reviewCount: 23400,
    currentLowestPrice: 7999,
    originalPrice: 12999,
    discount: 38,
    storeCount: 3,
    inStock: true,
    tags: ['price-drop', 'best-value', 'most-compared'],
    specs: { 'Capacity': '6 Liters', 'Functions': '9-in-1 (Pressure Cook, Slow Cook, Rice, Steam, Sauté, Yogurt, etc.)', 'Power': '1000W', 'Inner Pot': 'Stainless Steel' },
    sellerPrices: [
      { sellerId: 'amazon', price: 7999, originalPrice: 12999, discount: 38, shipping: 0, deliveryDays: 1, deliveryEstimate: 'Jul 4', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'flipkart', price: 8499, originalPrice: 12999, discount: 35, shipping: 0, deliveryDays: 2, deliveryEstimate: 'Jul 5', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'croma', price: 9999, originalPrice: 12999, discount: 23, shipping: 0, deliveryDays: 4, deliveryEstimate: 'Jul 7', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
    ],
    aiSummary: { features: ['9-in-1: replaces 9 kitchen appliances', 'Stainless steel inner pot (no non-stick coating)', '13 smart safety features'], pros: ['Incredible versatility', 'Saves kitchen space', 'Very affordable at sale price', 'Easy to clean'], cons: ['Learning curve for beginners', 'Gasket absorbs smells', 'Slow cook mode is mediocre'], recommendation: 'At 38% off, this is the best kitchen deal right now. Amazon at ₹7,999 is near the all-time lowest price.' },
    subScores: { quality: 4.5, value: 4.9, durability: 4.4, easeOfUse: 4.2, support: 4.0 },
    reviews: [],
    relatedProducts: [],
    addedDate: '2025-03-01',
  },

  // ===== SMART HOME =====
  {
    id: 'echo-show-10',
    title: 'Amazon Echo Show 10 (3rd Gen) Smart Display',
    brand: 'Amazon',
    model: 'Echo Show 10',
    sku: 'AMZ-ES10-3',
    category: 'smart_home',
    rating: 4.2,
    reviewCount: 7890,
    currentLowestPrice: 18999,
    originalPrice: 24999,
    discount: 24,
    storeCount: 2,
    inStock: true,
    tags: ['price-drop'],
    specs: { 'Display': '10.1" HD', 'Speaker': 'Dual front-firing + woofer', 'Camera': '13MP wide-angle', 'Motion': '350° rotating display', 'Assistant': 'Alexa' },
    sellerPrices: [
      { sellerId: 'amazon', price: 18999, originalPrice: 24999, discount: 24, shipping: 0, deliveryDays: 1, deliveryEstimate: 'Jul 4', inStock: true, warranty: '1 Year', coupon: null, cashback: 1000, affiliateUrl: '#' },
      { sellerId: 'flipkart', price: 21999, originalPrice: 24999, discount: 12, shipping: 0, deliveryDays: 3, deliveryEstimate: 'Jul 6', inStock: true, warranty: '1 Year', coupon: null, cashback: 0, affiliateUrl: '#' },
    ],
    aiSummary: { features: ['Auto-rotating display follows you around the room', '13MP camera for video calls', 'Works as smart home hub'], pros: ['Unique rotating display', 'Good sound quality', 'Great for video calls'], cons: ['Expensive for a smart display', 'Motion tracking can feel creepy', 'Privacy concerns'], recommendation: 'Amazon at ₹18,999 with ₹1,000 cashback is the obvious choice — Flipkart is significantly more expensive.' },
    subScores: { quality: 4.2, value: 4.0, durability: 4.1, easeOfUse: 4.5, support: 4.3 },
    reviews: [],
    relatedProducts: [],
    addedDate: '2025-08-01',
  },

  // ===== BOOKS =====
  {
    id: 'atomic-habits',
    title: 'Atomic Habits by James Clear (Paperback)',
    brand: 'Penguin',
    model: 'Atomic Habits',
    sku: 'BOOK-AH-PB',
    category: 'books',
    rating: 4.7,
    reviewCount: 98000,
    currentLowestPrice: 399,
    originalPrice: 599,
    discount: 33,
    storeCount: 3,
    inStock: true,
    tags: ['best-value', 'most-compared', 'trending'],
    specs: { 'Author': 'James Clear', 'Pages': '320', 'Language': 'English', 'Publisher': 'Penguin Random House', 'ISBN': '978-0735211292', 'Format': 'Paperback' },
    sellerPrices: [
      { sellerId: 'amazon', price: 399, originalPrice: 599, discount: 33, shipping: 0, deliveryDays: 1, deliveryEstimate: 'Jul 4', inStock: true, warranty: 'Returnable within 10 days', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'flipkart', price: 425, originalPrice: 599, discount: 29, shipping: 40, deliveryDays: 2, deliveryEstimate: 'Jul 5', inStock: true, warranty: 'Returnable within 10 days', coupon: null, cashback: 0, affiliateUrl: '#' },
      { sellerId: 'tatacliq', price: 449, originalPrice: 599, discount: 25, shipping: 0, deliveryDays: 4, deliveryEstimate: 'Jul 7', inStock: true, warranty: 'Returnable', coupon: null, cashback: 0, affiliateUrl: '#' },
    ],
    aiSummary: { features: ['#1 NYT Bestseller', 'Practical framework for building good habits and breaking bad ones', 'Backed by scientific research'], pros: ['Actionable and practical', 'Easy to read', 'Life-changing for many readers'], cons: ['Some concepts are repetitive', 'Not much new for self-help readers'], recommendation: 'A must-read at any price. Amazon at ₹399 with free delivery is the cheapest option.' },
    subScores: { quality: 4.8, value: 4.9, durability: 4.2, easeOfUse: 4.8, support: 4.0 },
    reviews: [],
    relatedProducts: [],
    addedDate: '2024-01-01',
  },
];

// Generate images for all products
products.forEach(p => {
  const gradient = categoryGradients[p.category] || ['#1A1A1A', '#333333'];
  const img = generateProductImage(p.brand + ' ' + (p.model || p.title.split(' ').slice(0, 2).join(' ')), gradient);
  p.images = [img, img, img, img]; // repeat for gallery
  p.thumbnail = img;
});

// --- DEALS ---
const now = Date.now();
const oneDay = 86400000;
const deals = [
  { productId: 'sony-wh1000xm5', type: 'flash', title: 'Flash Deal: Sony XM5 at All-Time Low!', description: '23% off — limited stock', discountPercent: 23, originalPrice: 29990, dealPrice: 22990, startTime: now - oneDay * 0.5, endTime: now + oneDay * 1.5, isActive: true },
  { productId: 'samsung-s25-ultra', type: 'daily', title: 'Galaxy S25 Ultra — ₹10,000 Off Today', description: 'Save big on the best Android phone', discountPercent: 7, originalPrice: 134999, dealPrice: 124999, startTime: now - oneDay, endTime: now + oneDay * 0.75, isActive: true },
  { productId: 'instant-pot-duo', type: 'flash', title: 'Instant Pot at 38% OFF — Near All-Time Low!', description: '9-in-1 cooker at its cheapest', discountPercent: 38, originalPrice: 12999, dealPrice: 7999, startTime: now - oneDay * 2, endTime: now + oneDay * 0.5, isActive: true },
  { productId: 'asus-rog-g16', type: 'daily', title: 'ROG Strix G16 — ₹15,000 Price Drop', description: 'Best gaming laptop deal this month', discountPercent: 12, originalPrice: 129990, dealPrice: 114990, startTime: now - oneDay * 3, endTime: now + oneDay * 2, isActive: true },
  { productId: 'jbl-charge-5', type: 'flash', title: 'JBL Charge 5 — 28% OFF', description: 'IP67 waterproof speaker at a steal', discountPercent: 28, originalPrice: 17999, dealPrice: 12999, startTime: now, endTime: now + oneDay * 3, isActive: true },
  { productId: 'ps5-slim', type: 'daily', title: 'PS5 Slim — ₹7,500 Off + Cashback', description: 'Best console price this quarter', discountPercent: 14, originalPrice: 54990, dealPrice: 47490, startTime: now - oneDay * 2, endTime: now + oneDay * 4, isActive: true },
  { productId: 'sony-bravia-x90l', type: 'flash', title: 'Sony Bravia X90L — Massive 27% Drop!', description: 'Best 55" LED TV deal in India', discountPercent: 27, originalPrice: 99990, dealPrice: 72990, startTime: now - oneDay, endTime: now + oneDay * 1, isActive: true },
  { productId: 'levis-501', type: 'coupon', title: 'Levi\'s 501 — Extra 22% Off', description: 'Classic jeans at lowest price ever', discountPercent: 22, originalPrice: 4599, dealPrice: 3599, startTime: now - oneDay * 5, endTime: now + oneDay * 5, isActive: true },
  { productId: 'switch-oled', type: 'daily', title: 'Nintendo Switch OLED — 20% Off', description: 'Before Switch 2 launches!', discountPercent: 20, originalPrice: 34999, dealPrice: 27999, startTime: now - oneDay, endTime: now + oneDay * 3, isActive: true },
  { productId: 'samsung-oled-55', type: 'flash', title: 'Samsung QD-OLED TV — ₹30,000 Savings!', description: 'Best QD-OLED price ever in India', discountPercent: 21, originalPrice: 144990, dealPrice: 114990, startTime: now - oneDay * 0.5, endTime: now + oneDay * 2, isActive: true },
  { productId: 'airpods-pro-2', type: 'coupon', title: 'AirPods Pro 2 — 16% Off on Flipkart', description: 'Best earbuds for iPhone at a steal', discountPercent: 16, originalPrice: 24900, dealPrice: 20900, startTime: now - oneDay * 3, endTime: now + oneDay * 7, isActive: true },
  { productId: 'echo-show-10', type: 'daily', title: 'Echo Show 10 — 24% Off + Cashback', description: 'Smart home hub at its best price', discountPercent: 24, originalPrice: 24999, dealPrice: 18999, startTime: now - oneDay * 2, endTime: now + oneDay * 2, isActive: true },
  { productId: 'galaxy-watch-7', type: 'flash', title: 'Galaxy Watch 7 — ₹6,000 Off!', description: 'Best Android smartwatch deal', discountPercent: 18, originalPrice: 33999, dealPrice: 27999, startTime: now, endTime: now + oneDay * 1.5, isActive: true },
  { productId: 'macbook-air-m4', type: 'coupon', title: 'MacBook Air M4 — Coupon: MAC3K', description: 'Use coupon for extra ₹3,000 off', discountPercent: 4, originalPrice: 114900, dealPrice: 109900, startTime: now - oneDay * 5, endTime: now + oneDay * 10, isActive: true },
  { productId: 'dyson-airwrap', type: 'daily', title: 'Dyson Airwrap — Save ₹4,000', description: 'Premium hair styler at discount', discountPercent: 9, originalPrice: 45900, dealPrice: 41900, startTime: now - oneDay * 2, endTime: now + oneDay * 3, isActive: true },
];

// --- Featured lists ---
const trendingIds = ['iphone-16-pro-max', 'samsung-s25-ultra', 'oneplus-13', 'ps5-slim', 'airpods-pro-2', 'nike-air-max-270', 'dyson-airwrap', 'atomic-habits'];
const priceDropIds = ['samsung-s25-ultra', 'oneplus-13', 'pixel-9-pro', 'sony-wh1000xm5', 'jbl-charge-5', 'asus-rog-g16', 'samsung-oled-55', 'lg-c4-55', 'sony-bravia-x90l', 'ps5-slim', 'switch-oled', 'galaxy-watch-7', 'instant-pot-duo', 'echo-show-10'];
const editorPickIds = ['iphone-16-pro-max', 'macbook-air-m4', 'sony-wh1000xm5', 'samsung-oled-55', 'hp-spectre-x360', 'rayban-aviator', 'dyson-v15', 'ipad-air-m2'];
const aiRecommendedIds = ['pixel-9-pro', 'macbook-air-m4', 'irobot-roomba-j7', 'thinkpad-x1-carbon', 'ipad-air-m2'];
const mostComparedIds = ['sony-wh1000xm5', 'airpods-pro-2', 'levis-501', 'instant-pot-duo', 'lg-c4-55', 'iphone-16-pro-max', 'samsung-s25-ultra'];

// --- TRUST / SOCIAL PROOF DATA ---
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
  { icon: '📊', title: '365-Day Price History', desc: 'See exactly how a price has moved over the last year before you decide.' },
  { icon: '🔔', title: 'Free Price Alerts', desc: 'Tell us your target price — we\'ll email you the moment it hits.' },
  { icon: '🤖', title: 'AI Review Summaries', desc: 'Thousands of reviews condensed into honest pros, cons, and a verdict.' },
];

const howItWorksSteps = [
  { step: 1, title: 'Search or browse', desc: 'Find any product across 18 categories and 6 major Indian retailers in one search bar.' },
  { step: 2, title: 'Compare instantly', desc: 'See live prices, coupons, cashback, delivery time, and warranty side by side.' },
  { step: 3, title: 'Buy at the best price', desc: 'Click through to the cheapest verified seller and check out directly on their site.' },
];

const faqs = [
  { q: 'Is PriceMint free to use?', a: 'Yes, completely free. We earn a small commission from retailers when you make a purchase through our links — this never affects the price you pay.' },
  { q: 'How often are prices updated?', a: 'Prices are refreshed continuously throughout the day as retailers change them, so what you see is as close to real-time as possible.' },
  { q: 'Do you sell products directly?', a: 'No. PriceMint is a comparison platform only. When you click "Buy Now" you\'re taken to the retailer\'s own site to complete your purchase securely.' },
  { q: 'How do price alerts work?', a: 'Set your target price on any product page and we\'ll email you the moment any tracked seller drops to or below that price.' },
  { q: 'Which retailers do you compare?', a: 'We currently track Amazon.in, Flipkart, Croma, Reliance Digital, Tata CLiQ, and Myntra, with more being added regularly.' },
];

const partnerBrands = ['Apple', 'Samsung', 'Sony', 'OnePlus', 'Dell', 'LG', 'JBL', 'Nike', 'Dyson', 'Lenovo', 'ASUS', 'Google'];

// --- HELPER FUNCTIONS ---
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
    const searchable = [p.title, p.brand, p.model, p.sku, p.category].join(' ').toLowerCase();
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

function getCheapestSeller(product) {
  if (!product.sellerPrices || product.sellerPrices.length === 0) return null;
  return product.sellerPrices.reduce((min, sp) => {
    const totalMin = min.price + (min.shipping || 0);
    const totalSp = sp.price + (sp.shipping || 0);
    return totalSp < totalMin ? sp : min;
  });
}

function getFastestSeller(product) {
  if (!product.sellerPrices || product.sellerPrices.length === 0) return null;
  return product.sellerPrices.filter(s => s.inStock).reduce((fast, sp) =>
    sp.deliveryDays < fast.deliveryDays ? sp : fast
  );
}

function getBestValueSeller(product) {
  if (!product.sellerPrices || product.sellerPrices.length === 0) return null;
  return product.sellerPrices.filter(s => s.inStock).reduce((best, sp) => {
    const seller = getSellerById(sp.sellerId);
    const scoreA = (best.price + (best.shipping || 0)) * (1 - (seller ? seller.rating / 10 : 0));
    const scoreB = (sp.price + (sp.shipping || 0)) * (1 - (seller ? seller.rating / 10 : 0));
    return scoreB < scoreA ? sp : best;
  });
}

// --- WISHLIST (persisted in localStorage) ---
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

// --- EXPORT TO GLOBAL ---
window.PriceMint = {
  products,
  sellers,
  categories,
  deals,
  trendingIds,
  priceDropIds,
  editorPickIds,
  aiRecommendedIds,
  mostComparedIds,
  categoryGradients,
  siteStats,
  testimonials,
  trustBadges,
  howItWorksSteps,
  faqs,
  partnerBrands,
  // Helpers
  formatPrice,
  formatDiscount,
  formatCompactNumber,
  getProductById,
  getProductsByCategory,
  getProductsByIds,
  getSellerById,
  searchProducts,
  getStarHTML,
  getCheapestSeller,
  getFastestSeller,
  getBestValueSeller,
  generatePriceHistory,
  generateProductImage,
  getWishlist,
  isInWishlist,
  toggleWishlist,
  getRecentlyViewed,
  addRecentlyViewed,
};
