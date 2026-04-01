import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { analyticsAPI } from '../services/api';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

function Analytics() {
    const [loading, setLoading] = useState(true);
    const [revenueTrend, setRevenueTrend] = useState({ labels: [], data: [] });
    const [topProducts, setTopProducts] = useState([]);
    const [salesByCategory, setSalesByCategory] = useState({ labels: [], data: [] });
    const [ingredientUsage, setIngredientUsage] = useState([]);
    const [dashboardStats, setDashboardStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalRecipes: 0,
        totalInventory: 0
    });
    const [dateRange, setDateRange] = useState(7);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const fetchAnalyticsData = async () => {
        try {
            const [
                dashboardRes,
                revenueRes,
                topProductsRes,
                ingredientUsageRes,
                salesByCategoryRes
            ] = await Promise.all([
                analyticsAPI.getDashboard(),
                analyticsAPI.getRevenueTrend(7),
                analyticsAPI.getTopProducts(5),
                analyticsAPI.getIngredientUsage(),
                analyticsAPI.getSalesByCategory()
            ]);

            setDashboardStats(dashboardRes.data);

            // Revenue trend data
            setRevenueTrend({
                labels: revenueRes.data.map(d => d.date),
                data: revenueRes.data.map(d => d.revenue)
            });

            setTopProducts(topProductsRes.data || []);
            setIngredientUsage(ingredientUsageRes.data || []);

            // Sales by category data
            if (salesByCategoryRes.data && salesByCategoryRes.data.length > 0) {
                setSalesByCategory({
                    labels: salesByCategoryRes.data.map(d => d.category || d._id),
                    data: salesByCategoryRes.data.map(d => d.revenue || d.total)
                });
            }

        } catch (error) {
            console.error('Error fetching analytics:', error);
            alert('Error loading analytics: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null || isNaN(amount)) {
            return '₹0.00';
        }
        return `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    };

    // Chart configurations
    const revenueChartData = {
        labels: revenueTrend.labels,
        datasets: [
            {
                label: 'Revenue',
                data: revenueTrend.data,
                borderColor: '#0ea5e9',
                backgroundColor: 'rgba(14, 165, 233, 0.15)',
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointBackgroundColor: '#0ea5e9',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
            },
        ],
    };

    const revenueChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#0ea5e9',
                borderWidth: 1,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
                ticks: {
                    callback: function (value) {
                        return '₹' + value;
                    },
                    color: '#64748b',
                }
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#64748b',
                }
            }
        }
    };

    const topProductsChartData = {
        labels: topProducts.map(p => p.name),
        datasets: [
            {
                label: 'Total Sold',
                data: topProducts.map(p => p.totalSold),
                backgroundColor: [
                    '#0ea5e9',
                    '#8b5cf6',
                    '#ec4899',
                    '#f59e0b',
                    '#10b981',
                ],
                borderRadius: 8,
                barThickness: 30,
            },
        ],
    };

    const topProductsChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                borderColor: '#0ea5e9',
                borderWidth: 1,
            },
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
                ticks: {
                    color: '#64748b',
                }
            },
            y: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#64748b',
                }
            }
        }
    };

    const categoryChartData = {
        labels: salesByCategory.labels,
        datasets: [
            {
                data: salesByCategory.data,
                backgroundColor: [
                    '#0ea5e9',
                    '#8b5cf6',
                    '#ec4899',
                    '#f59e0b',
                    '#10b981',
                    '#06b6d4',
                    '#f43f5e',
                ],
                borderWidth: 0,
                hoverBorderWidth: 3,
                hoverBorderColor: '#fff',
            },
        ],
    };

    const categoryChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 15,
                    font: {
                        size: 12,
                    },
                    color: '#64748b',
                    usePointStyle: true,
                    pointStyle: 'circle',
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                borderColor: '#0ea5e9',
                borderWidth: 1,
                callbacks: {
                    label: function(context) {
                        return context.label + ': ₹' + context.parsed.toLocaleString('en-IN');
                    }
                }
            },
        },
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-purple-600 rounded-full animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '1s'}}></div>
                    </div>
                    <p className="text-gray-600 font-medium">Loading analytics...</p>
                    <p className="text-sm text-gray-400 mt-1">Analyzing your data</p>
                </div>
            </div>
        );
    }

    // Check if we have data issues
    if (!dashboardStats) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-600">Error: Unable to load analytics data</p>
                    <button onClick={fetchAnalyticsData} className="mt-4 btn btn-primary">Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Modern Header with Gradient */}
            <div className="relative overflow-hidden bg-gradient-to-br from-sky-500 via-blue-600 to-purple-600 rounded-3xl shadow-2xl">
                <div className="absolute inset-0 bg-grid-white/10"></div>
                <div className="relative px-8 py-10">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h1 className="text-4xl font-bold text-white">Analytics & Reports</h1>
                            </div>
                            <p className="text-sky-100 text-lg">Comprehensive insights into your bakery's performance</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            {/* Date Range Filter */}
                            <div className="flex bg-white/20 backdrop-blur-md rounded-2xl p-1 gap-1">
                                {[7, 14, 30].map(days => (
                                    <button
                                        key={days}
                                        onClick={() => {
                                            setDateRange(days);
                                            setRefreshing(true);
                                            fetchAnalyticsData().then(() => setRefreshing(false));
                                        }}
                                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                                            dateRange === days
                                                ? 'bg-white text-sky-600 shadow-lg'
                                                : 'text-white hover:bg-white/10'
                                        }`}
                                    >
                                        {days}D
                                    </button>
                                ))}
                            </div>
                            
                            {/* Refresh Button */}
                            <button
                                onClick={() => {
                                    setRefreshing(true);
                                    fetchAnalyticsData().then(() => setRefreshing(false));
                                }}
                                disabled={refreshing}
                                className="px-5 py-3 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-medium rounded-2xl transition-all duration-300 flex items-center gap-2 hover:scale-105 active:scale-95 disabled:opacity-50"
                            >
                                <svg className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Revenue */}
                <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    <div className="relative p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg">
                                <span className="text-xs text-white font-medium">💰</span>
                            </div>
                        </div>
                        <p className="text-sm text-green-100 font-medium mb-1">Total Revenue</p>
                        <p className="text-3xl font-bold text-white">{formatCurrency(dashboardStats.totalRevenue)}</p>
                        <div className="mt-3 flex items-center gap-2 text-green-100">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs">All time</span>
                        </div>
                    </div>
                </div>

                {/* Total Orders */}
                <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-sky-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    <div className="relative p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                </svg>
                            </div>
                            <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg">
                                <span className="text-xs text-white font-medium">🛒</span>
                            </div>
                        </div>
                        <p className="text-sm text-blue-100 font-medium mb-1">Total Orders</p>
                        <p className="text-3xl font-bold text-white">{dashboardStats.totalOrders.toLocaleString()}</p>
                        <div className="mt-3 flex items-center gap-2 text-blue-100">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            <span className="text-xs">Orders processed</span>
                        </div>
                    </div>
                </div>

                {/* Active Recipes */}
                <div className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    <div className="relative p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                </svg>
                            </div>
                            <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg">
                                <span className="text-xs text-white font-medium">📖</span>
                            </div>
                        </div>
                        <p className="text-sm text-purple-100 font-medium mb-1">Active Recipes</p>
                        <p className="text-3xl font-bold text-white">{dashboardStats.totalRecipes.toLocaleString()}</p>
                        <div className="mt-3 flex items-center gap-2 text-purple-100">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs">In catalog</span>
                        </div>
                    </div>
                </div>

                {/* Avg Order Value */}
                <div className="group relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    <div className="relative p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg">
                                <span className="text-xs text-white font-medium">📊</span>
                            </div>
                        </div>
                        <p className="text-sm text-amber-100 font-medium mb-1">Avg Order Value</p>
                        <p className="text-3xl font-bold text-white">
                            {formatCurrency(dashboardStats.totalOrders > 0 ? dashboardStats.totalRevenue / dashboardStats.totalOrders : 0)}
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-amber-100">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs">Per order</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend */}
                <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Revenue Trend</h3>
                            <p className="text-sm text-slate-500 mt-1">Last {dateRange} days performance</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-sky-100 to-blue-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                            </svg>
                        </div>
                    </div>
                    <div className="h-72">
                        <Line data={revenueChartData} options={revenueChartOptions} />
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Top Selling Products</h3>
                            <p className="text-sm text-slate-500 mt-1">Best performers this period</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-violet-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                    </div>
                    <div className="h-72">
                        {topProducts.length > 0 ? (
                            <Bar data={topProductsChartData} options={topProductsChartOptions} />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <svg className="w-16 h-16 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                <p>No sales data available</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sales by Category */}
                <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Sales by Category</h3>
                            <p className="text-sm text-slate-500 mt-1">Revenue distribution</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                            </svg>
                        </div>
                    </div>
                    <div className="h-72 flex items-center justify-center">
                        {salesByCategory.labels.length > 0 ? (
                            <Doughnut data={categoryChartData} options={categoryChartOptions} />
                        ) : (
                            <div className="flex flex-col items-center text-gray-400">
                                <svg className="w-16 h-16 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                </svg>
                                <p>No category data available</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Ingredient Usage */}
                <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Ingredient Usage</h3>
                            <p className="text-sm text-slate-500 mt-1">Most used ingredients</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                    </div>
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                        {ingredientUsage.length > 0 ? (
                            ingredientUsage.map((ingredient, idx) => (
                                <div key={idx} className="group flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-transparent rounded-xl hover:from-sky-50 transition-all duration-300 border border-slate-100 hover:border-sky-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-sky-100 group-hover:to-blue-100 rounded-lg flex items-center justify-center transition-colors duration-300">
                                            <span className="text-lg">📦</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">{ingredient.name}</p>
                                            <p className="text-sm text-slate-500">Used in {ingredient.usageCount} recipes</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-sky-100 text-sky-700 text-xs font-semibold rounded-lg">{ingredient.unit}</span>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                                <svg className="w-16 h-16 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                <p>No ingredient data available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Enhanced Product Performance Table */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900">Product Performance</h3>
                        <p className="text-sm text-slate-500 mt-1">Detailed sales breakdown</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl border border-sky-200">
                        <svg className="w-5 h-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm font-semibold text-sky-700">Top {topProducts.length}</span>
                    </div>
                </div>
                {topProducts.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-slate-200">
                                    <th className="text-left py-4 px-4 text-sm font-bold text-slate-700 uppercase tracking-wider">Rank</th>
                                    <th className="text-left py-4 px-4 text-sm font-bold text-slate-700 uppercase tracking-wider">Product</th>
                                    <th className="text-left py-4 px-4 text-sm font-bold text-slate-700 uppercase tracking-wider">Category</th>
                                    <th className="text-right py-4 px-4 text-sm font-bold text-slate-700 uppercase tracking-wider">Price</th>
                                    <th className="text-right py-4 px-4 text-sm font-bold text-slate-700 uppercase tracking-wider">Sold</th>
                                    <th className="text-right py-4 px-4 text-sm font-bold text-slate-700 uppercase tracking-wider">Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topProducts.map((product, idx) => (
                                    <tr key={idx} className="border-b border-slate-100 hover:bg-gradient-to-r hover:from-sky-50/50 hover:to-transparent transition-all duration-200 group">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-sky-100 to-blue-100 group-hover:from-sky-200 group-hover:to-blue-200 transition-colors duration-200">
                                                <span className="text-sm font-bold text-sky-700">#{idx + 1}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                                                    <span className="text-lg">🧁</span>
                                                </div>
                                                <span className="font-semibold text-slate-900">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="px-3 py-1 bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700 text-xs font-semibold rounded-lg">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right font-medium text-slate-700">{formatCurrency(product.sellingPrice)}</td>
                                        <td className="py-4 px-4 text-right">
                                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-semibold rounded-lg">
                                                {product.totalSold}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right font-bold text-emerald-600 text-lg">
                                            {formatCurrency(product.revenue)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                        <svg className="w-20 h-20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <p className="text-lg font-medium">No product data available</p>
                        <p className="text-sm mt-1">Start making sales to see performance metrics</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Analytics;
