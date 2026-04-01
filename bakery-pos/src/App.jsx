import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Recipes from './components/Recipes';
import ProductPricing from './components/ProductPricing';
import Inventory from './components/Inventory';
import Orders from './components/Orders';
import Bills from './components/Bills';
import Analytics from './components/Analytics';
import Customers from './components/Customers';
import Categories from './components/Categories';
import PurchaseBills from './components/PurchaseBills';
import UserManagement from './components/UserManagement';
import Login from './components/Login';
import Sidebar from './components/Sidebar';

// Map view IDs to window titles
const viewTitles = {
  dashboard: 'Dashboard',
  recipes: 'Recipes',
  pricing: 'Product Pricing',
  inventory: 'Inventory',
  orders: 'Orders',
  customers: 'Customers',
  bills: 'Bills',
  analytics: 'Analytics',
  categories: 'Categories',
  purchases: 'Purchase Bills',
  users: 'User Management',
};

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentView('dashboard');
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#008080',
        fontFamily: 'Tahoma, sans-serif',
        fontSize: '11px',
      }}>
        <div style={{
          backgroundColor: '#d4d0c8',
          borderTop: '2px solid #ffffff',
          borderLeft: '2px solid #ffffff',
          borderRight: '2px solid #404040',
          borderBottom: '2px solid #404040',
          padding: '24px 32px',
          textAlign: 'center',
          boxShadow: '2px 2px 4px rgba(0,0,0,0.4)',
        }}>
          {/* Win2000 progress bar */}
          <div style={{ marginBottom: '8px', fontWeight: '700' }}>Please wait...</div>
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
              width: '60%',
              height: '100%',
              backgroundColor: '#000080',
              backgroundImage: 'repeating-linear-gradient(90deg, #000080 0px, #000080 10px, #1060b0 10px, #1060b0 14px)',
            }} />
          </div>
          <div style={{ marginTop: '8px', color: '#444444' }}>Loading Bakery POS...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const sidebarWidth = isSidebarCollapsed ? 44 : 200;
  const currentTitle = viewTitles[currentView] || 'Bakery POS';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#008080', display: 'flex', flexDirection: 'column' }}>
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        user={user}
        onLogout={handleLogout}
        onCollapse={setIsSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div
        style={{
          marginLeft: `${sidebarWidth}px`,
          transition: 'margin-left 0.1s ease',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          padding: '8px',
          paddingTop: '8px',
        }}
        className="pt-14 lg:pt-2"
      >
        {/* Window container */}
        <div style={{
          flex: 1,
          backgroundColor: '#d4d0c8',
          borderTop: '2px solid #ffffff',
          borderLeft: '2px solid #ffffff',
          borderRight: '2px solid #404040',
          borderBottom: '2px solid #404040',
          boxShadow: '2px 2px 0 #808080',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 'calc(100vh - 24px)',
        }}>
          {/* Window Title Bar */}
          <div style={{
            background: 'linear-gradient(to right, #000080, #1084d0)',
            color: '#ffffff',
            padding: '4px 6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            fontWeight: '700',
            fontFamily: 'Tahoma, sans-serif',
            userSelect: 'none',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: '12px' }}>🍞</span>
            <span style={{ flex: 1 }}>
              Tins &amp; Trays Bakery POS — {currentTitle}
            </span>
            {/* Window control buttons */}
            <div style={{ display: 'flex', gap: '2px' }}>
              {['—', '□', '✕'].map((btn, i) => (
                <button
                  key={i}
                  style={{
                    width: '18px',
                    height: '16px',
                    backgroundColor: '#d4d0c8',
                    borderTop: '1px solid #ffffff',
                    borderLeft: '1px solid #ffffff',
                    borderRight: '1px solid #404040',
                    borderBottom: '1px solid #404040',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'default',
                    fontSize: '9px',
                    fontWeight: '700',
                    color: '#000000',
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Bar */}
          <div style={{
            backgroundColor: '#d4d0c8',
            borderBottom: '1px solid #808080',
            padding: '2px 4px',
            display: 'flex',
            gap: '0',
            fontSize: '11px',
            fontFamily: 'Tahoma, sans-serif',
            flexShrink: 0,
          }}>
            {['File', 'Edit', 'View', 'Help'].map((menu) => (
              <button
                key={menu}
                style={{
                  padding: '2px 8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'default',
                  fontSize: '11px',
                  fontFamily: 'Tahoma, sans-serif',
                  color: '#000000',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#000080';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#000000';
                }}
              >
                {menu}
              </button>
            ))}
          </div>

          {/* Toolbar */}
          <div style={{
            backgroundColor: '#d4d0c8',
            borderBottom: '1px solid #808080',
            padding: '3px 6px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
            fontFamily: 'Tahoma, sans-serif',
            flexShrink: 0,
          }}>
            <button
              className="btn btn-sm"
              style={{ fontSize: '11px', gap: '4px', display: 'flex', alignItems: 'center' }}
              onClick={() => setCurrentView('dashboard')}
            >
              ◀ Back
            </button>
            <div style={{
              width: '1px',
              height: '20px',
              backgroundColor: '#808080',
              borderRight: '1px solid #ffffff',
              margin: '0 2px',
            }} />
            <button
              className="btn btn-sm"
              style={{ fontSize: '11px', gap: '4px', display: 'flex', alignItems: 'center' }}
              onClick={() => window.location.reload()}
            >
              🔄 Refresh
            </button>
            <div style={{
              width: '1px',
              height: '20px',
              backgroundColor: '#808080',
              borderRight: '1px solid #ffffff',
              margin: '0 2px',
            }} />
            {/* Address bar */}
            <span style={{ fontSize: '11px', color: '#000000', marginLeft: '4px' }}>Address:</span>
            <div style={{
              flex: 1,
              maxWidth: '320px',
              height: '22px',
              backgroundColor: '#ffffff',
              borderTop: '1px solid #808080',
              borderLeft: '1px solid #808080',
              borderRight: '1px solid #ffffff',
              borderBottom: '1px solid #ffffff',
              padding: '2px 6px',
              fontSize: '11px',
              fontFamily: 'Tahoma, sans-serif',
              display: 'flex',
              alignItems: 'center',
              boxShadow: 'inset 1px 1px 0 #404040',
            }}>
              C:\BakeryPOS\{currentTitle}
            </div>
          </div>

          {/* Main content area */}
          <div style={{
            flex: 1,
            backgroundColor: '#ffffff',
            overflowY: 'auto',
            padding: '12px',
            borderTop: '1px solid #808080',
            borderLeft: '1px solid #808080',
            boxShadow: 'inset 1px 1px 0 #404040',
            margin: '4px',
          }}>
            {currentView === 'dashboard' && <Dashboard onViewChange={setCurrentView} />}
            {currentView === 'recipes' && <Recipes />}
            {currentView === 'pricing' && <ProductPricing />}
            {currentView === 'inventory' && <Inventory />}
            {currentView === 'orders' && <Orders />}
            {currentView === 'customers' && <Customers />}
            {currentView === 'bills' && <Bills />}
            {currentView === 'analytics' && <Analytics />}
            {currentView === 'categories' && <Categories />}
            {currentView === 'purchases' && <PurchaseBills />}
            {currentView === 'users' && user.role === 'admin' && <UserManagement />}
          </div>

          {/* Status Bar */}
          <div style={{
            backgroundColor: '#d4d0c8',
            borderTop: '1px solid #808080',
            padding: '2px 8px',
            display: 'flex',
            gap: '8px',
            fontSize: '11px',
            fontFamily: 'Tahoma, sans-serif',
            color: '#000000',
            flexShrink: 0,
          }}>
            <div style={{
              flex: 1,
              borderTop: '1px solid #808080',
              borderLeft: '1px solid #808080',
              borderRight: '1px solid #ffffff',
              borderBottom: '1px solid #ffffff',
              padding: '1px 4px',
              boxShadow: 'inset 1px 1px 0 #404040',
            }}>
              Ready
            </div>
            <div style={{
              borderTop: '1px solid #808080',
              borderLeft: '1px solid #808080',
              borderRight: '1px solid #ffffff',
              borderBottom: '1px solid #ffffff',
              padding: '1px 8px',
              boxShadow: 'inset 1px 1px 0 #404040',
            }}>
              {user?.fullName} ({user?.role})
            </div>
            <div style={{
              borderTop: '1px solid #808080',
              borderLeft: '1px solid #808080',
              borderRight: '1px solid #ffffff',
              borderBottom: '1px solid #ffffff',
              padding: '1px 8px',
              boxShadow: 'inset 1px 1px 0 #404040',
            }}>
              {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
