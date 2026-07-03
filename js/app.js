document.addEventListener('DOMContentLoaded', () => {
    // Make formatPrice globally available
    window.formatPrice = window.formatPrice || ((price) => '₹' + price.toLocaleString('en-IN'));

    // Categories rendering (Premium Glassmorphism Style)
    const categoriesContainer = document.getElementById('categories-grid');
    if (categoriesContainer && typeof categories !== 'undefined') {
        const catHtml = categories.slice(0, 6).map(c => `
            <a href="search.html?category=${c.slug}" class="bg-white rounded-3xl p-5 text-center card-hover border border-gray-100 flex flex-col items-center gap-3 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div class="w-16 h-16 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center shadow-inner border border-white">
                    <span class="text-3xl">${c.icon}</span>
                </div>
                <span class="font-semibold text-sm text-gray-800 tracking-tight">${c.name}</span>
            </a>
        `).join('');
        categoriesContainer.innerHTML = catHtml;
    }

    // Render Premium Product Card Function
    const renderCard = (p) => {
        const lowestPrice = p.lowestPrice || p.currentLowestPrice || p.price || 0;
        const originalPrice = p.originalPrice || Math.round(lowestPrice * 1.15);
        const discount = p.discount || Math.round((1 - (lowestPrice / originalPrice)) * 100);
        const brand = p.brand || 'Brand';
        const title = p.title || 'Product';
        const platform = p.cheapestPlatform || 'Amazon';
        const buyUrl = p.cheapestUrl || '#';
        const id = p.id || '';
        
        let thumb = p.image || p.thumbnail;
        if (!thumb) {
             thumb = `https://via.placeholder.com/400x400.png?text=${encodeURIComponent(title)}`;
        }

        // Platform Colors
        const platformColors = {
            'Amazon': 'bg-yellow-400 text-black',
            'Flipkart': 'bg-blue-600 text-white',
            'Myntra': 'bg-pink-500 text-white',
            'Meesho': 'bg-purple-600 text-white'
        };
        const pBadge = platformColors[platform] || 'bg-gray-800 text-white';

        return `
        <div class="block bg-white rounded-[2rem] border border-gray-100/80 overflow-hidden card-hover group w-full shadow-lg shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-200/80 transition-all duration-500 relative flex flex-col">
            
            <!-- Platform Badge -->
            <div class="absolute top-4 right-4 z-10">
                <span class="${pBadge} text-[10px] font-bold px-3 py-1.5 rounded-full shadow-md backdrop-blur-md uppercase tracking-wider">Lowest on ${platform}</span>
            </div>

            <!-- Image Container -->
            <a href="product.html?id=${id}" class="aspect-square bg-white overflow-hidden p-6 flex items-center justify-center relative">
                <!-- Soft Glow behind image -->
                <div class="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/50 z-0"></div>
                <img src="${thumb}" alt="${title}" class="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-700 ease-out" loading="lazy">
            </a>

            <!-- Content Container -->
            <div class="p-6 flex-1 flex flex-col bg-gradient-to-b from-white to-gray-50/30">
                <div class="flex items-center justify-between mb-2">
                    <p class="text-xs text-gray-400 font-semibold uppercase tracking-wider">${brand}</p>
                    <div class="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-100">
                        <span class="text-xs text-yellow-600 font-bold">★ ${p.rating || '4.5'}</span>
                    </div>
                </div>
                
                <h3 class="text-[15px] font-bold text-gray-900 line-clamp-2 mb-3 leading-snug group-hover:text-blue-600 transition-colors">
                    <a href="product.html?id=${id}">${title}</a>
                </h3>
                
                <div class="mt-auto">
                    <div class="flex items-end gap-2 mb-4">
                        <span class="text-2xl font-display font-bold text-gray-900 tracking-tight">${formatPrice(lowestPrice)}</span>
                        ${originalPrice > lowestPrice ? `<span class="text-sm text-gray-400 line-through font-medium mb-1">${formatPrice(originalPrice)}</span>` : ''}
                        ${discount > 0 ? `<span class="ml-auto bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-bold border border-green-200/50">-${discount}%</span>` : ''}
                    </div>
                    
                    <a href="${buyUrl}" target="_blank" rel="noopener noreferrer" class="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 relative overflow-hidden group/btn">
                        <span class="relative z-10">Buy Now</span>
                        <svg class="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                        <div class="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                    </a>
                </div>
            </div>
        </div>
    `};

    // Fetch from Backend
    const fetchProducts = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/products');
            if (res.ok) {
                const data = await res.json();
                renderProductSections(data);
            } else {
                console.warn("Backend fetch failed, falling back to window.products");
                if (typeof products !== 'undefined') renderProductSections(products);
            }
        } catch (e) {
            console.error("Fetch error:", e);
            if (typeof products !== 'undefined') renderProductSections(products);
        }
    };

    const renderProductSections = (dataList) => {
        const trendingContainer = document.getElementById('trending-container');
        if (trendingContainer) {
            const trendingHtml = dataList.slice(0, 6).map(renderCard).join('');
            trendingContainer.innerHTML = trendingHtml;
        }

        const priceDropsContainer = document.getElementById('pricedrops-container');
        if (priceDropsContainer) {
            const drops = [...dataList].sort((a,b) => (b.discount || 0) - (a.discount || 0));
            const dropsHtml = drops.slice(0, 6).map(renderCard).join('');
            priceDropsContainer.innerHTML = dropsHtml;
        }
    };

    // Initialize Fetch
    fetchProducts();

    // Search Autocomplete Functionality
    const setupAutocomplete = (inputId, dropdownId, containerId) => {
        const searchInput = document.getElementById(inputId);
        const dropdown = document.getElementById(dropdownId);
        
        if (searchInput && dropdown) {
            let debounceTimer;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(debounceTimer);
                const val = e.target.value.trim();
                
                if (!val) { 
                    dropdown.style.display = 'none'; 
                    dropdown.classList.add('hidden');
                    return; 
                }
                
                debounceTimer = setTimeout(async () => {
                    try {
                        dropdown.innerHTML = `<div class="p-4 text-sm text-gray-500 text-center flex items-center justify-center gap-2"><div class="w-4 h-4 border-2 border-gray-400 border-t-gray-800 rounded-full animate-spin"></div> Searching...</div>`;
                        dropdown.style.display = 'block';
                        dropdown.classList.remove('hidden');

                        const res = await fetch(`http://localhost:3000/api/products?q=${encodeURIComponent(val)}`);
                        if (res.ok) {
                            const matches = await res.json();
                            if (matches.length > 0) {
                                dropdown.innerHTML = matches.slice(0, 5).map(m => `
                                    <div class="autocomplete-item p-3 hover:bg-gray-50 flex items-center gap-4 cursor-pointer border-b border-gray-100 last:border-0 transition-colors" onclick="window.location.href='${m.cheapestUrl || '#'}'">
                                        <div class="w-12 h-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm p-1">
                                            ${m.image ? `<img src="${m.image}" class="w-full h-full object-contain">` : `<span class="text-xs font-bold text-gray-400">${(m.brand || 'P')[0]}</span>`}
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <div class="text-sm font-semibold text-gray-900 truncate">${m.title}</div>
                                            <div class="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                                                <span class="font-bold text-gray-800">${formatPrice(m.lowestPrice || 0)}</span>
                                                <span class="bg-gray-100 px-1.5 rounded text-[10px] uppercase font-bold tracking-wider">${m.cheapestPlatform || 'Store'}</span>
                                            </div>
                                        </div>
                                    </div>
                                `).join('');
                            } else {
                                dropdown.innerHTML = `<div class="p-4 text-sm text-gray-500 text-center">No products found</div>`;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                        dropdown.innerHTML = `<div class="p-4 text-sm text-red-500 text-center">Failed to fetch results</div>`;
                    }
                }, 500); // Debounce delay
            });

            document.addEventListener('click', (e) => {
                const container = document.getElementById(containerId);
                if (container && !e.target.closest('#' + containerId)) {
                    dropdown.style.display = 'none';
                    dropdown.classList.add('hidden');
                }
            });
        }
    };

    setupAutocomplete('header-search', 'search-autocomplete', 'search-container');
    setupAutocomplete('mobile-search', 'search-autocomplete-mobile', 'search-container-mobile');
});
