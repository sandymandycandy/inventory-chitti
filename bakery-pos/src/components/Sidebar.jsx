import { useState } from 'react';

function Sidebar({ currentView, onViewChange, user, onLogout, onCollapse }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleToggleCollapse = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        if (onCollapse) {
            onCollapse(newState);
        }
    };

    // Windows 2000 icon characters (using simple unicode/text)
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '🏠', roles: ['admin', 'cashier'] },
        { id: 'recipes', label: 'Recipes', icon: '📖', roles: ['admin', 'cashier'] },
        { id: 'pricing', label: 'Product Pricing', icon: '💰', roles: ['admin'] },
        { id: 'categories', label: 'Categories', icon: '🏷️', roles: ['admin', 'cashier'] },
        { id: 'inventory', label: 'Inventory', icon: '📦', roles: ['admin', 'cashier'] },
        { id: 'purchases', label: 'Purchases', icon: '🛒', roles: ['admin', 'cashier'] },
        { id: 'orders', label: 'Orders', icon: '🛍️', roles: ['admin', 'cashier'] },
        { id: 'customers', label: 'Customers', icon: '👥', roles: ['admin', 'cashier'] },
        { id: 'bills', label: 'Bills', icon: '🧾', roles: ['admin', 'cashier'] },
        { id: 'analytics', label: 'Analytics', icon: '📊', roles: ['admin', 'cashier'] },
        { id: 'users', label: 'User Management', icon: '👤', roles: ['admin'] },
    ];

    const filteredMenuItems = menuItems.filter(item =>
        item.roles.includes(user?.role || 'cashier')
    );

    const handleMenuClick = (viewId) => {
        onViewChange(viewId);
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            {/* Mobile Menu Button - Win2000 Taskbar Style */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed top-1 left-1 z-50"
                style={{
                    background: 'linear-gradient(to bottom, #d4d0c8, #b0aca4)',
                    borderTop: '2px solid #ffffff',
                    borderLeft: '2px solid #ffffff',
                    borderRight: '2px solid #404040',
                    borderBottom: '2px solid #404040',
                    padding: '4px 8px',
                    fontSize: '11px',
                    fontFamily: 'Tahoma, sans-serif',
                    fontWeight: '700',
                    color: '#000000',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                }}
            >
                <span>☰</span>
                <span>Menu</span>
            </button>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40"
                    style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar - Windows Explorer Left Panel */}
            <nav
                className={`fixed left-0 top-0 bottom-0 flex flex-col z-50 ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
                style={{
                    width: isCollapsed ? '44px' : '200px',
                    transition: 'width 0.1s ease, transform 0.1s ease',
                    backgroundColor: '#d4d0c8',
                    borderRight: '2px solid #404040',
                    borderTop: '0',
                    boxShadow: '2px 0 0 #808080',
                }}
            >
                {/* Titlebar */}
                <div
                    className="win-titlebar"
                    style={{ minHeight: '24px', flexShrink: 0 }}
                >
                    {/* Windows Icon */}
                    <span style={{ fontSize: '12px' }}>🪟</span>
                    {!isCollapsed && (
                        <span style={{ flex: 1, fontSize: '11px', fontWeight: '700' }}>
                            Tins &amp; Trays
                        </span>
                    )}
                    {/* Title bar buttons */}
                    <div style={{ display: 'flex', gap: '2px', marginLeft: 'auto' }}>
                        <button
                            onClick={handleToggleCollapse}
                            className="hidden lg:flex win-title-btn"
                            title={isCollapsed ? 'Restore' : 'Minimize'}
                            style={{ fontSize: '9px', fontWeight: '700' }}
                        >
                            {isCollapsed ? '□' : '—'}
                        </button>
                    </div>
                </div>

                {/* Logo Area - Windows Panel */}
                {!isCollapsed && (
                    <div
                        style={{
                            padding: '8px',
                            borderBottom: '1px solid #808080',
                            backgroundColor: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <img
                            src="/logo.png"
                            alt="Tins & Trays Logo"
                            style={{ width: '72px', height: '72px', objectFit: 'contain' }}
                        />
                    </div>
                )}

                {/* Navigation Menu - Windows Explorer Tree */}
                <div
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        backgroundColor: '#ffffff',
                        borderTop: '1px solid #808080',
                        borderBottom: '1px solid #808080',
                        boxShadow: 'inset 1px 1px 0 #404040',
                    }}
                >
                    {filteredMenuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleMenuClick(item.id)}
                            title={isCollapsed ? item.label : ''}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: isCollapsed ? '0' : '6px',
                                justifyContent: isCollapsed ? 'center' : 'flex-start',
                                padding: isCollapsed ? '5px 0' : '4px 8px',
                                fontSize: '11px',
                                fontFamily: 'Tahoma, sans-serif',
                                cursor: 'pointer',
                                border: 'none',
                                textAlign: 'left',
                                backgroundColor: currentView === item.id ? '#000080' : 'transparent',
                                color: currentView === item.id ? '#ffffff' : '#000000',
                                fontWeight: currentView === item.id ? '700' : '400',
                                outline: 'none',
                                borderBottom: '1px solid transparent',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                            }}
                            onMouseEnter={(e) => {
                                if (currentView !== item.id) {
                                    e.currentTarget.style.backgroundColor = '#000080';
                                    e.currentTarget.style.color = '#ffffff';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (currentView !== item.id) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = '#000000';
                                }
                            }}
                        >
                            <span style={{ fontSize: '14px', flexShrink: 0, lineHeight: 1 }}>{item.icon}</span>
                            {!isCollapsed && (
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {item.label}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* User Info & Logout - Windows Style Status Bar */}
                {!isCollapsed && (
                    <div
                        style={{
                            padding: '4px 6px',
                            backgroundColor: '#d4d0c8',
                            borderTop: '1px solid #ffffff',
                            flexShrink: 0,
                        }}
                    >
                        {/* User info panel */}
                        <div
                            style={{
                                marginBottom: '4px',
                                padding: '4px 6px',
                                backgroundColor: '#d4d0c8',
                                borderTop: '1px solid #808080',
                                borderLeft: '1px solid #808080',
                                borderRight: '1px solid #ffffff',
                                borderBottom: '1px solid #ffffff',
                                fontSize: '11px',
                            }}
                        >
                            <div style={{ fontWeight: '700', fontSize: '11px', marginBottom: '1px' }}>
                                👤 {user?.fullName || 'User'}
                            </div>
                            <div style={{ color: '#444444', fontSize: '10px' }}>
                                {user?.role === 'admin' ? 'Administrator' : 'Cashier'}
                            </div>
                            <div style={{ fontSize: '10px', color: '#006000' }}>
                                ● System Online
                            </div>
                        </div>
                        {/* Logout button */}
                        <button
                            onClick={onLogout}
                            className="btn"
                            style={{ width: '100%', justifyContent: 'center', fontSize: '11px' }}
                        >
                            Log Off...
                        </button>
                    </div>
                )}

                {isCollapsed && (
                    <div
                        style={{
                            padding: '4px',
                            backgroundColor: '#d4d0c8',
                            borderTop: '1px solid #ffffff',
                            flexShrink: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                        }}
                    >
                        <button
                            onClick={onLogout}
                            className="btn btn-sm"
                            title="Log Off"
                            style={{ padding: '2px 6px' }}
                        >
                            ⏻
                        </button>
                    </div>
                )}
            </nav>
        </>
    );
}

export default Sidebar;
