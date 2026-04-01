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

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-blue-50/20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView}
        user={user}
        onLogout={handleLogout}
        onCollapse={setIsSidebarCollapsed}
      />

      {/* Main Content - Responsive to sidebar state */}
      <main className={`transition-all duration-300 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 animate-fade-in ${
        isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
      }`}>
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
      </main>
    </div>
  );
}

export default App;
