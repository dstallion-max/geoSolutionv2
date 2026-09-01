// auth.js 
// =============================================
// GEO SOLUTION - AUTHENTICATION
// =============================================

// Get user data from session (via API)
export async function getCurrentUser() {
    try {
        const response = await fetch(`${window.BASE_API}/auth/check-session`, {
            credentials: 'include'
        });
        const data = await response.json();
        if (data.valid) {
            return {
                email: data.email,
                role: data.role,
                name: data.name
            };
        }
        return null;
    } catch (err) {
        console.error('Error getting user:', err);
        return null;
    }
}

// Check if user is authenticated
export async function checkAuth() {
    const user = await getCurrentUser();
    if (!user) {
        // Not authenticated, redirect to login
        window.location.href = 'access.html';
        return false;
    }
    return user;
}

// Logout function
export async function logout() {
    try {
        await fetch(`${window.BASE_API}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
    } catch (err) {
        console.error('Logout error:', err);
    }
    localStorage.clear();
    window.location.href = 'access.html';
}

// Check if user is admin
export function isAdmin(user) {
    return user && user.role === 'admin';
}

// Check if user is secretary
export function isSecretary(user) {
    return user && user.role === 'secretary';
}

// Auto-protect pages (call this on protected pages)
export async function protectPage() {
    const user = await checkAuth();
    if (!user) return null;
    
    // Update UI with user info
    const nameEl = document.getElementById('adminName');
    const emailEl = document.getElementById('adminEmail');
    if (nameEl) nameEl.textContent = user.name || user.email.split('@')[0] || 'User';
    if (emailEl) emailEl.textContent = user.email;
    
    return user;
}

// ✅ NEW: Auto-protect with redirect to access page
export async function requireAuth() {
    const user = await getCurrentUser();
    if (!user) {
        window.location.href = 'access.html';
        return null;
    }
    return user;
}

// ✅ NEW: Redirect if already logged in (for access.html)
export async function redirectIfLoggedIn() {
    const user = await getCurrentUser();
    if (user) {
        const dashboard = user.role === 'admin' ? 'admin_dashboard.html' : 'secretary_dashboard.html';
        window.location.href = dashboard;
        return true;
    }
    return false;
}