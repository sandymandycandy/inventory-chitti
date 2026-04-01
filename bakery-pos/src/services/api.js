import axios from 'axios';

// Use the current host for API calls (works for both localhost and network access)
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api'
    : `http://${window.location.hostname}:5000/api`;

console.log('🔧 API Base URL:', API_BASE_URL);
console.log('🌐 Current hostname:', window.location.hostname);

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Ingredients
export const ingredientsAPI = {
    getAll: () => api.get('/ingredients'),
    getById: (id) => api.get(`/ingredients/${id}`),
    create: (data) => api.post('/ingredients', data),
    update: (id, data) => api.put(`/ingredients/${id}`, data),
    updateStock: (id, quantity, operation) => api.patch(`/ingredients/${id}/stock`, { quantity, operation }),
    delete: (id) => api.delete(`/ingredients/${id}`),
    getLowStock: () => api.get('/ingredients/status/low-stock')
};

// Recipes
export const recipesAPI = {
    getAll: () => api.get('/recipes'),
    getById: (id) => api.get(`/recipes/${id}`),
    create: (data) => api.post('/recipes', data),
    update: (id, data) => api.put(`/recipes/${id}`, data),
    delete: (id) => api.delete(`/recipes/${id}`),
    canMake: (id, quantity) => api.get(`/recipes/${id}/can-make?quantity=${quantity}`),
    getTopSelling: (limit = 5) => api.get(`/recipes/analytics/top-selling?limit=${limit}`)
};

// Orders
export const ordersAPI = {
    getAll: (params) => api.get('/orders', { params }),
    getById: (id) => api.get(`/orders/${id}`),
    create: (data) => api.post('/orders', data),
    updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
    delete: (id) => api.delete(`/orders/${id}`)
};

// Bills
export const billsAPI = {
    getAll: (params) => api.get('/bills', { params }),
    getById: (id) => api.get(`/bills/${id}`),
    getByBillNumber: (billNumber) => api.get(`/bills/number/${billNumber}`),
    delete: (id) => api.delete(`/bills/${id}`)
};

// Analytics
export const analyticsAPI = {
    getDashboard: () => api.get('/analytics/dashboard'),
    getRevenueTrend: (days = 7) => api.get(`/analytics/revenue-trend?days=${days}`),
    getRecentOrders: (limit = 10) => api.get(`/analytics/recent-orders?limit=${limit}`),
    getCustomerStats: () => api.get('/analytics/customer-stats'),
    getProfitAnalysis: () => api.get('/analytics/profit-analysis'),
    getLoyaltyEffectiveness: () => api.get('/analytics/loyalty-effectiveness'),
    getTopProducts: (limit = 5) => api.get(`/analytics/top-products?limit=${limit}`),
    getIngredientUsage: () => api.get('/analytics/ingredient-usage'),
    getSalesByCategory: () => api.get('/analytics/sales-by-category'),
    // Expense & Profit Analytics
    getExpenseSummary: () => api.get('/analytics/expenses/summary'),
    getExpenseTrend: (days = 30) => api.get(`/analytics/expenses/trend?days=${days}`),
    getProfitAnalysisComplete: () => api.get('/analytics/profit-analysis'),
    getExpenseBySupplier: () => api.get('/analytics/expenses/by-supplier')
};

// Customers
export const customersAPI = {
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return api.get(`/customers${query ? `?${query}` : ''}`);
    },
    getById: (id) => api.get(`/customers/${id}`),
    getByPhone: (phone) => api.get(`/customers/phone/${phone}`),
    create: (data) => api.post('/customers', data),
    update: (id, data) => api.put(`/customers/${id}`, data),
    delete: (id) => api.delete(`/customers/${id}`),
    addPoints: (id, amount) => api.post(`/customers/${id}/points/add`, { amount }),
    redeemPoints: (id, points) => api.post(`/customers/${id}/points/redeem`, { points }),
    getTopCustomers: (limit = 10) => api.get(`/customers/analytics/top?limit=${limit}`)
};

// Categories
export const categoriesAPI = {
    getAll: () => api.get('/categories'),
    getById: (id) => api.get(`/categories/${id}`),
    create: (data) => api.post('/categories', data),
    update: (id, data) => api.put(`/categories/${id}`, data),
    delete: (id) => api.delete(`/categories/${id}`)
};

// Purchase Bills
export const purchaseBillsAPI = {
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return api.get(`/purchase-bills${query ? `?${query}` : ''}`);
    },
    getById: (id) => api.get(`/purchase-bills/${id}`),
    create: (data) => api.post('/purchase-bills', data),
    update: (id, data) => api.put(`/purchase-bills/${id}`, data),
    delete: (id) => api.delete(`/purchase-bills/${id}`),
    updateStock: (id) => api.post(`/purchase-bills/${id}/update-stock`),
    getStats: () => api.get('/purchase-bills/stats/summary')
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;
