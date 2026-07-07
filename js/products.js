/**
 * products.js
 * Single data-access layer for the entire site. Every page (index,
 * search, product, deals, wishlist, admin) reads/writes through these
 * functions instead of hitting Supabase directly — that way the table
 * shape only needs to change in one place if it ever evolves.
 *
 * Usage: <script type="module" src="js/products.js"></script>
 * (or import specific functions from another module script)
 */

import { supabase, checkSession } from './auth.js';

// ---------------------------------------------------------------------
// Formatting helpers (shared across pages)
// ---------------------------------------------------------------------

export function formatPrice(price) {
  const n = Number(price) || 0;
  return '₹' + n.toLocaleString('en-IN');
}

export function starRating(rating) {
  const full = Math.floor(rating || 0);
  const half = (rating || 0) % 1 >= 0.3 ? 1 : 0;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(Math.max(0, 5 - full - half));
}

export function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

function sanitizeSearchTerm(term) {
  return String(term || '').replace(/[%_]/g, '').trim();
}

// ---------------------------------------------------------------------
// PRODUCT CATALOG (Supabase `products` table)
// ---------------------------------------------------------------------

/**
 * Fetch active products, optionally filtered by category, sorted newest first.
 */
export async function getProducts({ category, limit = 60 } = {}) {
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (category) query = query.eq('category', category);

  const { data, error } = await query;
  if (error) console.error('getProducts error:', error.message);
  return { data: data || [], error };
}

/** All active products flagged is_trending. */
export async function getTrending(limit = 8) {
  const { data, error } = await supabase
    .from('products').select('*')
    .eq('is_active', true).eq('is_trending', true)
    .limit(limit);
  if (error) console.error('getTrending error:', error.message);
  return { data: data || [], error };
}

/** Deals — active products above a discount threshold, biggest first. */
export async function getDeals(minDiscount = 5, limit = 40) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .gt('discount', minDiscount)
    .order('discount', { ascending: false })
    .limit(limit);

  if (error) console.error('getDeals error:', error.message);
  return { data: data || [], error };
}

/** Single product by id (used on product.html). */
export async function getProductById(id) {
  if (!id) return { data: null, error: { message: 'Product id is required.' } };

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .maybeSingle();

  if (error) console.error('getProductById error:', error.message);
  return { data, error };
}

/** Search products by title/brand — used by the header search bar and search.html. */
export async function searchProducts(term, { category, limit = 40 } = {}) {
  if (!term || !term.trim()) return getProducts({ category, limit });

  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .or(`title.ilike.%${sanitizeSearchTerm(term)}%,brand.ilike.%${sanitizeSearchTerm(term)}%`)
    .limit(limit);

  if (category) query = query.eq('category', category);

  const { data, error } = await query;
  if (error) console.error('searchProducts error:', error.message);
  return { data: data || [], error };
}

/** Products with the biggest live discount, for category pill / homepage strips. */
export async function getByFlag(flag, limit = 8) {
  const validFlags = ['is_trending', 'is_price_drop', 'is_editor_pick', 'is_ai_recommended', 'is_most_compared'];
  if (!validFlags.includes(flag)) return { data: [], error: { message: 'Invalid flag' } };

  const { data, error } = await supabase
    .from('products').select('*')
    .eq('is_active', true).eq(flag, true)
    .limit(limit);
  if (error) console.error(`getByFlag(${flag}) error:`, error.message);
  return { data: data || [], error };
}

// ---------------------------------------------------------------------
// PRICE ALERTS (Supabase `price_alerts` table — requires login)
// ---------------------------------------------------------------------

/** Create or update a price alert for the current user. */
export async function setPriceAlert(productId, targetPrice) {
  const session = await checkSession();
  if (!session) return { data: null, error: { message: 'Please sign in to set a price alert.' } };

  const { data, error } = await supabase
    .from('price_alerts')
    .upsert(
      { user_id: session.user.id, product_id: productId, target_price: targetPrice },
      { onConflict: 'user_id,product_id' }
    )
    .select()
    .single();

  if (error) console.error('setPriceAlert error:', error.message);
  return { data, error };
}

/** All price alerts for the current user, each enriched with its product row. */
export async function getMyPriceAlerts() {
  const session = await checkSession();
  if (!session) return { data: [], error: { message: 'Not signed in.' } };

  const { data, error } = await supabase
    .from('price_alerts')
    .select('*, product:products(*)')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  if (error) console.error('getMyPriceAlerts error:', error.message);
  // Filter out alerts whose product was deactivated/deleted since being set.
  return { data: (data || []).filter((a) => a.product), error };
}

export async function deletePriceAlert(alertId) {
  const { error } = await supabase.from('price_alerts').delete().eq('id', alertId);
  if (error) console.error('deletePriceAlert error:', error.message);
  return { error };
}

// ---------------------------------------------------------------------
// LOCAL WISHLIST (heart icon — instant, no login required)
// Kept in localStorage since it's a lightweight "favorites" list,
// separate from the login-gated Price Alerts above.
// ---------------------------------------------------------------------

const WISHLIST_KEY = 'pm_wishlist';

export function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
  } catch {
    return [];
  }
}

export function isInWishlist(productId) {
  return getWishlist().includes(productId);
}

export function toggleWishlist(productId) {
  let list = getWishlist();
  let added;
  if (list.includes(productId)) {
    list = list.filter((id) => id !== productId);
    added = false;
  } else {
    list.push(productId);
    added = true;
  }
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
  return added;
}

// ---------------------------------------------------------------------
// RECENTLY VIEWED
// ---------------------------------------------------------------------

const RECENTLY_VIEWED_KEY = 'pm_recently_viewed';
const RECENTLY_VIEWED_MAX = 8;

export function addRecentlyViewed(productId) {
  try {
    let ids = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY)) || [];
    ids = ids.filter((id) => id !== productId);
    ids.unshift(productId);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(ids.slice(0, RECENTLY_VIEWED_MAX)));
  } catch { /* ignore quota errors */ }
}

export async function getRecentlyViewedProducts() {
  let ids = [];
  try {
    ids = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY)) || [];
  } catch { return []; }
  if (!ids.length) return [];

  const { data, error } = await supabase.from('products').select('*').in('id', ids).eq('is_active', true);
  if (error || !data) return [];
  // preserve most-recent-first order
  return ids.map((id) => data.find((p) => p.id === id)).filter(Boolean);
}
