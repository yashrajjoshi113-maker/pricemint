// ============================================
// PriceMint — Front-end Application Logic
// Rendering, interactivity, and small UX
// enhancements for the home page.
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Make formatPrice globally available if not already defined
    window.formatPrice = window.formatPrice || ((price) => '₹' + price.toLocaleString('en-IN'));

    const PM = window.PriceMint || {};

    /* =========================================================
       TOAST NOTIFICATIONS
       ========================================================= */
    function ensureToastContainer() {
        let el = document.getElementById('toast-container');
        if (!el) {
            el = document.createElement('div');
            el.id = 'toast-container';
            el.className = 'fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-[999] flex flex-col items-center gap-2 pointer-events-none';
            document.body.appendChild(el);
        }
        return el;
    }

    function showToast(message, opts = {}) {
        const { icon = '✓', variant = 'dark', duration = 2600 } = opts;
        const container = ensureToastContainer();
        const toast = document.createElement('div');
        const variantClasses = {
            dark: 'bg-charcoal text-white',
            success: 'bg-savings text-white',
            warn: 'bg-white text-charcoal border border-gray-200',
        };
        toast.className = `pointer-events-auto slide-up flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl text-sm font-medium ${variantClasses[variant] || variantClasses.dark}`;
        toast.innerHTML = `<span class="text-base leading-none">${icon}</span><span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(8px)';
            setTimeout(() => toast.remove(), 350);
        }, duration);
    }
    window.pmToast = showToast;

    /* =========================================================
       WISHLIST
       ========================================================= */
    function updateWishlistCount() {
        const countEl = document.getElementById('wishlist-count');
        if (!countEl || !PM.getWishlist) return;
        const count = PM.getWishlist().length;
        countEl.textContent = count > 99 ? '99+' : String(count);
        countEl.classList.toggle('hidden', count === 0);
    }

    function refreshWishlistIcons() {
        document.querySelectorAll('[data-wishlist-btn]').forEach(btn => {
            const id = btn.getAttribute('data-wishlist-btn');
            const active = PM.isInWishlist && PM.isInWishlist(id);
            btn.classList.toggle('is-active', !!active);
            const svg = btn.querySelector('svg');
            if (svg) svg.setAttribute('fill', active ? '#DC2626' : 'none');
            btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
    }

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-wishlist-btn]');
        if (!btn || !PM.toggleWishlist) return;
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute('data-wishlist-btn');
        const added = PM.toggleWishlist(id);
        updateWishlistCount();
        refreshWishlistIcons();
        const product = PM.getProductById ? PM.getProductById(id) : null;
        const name = product ? product.title.split(' ').slice(0, 3).join(' ') : 'Item';
        showToast(added ? `${name} added to wishlist` : `${name} removed from wishlist`, {
            icon: added ? '❤️' : '💔',
            variant: added ? 'success' : 'dark',
        });
    });

    updateWishlistCount();

    /* =========================================================
       PRODUCT CARD RENDERER
       ========================================================= */
    const renderCard = (p) => {
        const lowestPrice = p.currentLowestPrice || p.price || 0;
        const originalPrice = p.originalPrice || (lowestPrice * 1.1);
        const discount = p.discount || Math.round((1 - (lowestPrice / originalPrice)) * 100);
        const brand = p.brand || 'Brand';
        const title = p.title || 'Product';
        const id = p.id || '';
        const wished = PM.isInWishlist && PM.isInWishlist(id);

        let thumb = p.thumbnail || p.image;
        if (!thumb && window.generateProductImage && p.category && typeof categoryGradients !== 'undefined') {
             thumb = generateProductImage(title, categoryGradients[p.category] || ['#1A1A1A', '#2D2D2D']);
        } else if (!thumb) {
             thumb = `https://via.placeholder.com/400x400.png?text=${encodeURIComponent(title)}`;
        }

        return `
        <div class="relative block bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover group w-full">
            <button type="button" data-wishlist-btn="${id}" aria-pressed="${wished ? 'true' : 'false'}"
                    class="wishlist-btn absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:scale-110 transition-transform ${wished ? 'is-active' : ''}"
                    aria-label="Toggle wishlist">
                <svg class="w-4 h-4 text-[#DC2626] transition-colors" fill="${wished ? '#DC2626' : 'none'}" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            </button>
            <a href="product.html?id=${id}" class="cursor-pointer">
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
        </div>
    `};

    /* =========================================================
       CATEGORIES
       ========================================================= */
    const categoriesContainer = document.getElementById('categories-grid');
    if (categoriesContainer && typeof categories !== 'undefined') {
        const shown = categories.filter(c => c.productCount > 0);
        const catHtml = shown.map(c => `
            <a href="search.html?category=${c.slug}" class="bg-white rounded-2xl p-5 text-center card-hover border border-gray-100 flex flex-col items-center gap-3">
                <span class="text-3xl">${c.icon}</span>
                <span class="font-semibold text-sm text-charcoal">${c.name}</span>
                <span class="text-xs text-gray-400">${c.productCount} product${c.productCount === 1 ? '' : 's'}</span>
            </a>
        `).join('');
        categoriesContainer.innerHTML = catHtml;
    }

    /* =========================================================
       TRENDING / PRICE DROPS
       ========================================================= */
    const trendingContainer = document.getElementById('trending-container');
    if (trendingContainer && typeof products !== 'undefined') {
        const ids = (PM.trendingIds && PM.trendingIds.length) ? PM.trendingIds : products.slice(0, 8).map(p => p.id);
        const list = PM.getProductsByIds ? PM.getProductsByIds(ids) : products.slice(0, 8);
        trendingContainer.innerHTML = list.map(renderCard).join('');
    }

    const priceDropsContainer = document.getElementById('pricedrops-container');
    if (priceDropsContainer && typeof products !== 'undefined') {
        const drops = [...products].sort((a, b) => (b.discount || 0) - (a.discount || 0));
        priceDropsContainer.innerHTML = drops.slice(0, 8).map(renderCard).join('');
    }

    /* =========================================================
       RECENTLY VIEWED
       ========================================================= */
    const recentSection = document.getElementById('recently-viewed-section');
    const recentContainer = document.getElementById('recently-viewed-container');
    if (recentSection && recentContainer && PM.getRecentlyViewed) {
        const recent = PM.getRecentlyViewed();
        if (recent.length > 0) {
            recentSection.classList.remove('hidden');
            recentContainer.innerHTML = recent.map(renderCard).join('');
        }
    }

    /* =========================================================
       FLASH DEALS STRIP + COUNTDOWNS
       ========================================================= */
    const flashContainer = document.getElementById('flash-deals-container');
    if (flashContainer && typeof deals !== 'undefined' && PM.getProductById) {
        const flash = deals.filter(d => d.type === 'flash' && d.isActive).slice(0, 4);
        flashContainer.innerHTML = flash.map(d => {
            const p = PM.getProductById(d.productId);
            if (!p) return '';
            const thumb = p.thumbnail || '';
            return `
            <a href="product.html?id=${p.id}" class="deal-card bg-charcoal text-white rounded-2xl p-4 flex items-center gap-4 card-hover shrink-0 w-[300px]">
                <div class="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
                    <img src="${thumb}" alt="${p.title}" class="w-full h-full object-cover">
                </div>
                <div class="min-w-0">
                    <p class="text-[11px] uppercase tracking-wide text-accent font-semibold mb-1">Flash Deal</p>
                    <h4 class="text-sm font-semibold line-clamp-1 mb-1">${p.title}</h4>
                    <div class="flex items-baseline gap-2 mb-1.5">
                        <span class="text-base font-bold num">${formatPrice(d.dealPrice)}</span>
                        <span class="text-xs text-gray-400 line-through num">${formatPrice(d.originalPrice)}</span>
                    </div>
                    <div class="countdown flex gap-1" data-end="${d.endTime}"></div>
                </div>
            </a>`;
        }).join('');

        startCountdowns();
    }

    function startCountdowns() {
        const els = document.querySelectorAll('.countdown[data-end]');
        if (!els.length) return;
        function tick() {
            const now = Date.now();
            els.forEach(el => {
                const end = parseInt(el.getAttribute('data-end'), 10);
                let diff = Math.max(0, end - now);
                const h = Math.floor(diff / 3600000);
                diff -= h * 3600000;
                const m = Math.floor(diff / 60000);
                diff -= m * 60000;
                const s = Math.floor(diff / 1000);
                el.innerHTML = `
                    <span class="countdown-seg !px-1.5 !py-0.5 !text-[11px] !min-w-[26px]">${String(h).padStart(2, '0')}</span>
                    <span class="text-white/40 text-xs self-center">:</span>
                    <span class="countdown-seg !px-1.5 !py-0.5 !text-[11px] !min-w-[26px]">${String(m).padStart(2, '0')}</span>
                    <span class="text-white/40 text-xs self-center">:</span>
                    <span class="countdown-seg !px-1.5 !py-0.5 !text-[11px] !min-w-[26px]">${String(s).padStart(2, '0')}</span>
                `;
            });
        }
        tick();
        setInterval(tick, 1000);
    }

    /* =========================================================
       LIVE STATS COUNTER (animated on scroll into view)
       ========================================================= */
    const statsContainer = document.getElementById('stats-grid');
    if (statsContainer && PM.siteStats) {
        statsContainer.innerHTML = PM.siteStats.map(s => `
            <div class="text-center">
                <div class="text-3xl md:text-4xl font-display font-bold text-white num" data-count-to="${s.value}" data-suffix="${s.suffix}">0</div>
                <p class="text-sm text-white/60 mt-1">${s.icon} ${s.label}</p>
            </div>
        `).join('');

        const counters = statsContainer.querySelectorAll('[data-count-to]');
        const animateCounter = (el) => {
            const target = parseInt(el.getAttribute('data-count-to'), 10);
            const suffix = el.getAttribute('data-suffix') || '';
            const duration = 1600;
            const start = performance.now();
            function frame(now) {
                const progress = Math.min(1, (now - start) / duration);
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = Math.floor(eased * target);
                el.textContent = (window.PriceMint && window.PriceMint.formatCompactNumber
                    ? window.PriceMint.formatCompactNumber(value)
                    : value.toLocaleString('en-IN')) + suffix;
                if (progress < 1) requestAnimationFrame(frame);
            }
            requestAnimationFrame(frame);
        };

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    counters.forEach(animateCounter);
                    statsObserver.disconnect();
                }
            });
        }, { threshold: 0.4 });
        statsObserver.observe(statsContainer);
    }

    /* =========================================================
       HOW IT WORKS
       ========================================================= */
    const howItWorksContainer = document.getElementById('how-it-works-container');
    if (howItWorksContainer && PM.howItWorksSteps) {
        howItWorksContainer.innerHTML = PM.howItWorksSteps.map(s => `
            <div class="reveal flex-1 relative">
                <div class="text-5xl font-display font-bold text-gray-100 mb-3 select-none">0${s.step}</div>
                <h3 class="text-lg font-display font-bold text-charcoal mb-2">${s.title}</h3>
                <p class="text-sm text-gray-500 leading-relaxed">${s.desc}</p>
            </div>
        `).join('');
    }

    /* =========================================================
       TRUST BADGES
       ========================================================= */
    const trustContainer = document.getElementById('trust-badges-container');
    if (trustContainer && PM.trustBadges) {
        trustContainer.innerHTML = PM.trustBadges.map(b => `
            <div class="reveal bg-white rounded-2xl p-6 border border-gray-100 card-hover">
                <div class="w-11 h-11 rounded-xl bg-savings-light flex items-center justify-center text-xl mb-4">${b.icon}</div>
                <h4 class="font-semibold text-charcoal text-sm mb-1.5">${b.title}</h4>
                <p class="text-xs text-gray-500 leading-relaxed">${b.desc}</p>
            </div>
        `).join('');
    }

    /* =========================================================
       TESTIMONIALS CAROUSEL
       ========================================================= */
    const testimonialsTrack = document.getElementById('testimonials-track');
    if (testimonialsTrack && PM.testimonials) {
        testimonialsTrack.innerHTML = PM.testimonials.map(t => `
            <div class="bg-white rounded-2xl p-6 border border-gray-100 shrink-0 w-[300px] md:w-[340px]">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 rounded-full bg-charcoal text-white flex items-center justify-center text-sm font-semibold shrink-0">${t.avatarInitials}</div>
                    <div>
                        <p class="text-sm font-semibold text-charcoal leading-tight">${t.name}</p>
                        <p class="text-xs text-gray-400">${t.location}</p>
                    </div>
                </div>
                <p class="text-xs text-[#F59E0B] mb-2">${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</p>
                <p class="text-sm text-gray-600 leading-relaxed">"${t.text}"</p>
            </div>
        `).join('');
    }

    /* =========================================================
       PARTNER BRAND STRIP
       ========================================================= */
    const brandStrip = document.getElementById('brand-strip');
    if (brandStrip && PM.partnerBrands) {
        const doubled = [...PM.partnerBrands, ...PM.partnerBrands];
        brandStrip.innerHTML = doubled.map(b => `<span class="shrink-0 text-lg md:text-xl font-display font-semibold text-gray-300 px-6 md:px-10">${b}</span>`).join('');
    }

    /* =========================================================
       FAQ ACCORDION
       ========================================================= */
    const faqContainer = document.getElementById('faq-container');
    if (faqContainer && PM.faqs) {
        faqContainer.innerHTML = PM.faqs.map((f, i) => `
            <div class="faq-item border-b border-gray-200 py-2">
                <button type="button" class="faq-trigger w-full flex items-center justify-between gap-4 py-3 text-left" data-faq-index="${i}">
                    <span class="text-sm md:text-base font-semibold text-charcoal">${f.q}</span>
                    <svg class="faq-chevron w-4 h-4 text-gray-400 shrink-0 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                </button>
                <div class="faq-panel grid grid-rows-[0fr] transition-all duration-300 ease-out">
                    <div class="overflow-hidden">
                        <p class="text-sm text-gray-500 leading-relaxed pb-3 pr-8">${f.a}</p>
                    </div>
                </div>
            </div>
        `).join('');

        faqContainer.querySelectorAll('.faq-trigger').forEach(trigger => {
            trigger.addEventListener('click', () => {
                const item = trigger.closest('.faq-item');
                const panel = item.querySelector('.faq-panel');
                const chevron = item.querySelector('.faq-chevron');
                const isOpen = panel.classList.contains('grid-rows-[1fr]');
                faqContainer.querySelectorAll('.faq-panel').forEach(p => p.classList.remove('grid-rows-[1fr]'));
                faqContainer.querySelectorAll('.faq-panel').forEach(p => p.classList.add('grid-rows-[0fr]'));
                faqContainer.querySelectorAll('.faq-chevron').forEach(c => c.classList.remove('rotate-180'));
                if (!isOpen) {
                    panel.classList.remove('grid-rows-[0fr]');
                    panel.classList.add('grid-rows-[1fr]');
                    chevron.classList.add('rotate-180');
                }
            });
        });
    }

    /* =========================================================
       NEWSLETTER SIGNUP
       ========================================================= */
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input[type="email"]');
            const email = input ? input.value.trim() : '';
            if (!email || !email.includes('@')) {
                showToast('Please enter a valid email address', { icon: '⚠️', variant: 'warn' });
                return;
            }
            showToast('You\'re subscribed! Watch your inbox for deals.', { icon: '📩', variant: 'success' });
            newsletterForm.reset();
        });
    }

    /* =========================================================
       BACK TO TOP BUTTON
       ========================================================= */
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('opacity-0', window.scrollY < 400);
            backToTop.classList.toggle('pointer-events-none', window.scrollY < 400);
        });
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    /* =========================================================
       SCROLL REVEAL ANIMATIONS
       ========================================================= */
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        revealEls.forEach(el => revealObserver.observe(el));
    }

    /* =========================================================
       SEARCH AUTOCOMPLETE
       ========================================================= */
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

            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && searchInput.value.trim()) {
                    window.location.href = `search.html?q=${encodeURIComponent(searchInput.value.trim())}`;
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

    /* =========================================================
       TRENDING SEARCH CHIPS
       ========================================================= */
    const trendingChipsContainer = document.getElementById('trending-chips');
    if (trendingChipsContainer && typeof products !== 'undefined') {
        const chips = ['iPhone 16 Pro Max', 'Sony XM5', 'PS5 Slim', 'MacBook Air M4', 'Samsung S25 Ultra'];
        trendingChipsContainer.innerHTML = chips.map(c => `
            <a href="search.html?q=${encodeURIComponent(c)}" class="px-3.5 py-1.5 rounded-full bg-white/70 hover:bg-white text-xs font-medium text-charcoal border border-gray-200 transition-colors">${c}</a>
        `).join('');
    }

    /* =========================================================
       HEADER SHADOW ON SCROLL
       ========================================================= */
    const header = document.getElementById('site-header');
    if (header) {
        const onScroll = () => header.classList.toggle('shadow-sm', window.scrollY > 8);
        window.addEventListener('scroll', onScroll);
        onScroll();
    }

    // Final icon sync (in case markup rendered wishlist buttons before this point)
    refreshWishlistIcons();
});
