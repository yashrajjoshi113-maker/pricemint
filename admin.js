/**
 * admin.js
 * Admin-only helpers. All writes are also enforced server-side by
 * Supabase RLS policies (see supabase-schema.sql) — even if someone
 * bypasses this file, the database itself will reject non-admin writes.
 */

import { supabase, checkSession } from './auth.js';

/**
 * Returns true if the current logged-in user is in the admins table.
 */
export async function isAdmin() {
  const session = await checkSession();
  if (!session) return false;

  const { data, error } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', session.user.id)
    .maybeSingle();

  if (error) {
    console.error('isAdmin check failed:', error.message);
    return false;
  }
  return !!data;
}

/**
 * Fetch ALL products (including inactive ones) — for the admin table view.
 */
export async function getAllProductsAdmin() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) console.error('getAllProductsAdmin error:', error.message);
  return { data: data || [], error };
}

/**
 * Create a new product. `product` should match the products table columns.
 */
export async function createProduct(product) {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();

  if (error) console.error('createProduct error:', error.message);
  return { data, error };
}

/**
 * Update an existing product by id.
 */
export async function updateProduct(id, updates) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) console.error('updateProduct error:', error.message);
  return { data, error };
}

/**
 * Permanently delete a product. Prefer toggleProductActive() for
 * hiding products instead, so you don't lose historical data.
 */
export async function deleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) console.error('deleteProduct error:', error.message);
  return { error };
}

/**
 * Soft-hide/unhide a product without deleting it.
 */
export async function toggleProductActive(id, isActive) {
  return updateProduct(id, { is_active: isActive });
}
