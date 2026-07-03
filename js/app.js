document.addEventListener('DOMContentLoaded', () => {
    // Make formatPrice globally available if not already defined
    window.formatPrice = window.formatPrice || ((price) => '₹' + price.toLocaleString('en-IN'));

    // Categories rendering
    const categoriesContainer = document.getElementById('categories-grid');
    if (categoriesContainer && typeof categories !== 'undefined') {
        const catHtml = categories.slice(0, 6).map(c => `
            <a href="search.html?category=${c.slug}" class="bg-white rounded-2xl p-5 text-center card-hover border border-gray-100 flex flex-col items-center gap-3">
                <span class="text-3xl">${c.icon}</span>
                <span class="font-semibold text-sm text-charcoal">${c.name}</span>
            </a>
        `).join('');
        categoriesContainer.innerHTML = catHtml;
    }

    // Render Product Card Function
    const renderCard = (p) => {
        // Fallback for missing properties based on data.js schema
        const lowestPrice = p.currentLowestPrice || p.price || 0;
        const originalPrice = p.originalPrice || (lowestPrice * 1.1);
        const discount = p.discount || Math.round((1 - (lowestPrice / originalPrice)) * 100);
        const brand = p.brand || 'Brand';
        const title = p.title || 'Product';
        const id = p.id || '';
        
        let thumb = p.thumbnail || p.image;
        if (!thumb && window.generateProductImage && p.category && typeof categoryGradients !== 'undefined') {
             thumb = generateProductImage(title, categoryGradients[p.category] || ['#1A1A1A', '#2D2D2D']);
        } else if (!thumb) {
             thumb = `https://via.placeholder.com/400x400.png?text=${encodeURIComponent(title)}`;
        }

        return `
        <a href="product.html?id=${id}" class="block bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover group cursor-pointer w-full">
            <div class="aspect-square bg-cream-dark overflow-hidden p-4 flex items-center justify-center">
                <img src="${thumb}" alt="${title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
            </div>
            <div class="p-4">
                <p class="text-xs text-gray-400 font-medium mb-1">${brand}</p>
                <h3 class="text-sm font-semibold text-charcoal line-clamp-2 mb-2 leading-snug">${title}</h3>
                <div class="flex items-baseline gap-2 mb-1.5">
                    <span class="text-lg font-bold text-charcoal num">${formatPrice(lowestPrice)}</span>
                    ${originalPrice > lowestPrice ? `<span class="text-xs text-gray-400 line-through num">${formatPrice(originalPrice)}</span>` : ''}
                </div>
                <div class="flex items-center justify-between mt-3">
                    ${discount > 0 ? `<span class="badge badge-green bg-[#E8F8EE] text-[#15803D] px-2 py-0.5 rounded-full text-xs font-semibold">${discount}% off</span>` : '<span></span>'}
                    <div class="flex items-center gap-1">
                        <span class="text-xs text-[#F59E0B]">★ ${p.rating || '4.0'}</span>
                    </div>
                </div>
            </div>
        </a>
    `};

    // Trending rendering
    const trendingContainer = document.getElementById('trending-container');
    if (trendingContainer && typeof products !== 'undefined') {
        const trendingHtml = products.slice(0, 6).map(renderCard).join('');
        trendingContainer.innerHTML = trendingHtml;
    }

    // Price Drops rendering
    const priceDropsContainer = document.getElementById('pricedrops-container');
    if (priceDropsContainer && typeof products !== 'undefined') {
        const drops = [...products].sort((a,b) => (b.discount || 0) - (a.discount || 0));
        const dropsHtml = drops.slice(0, 6).map(renderCard).join('');
        priceDropsContainer.innerHTML = dropsHtml;
    }

    // Search Autocomplete Functionality
    const setupAutocomplete = (inputId, dropdownId, containerId) => {
        const searchInput = document.getElementById(inputId);
        const dropdown = document.getElementById(dropdownId);
        
        if (searchInput && dropdown) {
            searchInput.addEventListener('input', (e) => {
                const val = e.target.value.toLowerCase();
                if (!val) { 
                    dropdown.style.display = 'none'; 
                    dropdown.classList.add('hidden');
                    return; 
                }
                
                if (typeof products !== 'undefined') {
                    const matches = products.filter(p => (p.title || '').toLowerCase().includes(val) || (p.brand || '').toLowerCase().includes(val));
                    if (matches.length > 0) {
                        dropdown.innerHTML = matches.slice(0, 5).map(m => `
                            <div class="autocomplete-item p-3 hover:bg-gray-50 flex items-center gap-3 cursor-pointer border-b border-gray-50 last:border-0" onclick="window.location.href='product.html?id=${m.id}'">
                                <div class="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-charcoal shrink-0">${(m.brand || 'P')[0]}</div>
                                <div>
                                    <div class="text-sm font-semibold text-charcoal line-clamp-1">${m.title}</div>
                                    <div class="text-xs text-gray-500">${formatPrice(m.currentLowestPrice || m.price || 0)}</div>
                                </div>
                            </div>
                        `).join('');
                        dropdown.style.display = 'block';
                        dropdown.classList.remove('hidden');
                    } else {
                        dropdown.innerHTML = `<div class="p-4 text-sm text-gray-500 text-center">No products found</div>`;
                        dropdown.style.display = 'block';
                        dropdown.classList.remove('hidden');
                    }
                }
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
