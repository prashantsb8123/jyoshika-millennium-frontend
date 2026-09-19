import React, { useState, useEffect } from 'react';
import { useStore } from './store/useStore';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/common/Toast';
import { QuickViewModal } from './components/common/QuickViewModal';
import { CartDrawer } from './components/common/CartDrawer';
import { CompareDrawer } from './components/common/CompareDrawer';
import { ConciergeWidget } from './components/common/ConciergeWidget';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductListingPage } from './pages/ProductListingPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { WishlistPage } from './pages/WishlistPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { CustomerAccountPage } from './pages/CustomerAccountPage';
import { CustomerAuthPage } from './pages/CustomerAuthPage';

// Admin
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminCouponsPage } from './pages/admin/AdminCouponsPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';

export default function App() {
  const { user } = useStore();
  const [currentHash, setCurrentHash] = useState<string>(window.location.hash || '#');
  const [adminActiveTab, setAdminActiveTab] = useState<string>('dashboard');

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Admin Route Protection Check
  const isAdminRoute = currentHash.startsWith('#admin') && currentHash !== '#admin-login';

  if (isAdminRoute) {
    // If attempting to access /admin without ROLE_ADMIN, render AdminLoginPage
    if (!user || user.role !== 'ROLE_ADMIN') {
      return (
        <>
          <Toast />
          <AdminLoginPage />
        </>
      );
    }

    return (
      <>
        <Toast />
        <AdminLayout activeTab={adminActiveTab} setActiveTab={setAdminActiveTab}>
          {adminActiveTab === 'dashboard' && <AdminDashboardPage />}
          {adminActiveTab === 'products' && <AdminProductsPage />}
          {adminActiveTab === 'categories' && <AdminCategoriesPage />}
          {adminActiveTab === 'orders' && <AdminOrdersPage />}
          {adminActiveTab === 'coupons' && <AdminCouponsPage />}
          {adminActiveTab === 'customers' && <AdminCustomersPage />}
          {adminActiveTab === 'reviews' && <AdminReviewsPage />}
        </AdminLayout>
      </>
    );
  }

  if (currentHash === '#admin-login') {
    return (
      <>
        <Toast />
        <AdminLoginPage />
      </>
    );
  }

  // Render Public Customer Storefront
  const renderPublicView = () => {
    if (currentHash.startsWith('#product-')) {
      return <ProductDetailPage />;
    }
    if (currentHash === '#shop' || currentHash.startsWith('#category-')) {
      return <ProductListingPage />;
    }
    if (currentHash === '#wishlist') {
      return <WishlistPage />;
    }
    if (currentHash === '#checkout') {
      return <CheckoutPage />;
    }
    if (currentHash.startsWith('#order-success-')) {
      return <OrderSuccessPage />;
    }
    if (currentHash === '#account') {
      return <CustomerAccountPage />;
    }
    if (currentHash === '#auth-login' || currentHash === '#auth-register') {
      return <CustomerAuthPage />;
    }
    return <HomePage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 font-sans selection:bg-gold-light selection:text-black">
      {/* Global Overlays */}
      <Toast />
      <QuickViewModal />
      <CartDrawer />
      <CompareDrawer />
      <ConciergeWidget />

      {/* Main Layout Header */}
      <Header />

      {/* Dynamic View */}
      <main className="flex-1">
        {renderPublicView()}
      </main>

      {/* Main Layout Footer */}
      <Footer />
    </div>
  );
}
