/**
 * auth.js
 * Handles Supabase authentication (sign up, sign in, sign out),
 * session management, and header UI updates across all pages.
 *
 * Usage: <script type="module" src="auth.js"></script>
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// ---------------------------------------------------------------------------
// Supabase Client Setup
// ---------------------------------------------------------------------------
// NOTE: The Supabase "anon" key is safe to expose in client-side code.
// It is designed to be public — real security is enforced via
// Row Level Security (RLS) policies on your Supabase tables, not by
// hiding this key. Do NOT put your "service_role" key here — that one
// must stay on a server and never reach the browser.
const SUPABASE_URL = 'https://benzsffnnjfmhbvsllpg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlbnpzZmZubmpmbWhidnNsbHBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwNzQzODUsImV4cCI6MjA5ODY1MDM4NX0.yng58KUJlLCZAJvQmvsFLKyCFoF0Dz0H8OjUkJnT1-E';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---------------------------------------------------------------------------
// Session Helpers
// ---------------------------------------------------------------------------

/**
 * Returns the current session, or null if not logged in.
 */
export async function checkSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('checkSession error:', error.message);
      return null;
    }
    return session;
  } catch (err) {
    console.error('checkSession unexpected error:', err);
    return null;
  }
}

/**
 * Sign up a new user with email + password.
 * Returns { data, error } — always check `error` before assuming success.
 */
export async function signUp(email, password) {
  if (!email || !password) {
    return { data: null, error: { message: 'Email and password are required.' } };
  }
  if (password.length < 6) {
    return { data: null, error: { message: 'Password must be at least 6 characters.' } };
  }

  const { data, error } = await supabase.auth.signUp({ email, password });
  return { data, error };
}

/**
 * Sign in an existing user with email + password.
 */
export async function signIn(email, password) {
  if (!email || !password) {
    return { data: null, error: { message: 'Email and password are required.' } };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

/**
 * Sign out the current user.
 * Returns error (null on success).
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (!error) {
    // Refresh header UI immediately after logout
    await updateAuthUI();
    // Redirect to home after logout (optional — remove if not needed)
    window.location.href = 'index.html';
  }
  return error;
}

// ---------------------------------------------------------------------------
// UI Updater — Header Auth State (used on every page)
// ---------------------------------------------------------------------------

/**
 * Updates all elements with class `.auth-link` based on login state.
 * Call this on every page load (see auto-init below).
 */
export async function updateAuthUI() {
  const session = await checkSession();
  const authLinks = document.querySelectorAll('.auth-link');

  authLinks.forEach((link) => {
    if (session) {
      const username = session.user.email.split('@')[0];
      link.innerHTML = `
        <div class="relative group">
          <a href="wishlist.html" class="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <span class="text-sm font-semibold text-gray-900 truncate max-w-[100px]">${escapeHtml(username)}</span>
          </a>
        </div>
      `;
    } else {
      link.innerHTML = `
        <a href="login.html" class="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors">
          Sign In
        </a>
      `;
    }
  });
}

/**
 * Minimal HTML-escaping to avoid injecting raw email content into innerHTML.
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ---------------------------------------------------------------------------
// Auto-init: run on every page that imports this file
// ---------------------------------------------------------------------------

// Update header UI as soon as DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateAuthUI);
} else {
  updateAuthUI();
}

// Keep UI in sync live — e.g. if user logs in/out in another tab,
// or session refreshes/expires
supabase.auth.onAuthStateChange((_event, _session) => {
  updateAuthUI();
});
