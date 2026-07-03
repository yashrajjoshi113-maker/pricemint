import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// We load the keys that you provided. 
// Note: In a pure HTML setup without bundler, we initialize it globally.
const SUPABASE_URL = 'https://benzsffnnjfmhbvsllpg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlbnpzZmZubmpmbWhidnNsbHBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwNzQzODUsImV4cCI6MjA5ODY1MDM4NX0.yng58KUJlLCZAJvQmvsFLKyCFoF0Dz0H8OjUkJnT1-E';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Check if logged in on page load
export async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}

export async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });
    return { data, error };
}

export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    return { data, error };
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    return error;
}

// UI Updater for Auth State
export async function updateAuthUI() {
    const session = await checkSession();
    
    // Header Logic across all pages
    const authLinks = document.querySelectorAll('.auth-link');
    if (authLinks) {
        authLinks.forEach(link => {
            if (session) {
                link.innerHTML = `
                    <a href="wishlist.html" class="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                        <span class="text-sm font-semibold text-gray-900 truncate max-w-[100px]">${session.user.email.split('@')[0]}</span>
                    </a>
                `;
            } else {
                link.innerHTML = `<a href="login.html" class="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors">Sign In</a>`;
            }
        });
    }
}
