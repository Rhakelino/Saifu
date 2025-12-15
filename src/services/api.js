// API Base URL
const API_BASE = 'http://localhost:3001/api';

// User ID storage - set this when user logs in
let currentUserId = null;

// Set the current user ID (called from AuthContext when user logs in)
export function setCurrentUserId(userId) {
    currentUserId = userId;
}

// Get current user ID
export function getCurrentUserId() {
    return currentUserId;
}

// Helper function for API requests with credentials
async function fetchAPI(endpoint, options = {}) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        credentials: 'include', // Important for auth cookies
        ...options,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || 'Request failed');
    }

    return response.json();
}

// ============ USERS ============
export const usersAPI = {
    getAll: () => fetchAPI('/users'),
    getById: (id) => fetchAPI(`/users/${id}`),
    create: (data) => fetchAPI('/users', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => fetchAPI(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => fetchAPI(`/users/${id}`, { method: 'DELETE' }),
};

// ============ WALLETS ============
export const walletsAPI = {
    getAll: (userId = getCurrentUserId()) => fetchAPI(`/wallets?userId=${userId}`),
    getById: (id) => fetchAPI(`/wallets/${id}`),
    create: (data) => fetchAPI('/wallets', {
        method: 'POST',
        body: JSON.stringify({ ...data, userId: getCurrentUserId() })
    }),
    update: (id, data) => fetchAPI(`/wallets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => fetchAPI(`/wallets/${id}`, { method: 'DELETE' }),
};

// ============ CATEGORIES ============
export const categoriesAPI = {
    getAll: (userId = getCurrentUserId(), type = null) => {
        let url = `/categories?userId=${userId}`;
        if (type) url += `&type=${type}`;
        return fetchAPI(url);
    },
    create: (data) => fetchAPI('/categories', {
        method: 'POST',
        body: JSON.stringify({ ...data, userId: getCurrentUserId() })
    }),
    update: (id, data) => fetchAPI(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => fetchAPI(`/categories/${id}`, { method: 'DELETE' }),
};

// ============ TRANSACTIONS ============
export const transactionsAPI = {
    getAll: (filters = {}) => {
        const params = new URLSearchParams({ userId: getCurrentUserId() });
        if (filters.walletId) params.append('walletId', filters.walletId);
        if (filters.categoryId) params.append('categoryId', filters.categoryId);
        if (filters.type) params.append('type', filters.type);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.limit) params.append('limit', filters.limit);
        if (filters.offset) params.append('offset', filters.offset);
        return fetchAPI(`/transactions?${params.toString()}`);
    },
    getById: (id) => fetchAPI(`/transactions/${id}`),
    create: (data) => fetchAPI('/transactions', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => fetchAPI(`/transactions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => fetchAPI(`/transactions/${id}`, { method: 'DELETE' }),
};

// ============ STATS ============
export const statsAPI = {
    getDashboard: (startDate = null, endDate = null) => {
        let url = `/stats?userId=${getCurrentUserId()}`;
        if (startDate) url += `&startDate=${startDate}`;
        if (endDate) url += `&endDate=${endDate}`;
        return fetchAPI(url);
    },
};

// Export all
export default {
    users: usersAPI,
    wallets: walletsAPI,
    categories: categoriesAPI,
    transactions: transactionsAPI,
    stats: statsAPI,
    getCurrentUserId,
    setCurrentUserId,
};
