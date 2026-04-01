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

    const menuItems = [
        { 
            id: 'dashboard', 
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
            label: 'Dashboard', 
            roles: ['admin', 'cashier'],
            color: 'from-blue-500 to-blue-600'
        },
        { 
            id: 'recipes', 
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            label: 'Recipes', 
            roles: ['admin', 'cashier'],
            color: 'from-purple-500 to-purple-600'
        },
        { 
            id: 'pricing', 
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            label: 'Product Pricing', 
            roles: ['admin'],
            color: 'from-green-500 to-green-600'
        },
        { 
            id: 'categories', 
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
            ),
            label: 'Categories', 
            roles: ['admin', 'cashier'],
            color: 'from-amber-500 to-amber-600'
        },
        { 
            id: 'inventory', 
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            label: 'Inventory', 
            roles: ['admin', 'cashier'],
            color: 'from-orange-500 to-orange-600'
        },
        { 
            id: 'purchases', 
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            ),
            label: 'Purchases', 
            roles: ['admin', 'cashier'],
            color: 'from-pink-500 to-pink-600'
        },
        { 
            id: 'orders', 
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            label: 'Orders', 
            roles: ['admin', 'cashier'],
            color: 'from-sky-500 to-sky-600'
        },
        { 
            id: 'customers', 
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            label: 'Customers', 
            roles: ['admin', 'cashier'],
            color: 'from-indigo-500 to-indigo-600'
        },
        { 
            id: 'bills', 
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            label: 'Bills', 
            roles: ['admin', 'cashier'],
            color: 'from-teal-500 to-teal-600'
        },
        { 
            id: 'analytics', 
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            label: 'Analytics', 
            roles: ['admin', 'cashier'],
            color: 'from-rose-500 to-rose-600'
        },
        { 
            id: 'users', 
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            label: 'User Management', 
            roles: ['admin'],
            color: 'from-violet-500 to-violet-600'
        }
    ];

    const filteredMenuItems = menuItems.filter(item => 
        item.roles.includes(user?.role || 'cashier')
    );

    const handleMenuClick = (viewId) => {
        onViewChange(viewId);
        setIsMobileMenuOpen(false); // Close mobile menu on selection
    };

    return (
        <>
            {/* Mobile Menu Button - Enhanced Floating Design */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-gradient-to-br from-sky-600 to-sky-700 text-white rounded-xl shadow-2xl hover:shadow-sky-500/50 transition-all duration-300 hover:scale-110 active:scale-95 border border-sky-400/30"
            >
                <svg className="w-6 h-6 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isMobileMenuOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
                {!isMobileMenuOpen && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
                )}
            </button>

            {/* Mobile Overlay - Enhanced Blur */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-slate-900/70 backdrop-blur-md z-40 transition-all duration-300 animate-fadeIn"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar - Enhanced Light Blue Theme */}
            <nav className={`
                fixed left-0 top-0 bottom-0 ${isCollapsed ? 'w-20' : 'w-72'} text-white flex flex-col z-50 shadow-2xl
                transition-all duration-300 ease-in-out border-r border-sky-700/50
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `} style={{background: 'linear-gradient(180deg, #0369a1 0%, #0c4a6e 100%)'}}>
                {/* Logo Section */}
                <div className="p-6 border-b border-sky-800/30" style={{background: 'rgba(12, 74, 110, 0.3)'}}>
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-center'} px-3 py-2 bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group`}>
                        <img 
                            src="/logo.png" 
                            alt="Tins & Trays Logo" 
                            className={`${isCollapsed ? 'w-10 h-10' : 'w-24 h-24'} object-contain group-hover:scale-105 transition-transform duration-300`}
                        />
                    </div>
                    
                    {/* Collapse Toggle - Desktop Only */}
                    <button
                        onClick={handleToggleCollapse}
                        className="hidden lg:flex mt-4 w-full justify-center items-center p-2 bg-sky-600/30 hover:bg-sky-600/50 rounded-xl transition-all duration-300 group"
                        title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                    >
                        <svg 
                            className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                {/* Navigation Menu - Enhanced with Collapse Support */}
                <div className="flex-1 px-5 py-6 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-sky-600 scrollbar-track-transparent">
                    {filteredMenuItems.map((item, index) => (
                        <button
                            key={item.id}
                            onClick={() => handleMenuClick(item.id)}
                            className={`
                                w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-4 px-5'} py-3.5 rounded-xl font-medium text-sm
                                transition-all duration-200 text-left group relative overflow-hidden
                                ${currentView === item.id
                                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg font-semibold transform scale-105`
                                    : 'text-sky-100 hover:bg-sky-900/30 hover:text-sky-50 hover:scale-105'
                                }
                            `}
                            style={currentView === item.id ? {
                                boxShadow: '0 4px 16px rgba(56, 189, 248, 0.5)',
                                animation: 'slideIn 0.3s ease-out'
                            } : {}}
                            title={isCollapsed ? item.label : ''}
                        >
                            {/* Animated Background Pulse */}
                            {currentView === item.id && (
                                <div className="absolute inset-0 bg-white/10 animate-pulse rounded-xl"></div>
                            )}
                            
                            <span className={`relative z-10 transition-transform duration-200 ${currentView === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                                {item.icon}
                            </span>
                            
                            {!isCollapsed && (
                                <span className="relative z-10 tracking-tight">{item.label}</span>
                            )}

                            {/* Active Indicator */}
                            {currentView === item.id && (
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-white/40 rounded-l-full shadow-[0_0_10px_rgba(255,255,255,0.3)]"></div>
                            )}
                            
                            {/* Hover Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                        </button>
                    ))}
                </div>

                {/* User Info & Logout - Enhanced */}
                <div className="p-5 border-t border-sky-800/30" style={{background: 'rgba(12, 74, 110, 0.3)'}}>
                    <div className={`mb-3 px-4 py-3 bg-sky-900/30 rounded-xl border border-sky-700/30 backdrop-blur-sm hover:bg-sky-900/40 transition-all duration-300 ${isCollapsed ? 'px-2' : ''}`}>
                        <div className={`flex items-center ${isCollapsed ? 'justify-center flex-col gap-2' : 'gap-3'} mb-3`}>
                            <div className="relative group">
                                <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    {user?.fullName?.charAt(0) || 'U'}
                                </div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-sky-900 animate-pulse"></div>
                            </div>
                            {!isCollapsed && (
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-white truncate">{user?.fullName}</p>
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                        <p className="text-xs text-sky-200">{user?.role === 'admin' ? 'Administrator' : 'Cashier'}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Logout Button */}
                        {!isCollapsed ? (
                            <button
                                onClick={onLogout}
                                className="w-full px-3 py-2 bg-red-500/20 hover:bg-red-500 text-red-200 hover:text-white rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 group hover:scale-105 active:scale-95"
                            >
                                <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={onLogout}
                                className="w-10 h-10 bg-red-500/20 hover:bg-red-500 text-red-200 hover:text-white rounded-lg transition-all duration-300 flex items-center justify-center group hover:scale-110 active:scale-95"
                                title="Logout"
                            >
                                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        )}
                    </div>
                    
                    {!isCollapsed && (
                        <div className="flex items-center gap-3 px-4 py-2 bg-sky-900/20 rounded-lg backdrop-blur-sm">
                            <div className="relative">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]"></div>
                                <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-bold text-emerald-400">System Online</p>
                                <p className="text-[10px] text-sky-300">All services active</p>
                            </div>
                        </div>
                    )}
                    
                    {isCollapsed && (
                        <div className="flex justify-center mt-2">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]"></div>
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
}

export default Sidebar;
