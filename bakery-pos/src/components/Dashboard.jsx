import { useState, useEffect } from 'react';
import { analyticsAPI, ingredientsAPI, customersAPI } from '../services/api';

function Dashboard({ onViewChange }) {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalRecipes: 0,
        totalInventory: 0,
        lowStockCount: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [lowStock, setLowStock] = useState([]);
    const [customerStats, setCustomerStats] = useState(null);
    const [profitData, setProfitData] = useState([]);
    const [topCustomers, setTopCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [dashboardRes, ordersRes, lowStockRes, customerStatsRes, profitRes, topCustomersRes] = await Promise.all([
                analyticsAPI.getDashboard(),
                analyticsAPI.getRecentOrders(5),
                ingredientsAPI.getLowStock(),
                analyticsAPI.getCustomerStats(),
                analyticsAPI.getProfitAnalysis(),
                customersAPI.getTopCustomers(5)
            ]);

            setStats(dashboardRes.data);
            setRecentOrders(ordersRes.data);
            setLowStock(lowStockRes.data);
            setCustomerStats(customerStatsRes.data);
            setProfitData(profitRes.data.slice(0, 5)); // Top 5 profitable items
            setTopCustomers(topCustomersRes.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-IN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-14 h-14 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in px-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-slate-500 mt-2 text-base">Welcome back! Here's what's happening with your business today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-slate-900">
                            {new Date().toLocaleDateString('en-IN', { weekday: 'long' })}
                        </p>
                        <p className="text-xs text-slate-500">
                            {new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>
                    <div className="w-10 h-10 bg-white rounded-full border border-slate-200 flex items-center justify-center shadow-sm text-slate-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
                {/* Total Revenue */}
                <div className="stat-card group cursor-default">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3.5 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl ring-1 ring-emerald-200/50">
                            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-slate-500 mb-1.5">Total Revenue</p>
                    <p className="text-3xl font-bold text-slate-900 tracking-tight">{formatCurrency(stats.totalRevenue)}</p>
                    <p className="text-xs text-emerald-600 mt-3 flex items-center gap-1.5 font-medium">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        Track your earnings
                    </p>
                </div>

                {/* Total Orders */}
                <div className="stat-card cursor-default">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3.5 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl ring-1 ring-blue-200/50">
                            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-slate-500 mb-1.5">Total Orders</p>
                    <p className="text-3xl font-bold text-slate-900 tracking-tight">{stats.totalOrders}</p>
                    <p className="text-xs text-slate-500 mt-3 font-medium">All completed orders</p>
                </div>

                {/* Active Recipes */}
                <div className="stat-card cursor-default">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3.5 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl ring-1 ring-purple-200/50">
                            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-slate-500 mb-1.5">Active Recipes</p>
                    <p className="text-3xl font-bold text-slate-900 tracking-tight">{stats.totalRecipes}</p>
                    <p className="text-xs text-slate-500 mt-3 font-medium">Manage your menu</p>
                </div>

                {/* Inventory Items */}
                <div className="stat-card">
                    <div className="flex items-start justify-between mb-3">
                        <div className="p-3 bg-amber-100 rounded-xl">
                            <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Inventory Items</p>
                    <p className="text-2xl font-bold text-dark-900">{stats.totalInventory}</p>
                    <p className={`text-xs mt-2 flex items-center gap-1 ${stats.lowStockCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {stats.lowStockCount > 0 ? (
                            <>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92z" clipRule="evenodd" />
                                </svg>
                                {stats.lowStockCount} low stock
                            </>
                        ) : (
                            'All well stocked'
                        )}
                    </p>
                </div>
            </div>

            {/* Recent Orders & Low Stock */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
                {/* Recent Orders */}
                <div className="card p-7">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-900">Recent Orders</h2>
                        <button onClick={() => onViewChange('bills')} className="text-sm text-sky-600 hover:text-sky-700 font-semibold transition-colors">View All →</button>
                    </div>

                    {recentOrders.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <p className="text-gray-500">No orders yet</p>
                            <p className="text-sm text-gray-400">Create your first order to get started</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentOrders.map(order => (
                                <div
                                    key={order._id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-dark-900">{order.orderNumber}</span>
                                            <span className="badge badge-success">Completed</span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {order.customerName} • {formatDate(order.createdAt)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-dark-900">{formatCurrency(order.total)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Low Stock Alerts */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-dark-900">Low Stock Alerts</h2>
                        <button onClick={() => onViewChange('inventory')} className="text-sm text-primary-600 hover:text-primary-700 font-medium">Manage Stock</button>
                    </div>

                    {lowStock.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-emerald-600 font-semibold">All ingredients well stocked!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {lowStock.map(item => (
                                <div
                                    key={item._id}
                                    className="flex items-center gap-4 p-4 bg-amber-50 border border-amber-200 rounded-lg"
                                >
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-dark-900">{item.name}</p>
                                        <p className="text-sm text-amber-700">
                                            Only {item.currentStock} {item.unit} remaining
                                        </p>
                                    </div>
                                    <button className="btn btn-sm btn-secondary">
                                        Restock
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* New Analytics Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Customer Analytics */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-dark-900">Customer Analytics</h2>
                    </div>

                    {customerStats ? (
                        <div className="space-y-4">
                            <div className="text-center p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg">
                                <p className="text-4xl font-bold text-primary-600">{customerStats.totalCustomers}</p>
                                <p className="text-sm text-primary-700 mt-1">Total Customers</p>
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-dark-700 mb-3">Tier Distribution:</p>
                                <div className="space-y-2">
                                    {Object.entries(customerStats.tierCounts || {}).map(([tier, count]) => (
                                        <div key={tier} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-3 h-3 rounded-full ${tier === 'Gold' ? 'bg-yellow-400' :
                                                    tier === 'Silver' ? 'bg-gray-300' :
                                                        tier === 'Bronze' ? 'bg-orange-400' :
                                                            'bg-blue-400'
                                                    }`}></span>
                                                <span className="text-sm text-dark-900">{tier}</span>
                                            </div>
                                            <span className="font-semibold text-dark-900">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-3 border-t border-gray-200">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Avg Spent:</span>
                                    <span className="font-semibold">{formatCurrency(customerStats.averageSpentPerCustomer || 0)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Avg Orders:</span>
                                    <span className="font-semibold">{(customerStats.averageOrdersPerCustomer || 0).toFixed(1)}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No customer data</p>
                    )}
                </div>

                {/* Profit Margin Widget */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-dark-900">Top Profitable Products</h2>
                    </div>

                    {profitData.length > 0 ? (
                        <div className="space-y-3">
                            {profitData.map((item, index) => (
                                <div key={index} className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-semibold text-dark-900 text-sm">{item.name}</p>
                                        <span className="badge bg-green-100 text-green-700">{item.marginPercent}%</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-600">
                                        <span>Profit: {formatCurrency(item.profit)}</span>
                                        <span>Sold: {item.totalSold}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No sales data yet</p>
                    )}
                </div>

                {/* Top Customers Leaderboard */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-dark-900">Top Customers</h2>
                    </div>

                    {topCustomers.length > 0 ? (
                        <div className="space-y-3">
                            {topCustomers.map((customer, index) => (
                                <div key={customer._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                        index === 1 ? 'bg-gray-200 text-gray-700' :
                                            index === 2 ? 'bg-orange-100 text-orange-700' :
                                                'bg-blue-100 text-blue-700'
                                        }`}>
                                        #{index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-dark-900 text-sm truncate">{customer.name}</p>
                                        <p className="text-xs text-gray-600">{customer.totalOrders} orders</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-dark-900 text-sm">{formatCurrency(customer.totalSpent)}</p>
                                        <p className="text-xs text-gray-600">{customer.tier}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No customers yet</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
