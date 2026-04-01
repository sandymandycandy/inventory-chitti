import { useState, useEffect } from 'react';
import { analyticsAPI, ingredientsAPI, customersAPI } from '../services/api';

// Windows 2000 style panel
function WinPanel({ title, children, style = {} }) {
    return (
        <div style={{
            backgroundColor: '#d4d0c8',
            borderTop: '2px solid #ffffff',
            borderLeft: '2px solid #ffffff',
            borderRight: '2px solid #404040',
            borderBottom: '2px solid #404040',
            boxShadow: '1px 1px 0 #808080',
            ...style,
        }}>
            {title && (
                <div style={{
                    backgroundColor: '#000080',
                    color: '#ffffff',
                    padding: '3px 8px',
                    fontSize: '11px',
                    fontWeight: '700',
                    fontFamily: 'Tahoma, sans-serif',
                }}>
                    {title}
                </div>
            )}
            <div style={{ padding: '8px' }}>
                {children}
            </div>
        </div>
    );
}

// Win2000 stat card
function StatCard({ label, value, icon, color = '#000080' }) {
    return (
        <div style={{
            backgroundColor: '#d4d0c8',
            borderTop: '2px solid #ffffff',
            borderLeft: '2px solid #ffffff',
            borderRight: '2px solid #404040',
            borderBottom: '2px solid #404040',
            boxShadow: '1px 1px 0 #808080',
            padding: '8px',
            fontFamily: 'Tahoma, sans-serif',
        }}>
            {/* Sunken inner display */}
            <div style={{
                backgroundColor: '#ffffff',
                borderTop: '1px solid #808080',
                borderLeft: '1px solid #808080',
                borderRight: '1px solid #ffffff',
                borderBottom: '1px solid #ffffff',
                boxShadow: 'inset 1px 1px 0 #404040',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '6px',
            }}>
                <span style={{ fontSize: '20px' }}>{icon}</span>
                <div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: color, lineHeight: 1.2 }}>{value}</div>
                </div>
            </div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#000000' }}>{label}</div>
        </div>
    );
}

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
            setProfitData(profitRes.data.slice(0, 5));
            setTopCustomers(topCustomersRes.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '300px',
                fontFamily: 'Tahoma, sans-serif',
                fontSize: '11px',
            }}>
                <div style={{
                    backgroundColor: '#d4d0c8',
                    borderTop: '2px solid #ffffff',
                    borderLeft: '2px solid #ffffff',
                    borderRight: '2px solid #404040',
                    borderBottom: '2px solid #404040',
                    padding: '20px 28px',
                    textAlign: 'center',
                    boxShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                }}>
                    <div style={{ marginBottom: '8px', fontWeight: '700' }}>Loading Dashboard...</div>
                    <div style={{
                        width: '200px',
                        height: '18px',
                        backgroundColor: '#ffffff',
                        borderTop: '1px solid #808080',
                        borderLeft: '1px solid #808080',
                        borderRight: '1px solid #ffffff',
                        borderBottom: '1px solid #ffffff',
                        overflow: 'hidden',
                        boxShadow: 'inset 1px 1px 0 #404040',
                    }}>
                        <div style={{
                            width: '70%',
                            height: '100%',
                            backgroundColor: '#000080',
                            backgroundImage: 'repeating-linear-gradient(90deg, #000080 0px, #000080 10px, #1060b0 10px, #1060b0 14px)',
                        }} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ fontFamily: 'Tahoma, sans-serif', fontSize: '11px', color: '#000000' }}>
            {/* Header */}
            <div style={{
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
            }}>
                <div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#000080' }}>
                        📊 Dashboard
                    </div>
                    <div style={{ fontSize: '11px', color: '#444444' }}>
                        {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
                <button
                    onClick={fetchDashboardData}
                    style={{
                        backgroundColor: '#d4d0c8',
                        borderTop: '2px solid #ffffff',
                        borderLeft: '2px solid #ffffff',
                        borderRight: '2px solid #404040',
                        borderBottom: '2px solid #404040',
                        padding: '3px 10px',
                        fontSize: '11px',
                        fontFamily: 'Tahoma, sans-serif',
                        cursor: 'pointer',
                        boxShadow: '1px 1px 0 #808080',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                    }}
                >
                    🔄 Refresh
                </button>
            </div>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '6px',
                marginBottom: '10px',
            }}>
                <StatCard label="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon="💰" color="#006000" />
                <StatCard label="Total Orders" value={stats.totalOrders} icon="🛍️" color="#000080" />
                <StatCard label="Active Recipes" value={stats.totalRecipes} icon="📖" color="#800080" />
                <StatCard
                    label={`Inventory${stats.lowStockCount > 0 ? ` (${stats.lowStockCount} low!)` : ''}`}
                    value={stats.totalInventory}
                    icon="📦"
                    color={stats.lowStockCount > 0 ? '#c00000' : '#000080'}
                />
            </div>

            {/* Main content row */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '6px',
                marginBottom: '8px',
            }}>
                {/* Recent Orders */}
                <WinPanel title="📋 Recent Orders">
                    {recentOrders.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '20px 0', color: '#808080' }}>
                            No orders yet.
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#d4d0c8' }}>
                                    <th style={{
                                        padding: '3px 6px',
                                        borderTop: '1px solid #ffffff',
                                        borderLeft: '1px solid #ffffff',
                                        borderRight: '1px solid #808080',
                                        borderBottom: '1px solid #808080',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        textAlign: 'left',
                                        background: 'linear-gradient(to bottom, #e8e6e0, #d4d0c8)',
                                    }}>Order #</th>
                                    <th style={{
                                        padding: '3px 6px',
                                        borderTop: '1px solid #ffffff',
                                        borderLeft: '1px solid #ffffff',
                                        borderRight: '1px solid #808080',
                                        borderBottom: '1px solid #808080',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        textAlign: 'left',
                                        background: 'linear-gradient(to bottom, #e8e6e0, #d4d0c8)',
                                    }}>Customer</th>
                                    <th style={{
                                        padding: '3px 6px',
                                        borderTop: '1px solid #ffffff',
                                        borderLeft: '1px solid #ffffff',
                                        borderRight: '1px solid #808080',
                                        borderBottom: '1px solid #808080',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        textAlign: 'right',
                                        background: 'linear-gradient(to bottom, #e8e6e0, #d4d0c8)',
                                    }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order, i) => (
                                    <tr
                                        key={order._id}
                                        style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f0f0f0', cursor: 'default' }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#000080';
                                            Array.from(e.currentTarget.cells).forEach(c => c.style.color = '#ffffff');
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = i % 2 === 0 ? '#ffffff' : '#f0f0f0';
                                            Array.from(e.currentTarget.cells).forEach(c => c.style.color = '#000000');
                                        }}
                                    >
                                        <td style={{ padding: '2px 6px', borderBottom: '1px solid #e0dcd0', fontSize: '11px' }}>
                                            {order.orderNumber}
                                        </td>
                                        <td style={{ padding: '2px 6px', borderBottom: '1px solid #e0dcd0', fontSize: '11px' }}>
                                            {order.customerName}
                                        </td>
                                        <td style={{ padding: '2px 6px', borderBottom: '1px solid #e0dcd0', fontSize: '11px', textAlign: 'right', fontWeight: '700' }}>
                                            {formatCurrency(order.total)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <div style={{ marginTop: '6px', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            onClick={() => onViewChange('bills')}
                            style={{
                                backgroundColor: '#d4d0c8',
                                borderTop: '2px solid #ffffff',
                                borderLeft: '2px solid #ffffff',
                                borderRight: '2px solid #404040',
                                borderBottom: '2px solid #404040',
                                padding: '3px 10px',
                                fontSize: '11px',
                                fontFamily: 'Tahoma, sans-serif',
                                cursor: 'pointer',
                                boxShadow: '1px 1px 0 #808080',
                            }}
                        >
                            View All Bills...
                        </button>
                    </div>
                </WinPanel>

                {/* Low Stock Alerts */}
                <WinPanel title="⚠️ Low Stock Alerts">
                    {lowStock.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <div style={{ color: '#006000', fontWeight: '700', fontSize: '11px' }}>
                                ✔ All ingredients well stocked!
                            </div>
                        </div>
                    ) : (
                        <div>
                            {lowStock.map((item, i) => (
                                <div key={item._id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '3px 6px',
                                    backgroundColor: i % 2 === 0 ? '#fff8e0' : '#fff0c0',
                                    borderBottom: '1px solid #e0d8a0',
                                    fontSize: '11px',
                                }}>
                                    <span>⚠️ {item.name}</span>
                                    <span style={{ color: '#c00000', fontWeight: '700' }}>
                                        {item.currentStock} {item.unit}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                    <div style={{ marginTop: '6px', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            onClick={() => onViewChange('inventory')}
                            style={{
                                backgroundColor: '#d4d0c8',
                                borderTop: '2px solid #ffffff',
                                borderLeft: '2px solid #ffffff',
                                borderRight: '2px solid #404040',
                                borderBottom: '2px solid #404040',
                                padding: '3px 10px',
                                fontSize: '11px',
                                fontFamily: 'Tahoma, sans-serif',
                                cursor: 'pointer',
                                boxShadow: '1px 1px 0 #808080',
                            }}
                        >
                            Manage Stock...
                        </button>
                    </div>
                </WinPanel>
            </div>

            {/* Second row */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '6px',
            }}>
                {/* Customer Analytics */}
                <WinPanel title="👥 Customer Analytics">
                    {customerStats ? (
                        <div>
                            <div style={{
                                backgroundColor: '#ffffff',
                                borderTop: '1px solid #808080',
                                borderLeft: '1px solid #808080',
                                borderRight: '1px solid #ffffff',
                                borderBottom: '1px solid #ffffff',
                                boxShadow: 'inset 1px 1px 0 #404040',
                                padding: '6px',
                                textAlign: 'center',
                                marginBottom: '8px',
                            }}>
                                <div style={{ fontSize: '22px', fontWeight: '700', color: '#000080' }}>
                                    {customerStats.totalCustomers}
                                </div>
                                <div style={{ fontSize: '11px', color: '#444444' }}>Total Customers</div>
                            </div>
                            <div style={{ borderTop: '1px solid #808080', borderBottom: '1px solid #ffffff', marginBottom: '6px' }} />
                            {Object.entries(customerStats.tierCounts || {}).map(([tier, count]) => (
                                <div key={tier} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '2px 4px',
                                    fontSize: '11px',
                                    borderBottom: '1px solid #e0dcd0',
                                }}>
                                    <span>
                                        {tier === 'Gold' ? '🥇' : tier === 'Silver' ? '🥈' : tier === 'Bronze' ? '🥉' : '◆'} {tier}
                                    </span>
                                    <strong>{count}</strong>
                                </div>
                            ))}
                            <div style={{ borderTop: '1px solid #808080', borderBottom: '1px solid #ffffff', margin: '6px 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '2px 0' }}>
                                <span>Avg Spent:</span>
                                <strong>{formatCurrency(customerStats.averageSpentPerCustomer || 0)}</strong>
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '20px 0', color: '#808080' }}>No customer data</div>
                    )}
                </WinPanel>

                {/* Top Profitable Products */}
                <WinPanel title="💹 Top Profitable Products">
                    {profitData.length > 0 ? (
                        <div>
                            {profitData.map((item, index) => (
                                <div key={index} style={{
                                    padding: '3px 6px',
                                    backgroundColor: index % 2 === 0 ? '#f0fff0' : '#e8f8e8',
                                    borderBottom: '1px solid #c0d8c0',
                                    fontSize: '11px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}>
                                    <span style={{ fontWeight: '700', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {item.name}
                                    </span>
                                    <span style={{
                                        backgroundColor: '#006000',
                                        color: '#ffffff',
                                        padding: '1px 4px',
                                        fontSize: '10px',
                                        marginLeft: '4px',
                                        flexShrink: 0,
                                    }}>
                                        {item.marginPercent}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '20px 0', color: '#808080' }}>No sales data yet</div>
                    )}
                </WinPanel>

                {/* Top Customers */}
                <WinPanel title="🏆 Top Customers">
                    {topCustomers.length > 0 ? (
                        <div>
                            {topCustomers.map((customer, index) => (
                                <div key={customer._id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '3px 6px',
                                    backgroundColor: index % 2 === 0 ? '#f0f4ff' : '#e8eeff',
                                    borderBottom: '1px solid #c0c8e0',
                                    fontSize: '11px',
                                }}>
                                    <span style={{
                                        backgroundColor: index === 0 ? '#c8a000' : index === 1 ? '#808080' : '#c06000',
                                        color: '#ffffff',
                                        padding: '1px 4px',
                                        fontSize: '10px',
                                        fontWeight: '700',
                                        flexShrink: 0,
                                        minWidth: '22px',
                                        textAlign: 'center',
                                    }}>
                                        #{index + 1}
                                    </span>
                                    <span style={{ flex: 1, fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {customer.name}
                                    </span>
                                    <span style={{ fontWeight: '700', flexShrink: 0 }}>
                                        {formatCurrency(customer.totalSpent)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '20px 0', color: '#808080' }}>No customers yet</div>
                    )}
                </WinPanel>
            </div>
        </div>
    );
}

export default Dashboard;
