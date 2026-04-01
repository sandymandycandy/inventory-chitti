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
            <div className="flex items-center justify-center min-h-64">
                <div className="win-window p-4 text-center text-sm">
                    <div className="mb-2">Please wait...</div>
                    <div className="win-panel-sunken p-1 text-xs">Loading analytics data</div>
                </div>
            </div>
        );
    }

    // Check if we have data issues
    if (!dashboardStats) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="win-window p-4 text-center text-sm">
                    <p className="mb-3">Error: Unable to load analytics data</p>
                    <button onClick={fetchAnalyticsData} className="btn btn-primary">Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-fade-in">
            {/* Win2000 Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-bold mb-0">Analytics &amp; Reports</h1>
                    <p className="text-xs">Business performance overview</p>
                </div>
                <div className="flex items-center gap-2">
                    {[7, 14, 30].map(days => (
                        <button
                            key={days}
                            onClick={() => {
                                setDateRange(days);
                                setRefreshing(true);
                                fetchAnalyticsData().then(() => setRefreshing(false));
                            }}
                            className={`btn btn-sm ${dateRange === days ? 'btn-primary' : ''}`}
                        >
                            {days}D
                        </button>
                    ))}
                    <button
                        onClick={() => {
                            setRefreshing(true);
                            fetchAnalyticsData().then(() => setRefreshing(false));
                        }}
                        disabled={refreshing}
                        className="btn btn-sm"
                    >
                        {refreshing ? '...' : 'Refresh'}
                    </button>
                </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="stat-card">
                    <p className="text-xs mb-1">Total Revenue</p>
                    <p className="text-xl font-bold">{formatCurrency(dashboardStats.totalRevenue)}</p>
                    <p className="text-xs mt-1">All time</p>
                </div>
                <div className="stat-card">
                    <p className="text-xs mb-1">Total Orders</p>
                    <p className="text-xl font-bold">{dashboardStats.totalOrders.toLocaleString()}</p>
                    <p className="text-xs mt-1">Processed</p>
                </div>
                <div className="stat-card">
                    <p className="text-xs mb-1">Active Recipes</p>
                    <p className="text-xl font-bold">{dashboardStats.totalRecipes.toLocaleString()}</p>
                    <p className="text-xs mt-1">In catalog</p>
                </div>
                <div className="stat-card">
                    <p className="text-xs mb-1">Avg Order Value</p>
                    <p className="text-xl font-bold">
                        {formatCurrency(dashboardStats.totalOrders > 0 ? dashboardStats.totalRevenue / dashboardStats.totalOrders : 0)}
                    </p>
                    <p className="text-xs mt-1">Per order</p>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Revenue Trend */}
                <div className="win-window p-0">
                    <div className="win-titlebar">Revenue Trend - Last {dateRange} Days</div>
                    <div className="p-4 bg-[#d4d0c8]">
                        <div className="win-panel-sunken p-2 h-64">
                            <Line data={revenueChartData} options={revenueChartOptions} />
                        </div>
                    </div>
                </div>

                {/* Top Products */}
                <div className="win-window p-0">
                    <div className="win-titlebar">Top Selling Products</div>
                    <div className="p-4 bg-[#d4d0c8]">
                        <div className="win-panel-sunken p-2 h-64">
                            {topProducts.length > 0 ? (
                                <Bar data={topProductsChartData} options={topProductsChartOptions} />
                            ) : (
                                <div className="flex items-center justify-center h-full text-xs">No sales data available</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sales by Category */}
                <div className="win-window p-0">
                    <div className="win-titlebar">Sales by Category</div>
                    <div className="p-4 bg-[#d4d0c8]">
                        <div className="win-panel-sunken p-2 h-64 flex items-center justify-center">
                            {salesByCategory.labels.length > 0 ? (
                                <Doughnut data={categoryChartData} options={categoryChartOptions} />
                            ) : (
                                <div className="text-xs">No category data available</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Ingredient Usage */}
                <div className="win-window p-0">
                    <div className="win-titlebar">Ingredient Usage</div>
                    <div className="p-3 bg-[#d4d0c8]">
                        <div className="win-panel-sunken overflow-y-auto" style={{maxHeight: '16rem'}}>
                            {ingredientUsage.length > 0 ? (
                                <table className="table w-full">
                                    <thead>
                                        <tr>
                                            <th>Ingredient</th>
                                            <th>Recipes</th>
                                            <th>Unit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ingredientUsage.map((ingredient, idx) => (
                                            <tr key={idx}>
                                                <td className="font-bold">{ingredient.name}</td>
                                                <td>{ingredient.usageCount}</td>
                                                <td><span className="badge">{ingredient.unit}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-4 text-xs text-center">No ingredient data available</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Performance Table */}
            <div className="win-window p-0">
                <div className="win-titlebar">Product Performance — Top {topProducts.length}</div>
                <div className="p-3 bg-[#d4d0c8]">
                    {topProducts.length > 0 ? (
                        <div className="win-panel-sunken overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Product</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Sold</th>
                                        <th>Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topProducts.map((product, idx) => (
                                        <tr key={idx}>
                                            <td className="font-bold">{idx + 1}</td>
                                            <td className="font-bold">{product.name}</td>
                                            <td><span className="badge badge-info">{product.category}</span></td>
                                            <td>{formatCurrency(product.sellingPrice)}</td>
                                            <td className="font-bold">{product.totalSold}</td>
                                            <td className="font-bold">{formatCurrency(product.revenue)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="win-panel-sunken p-6 text-center text-xs">
                            <p>No product data available</p>
                            <p>Start making sales to see performance metrics</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Analytics;
