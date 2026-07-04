/**
 * products.js
 * All product/deal data comes directly from Supabase — no separate
 * backend server required. Import the functions you need on each page.
 *
 * Usage: <script type="module" src="js/products.js"></script>
 * (or import specific functions from another module script)
 */

import { supabase } from './auth.js';

/**
 * Fetch all active products, optionally filtered by category.
 * @param {Object} options
 * @param {string} [options.category] - filter by category slug
 * @param {number} [options.limit] - max rows to return
 */
export async function getProducts({ category, limit = 60 } = {}) {
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) console.error('getProducts error:', error.message);
  return { data: data || [], error };
}

/**
 * Fetch today's deals — products with discount above a threshold,
 * sorted by biggest discount first.
 * @param {number} minDiscount - minimum discount % to qualify as a "deal" (default 5)
 * @param {number} limit
 */
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

/**
 * Fetch a single product by its id (used on product.html).
 */
export async function getProductById(id) {
  if (!id) return { data: null, error: { message: 'Product id is required.' } };

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error) console.error('getProductById error:', error.message);
  return { data, error };
}

/**
 * Search products by title/brand (used for the header search bar).
 * Uses Postgres ILIKE for simple case-insensitive partial matching.
 */
export async function searchProducts(term, limit = 20) {
  if (!term || !term.trim()) return { data: [], error: null };

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .or(`title.ilike.%${term}%,brand.ilike.%${term}%`)
    .limit(limit);

  if (error) console.error('searchProducts error:', error.message);
  return { data: data || [], error };
}

// ---------------------------------------------------------------------------
// Small formatting helpers shared across pages
// ---------------------------------------------------------------------------

export function formatPrice(price) {
  const n = Number(price) || 0;
  return '₹' + n.toLocaleString('en-IN');
}

export function starRating(rating) {
  const full = Math.floor(rating || 0);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}
