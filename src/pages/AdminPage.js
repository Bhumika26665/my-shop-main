// src/pages/AdminPage.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import AdminProductForm from '../components/AdminProductForm';
import AdminProductList from '../components/AdminProductList';
import Orders from '../components/Orders';
import AdminCategoryForm from '../components/AdminCategoryForm';
import AdminCategoryList from '../components/AdminCategoryList';
import CartReminderManager from '../components/CartReminderManager';
import PushNotificationTester from '../components/PushNotificationTester';

const AdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [editProduct, setEditProduct] = useState(null);
  const [editCategory, setEditCategory] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalUsers: 0,
    recentOrders: 0,
    lowStockProducts: 0
  });

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/products');
      setProducts(response.data);
      return response.data;
    } catch (error) {
      setError('Error fetching products');
      return [];
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/categories');
      setCategories(response.data);
      return response.data;
    } catch (error) {
      setError('Error fetching categories');
      return [];
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get('/orders');
      setOrders(response.data);
      return response.data;
    } catch (error) {
      setError('Error fetching orders');
      return [];
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/users');
      setUsers(response.data);
      return response.data;
    } catch (error) {
      setError('Error fetching users');
      return [];
    }
  };

  // Calculate statistics
  const calculateStats = (products, categories, orders, users) => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentOrders = orders.filter(order => new Date(order.createdAt) > oneWeekAgo).length;
    const lowStockProducts = products.filter(product => product.countInStock < 5).length;

    setStats({
      totalProducts: products.length,
      totalCategories: categories.length,
      totalOrders: orders.length,
      totalUsers: users.length,
      recentOrders,
      lowStockProducts
    });
  };

  // Load all data
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData, ordersData, usersData] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchOrders(),
        fetchUsers()
      ]);
      
      calculateStats(productsData, categoriesData, ordersData, usersData);
      setError(null);
    } catch (error) {
      setError('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Dashboard content
  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={loadAllData}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Products</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalProducts}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Categories</p>
              <p className="text-3xl font-bold text-green-600">{stats.totalCategories}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-purple-600">{stats.totalOrders}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-orange-600">{stats.totalUsers}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Recent Orders (7 days)</p>
              <p className="text-3xl font-bold text-teal-600">{stats.recentOrders}</p>
            </div>
            <div className="bg-teal-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Low Stock Alert</p>
              <p className="text-3xl font-bold text-red-600">{stats.lowStockProducts}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {orders.slice(0, 5).map(order => (
              <div key={order._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Order #{order._id.slice(-8)}</p>
                  <p className="text-sm text-gray-500">₹{order.totalPrice?.toFixed(2) || '0.00'}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status || 'Pending'}
                </span>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-gray-500 text-center py-4">No orders found</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Low Stock Products</h3>
          <div className="space-y-3">
            {products.filter(p => p.countInStock < 5).slice(0, 5).map(product => (
              <div key={product._id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{product.name}</p>
                  <p className="text-sm text-gray-500">₹{product.price?.toFixed(2) || '0.00'}</p>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                  {product.countInStock} left
                </span>
              </div>
            ))}
            {stats.lowStockProducts === 0 && (
              <p className="text-green-600 text-center py-4">All products are well stocked!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Handling loading and errors
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 text-lg">Error: {error}</p>
          <button
            onClick={loadAllData}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                className="md:hidden text-gray-700 p-2 rounded-md hover:bg-gray-100"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="ml-2 text-xl font-bold text-gray-800">ॐ साईं Women's Collection</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Admin Panel</span>
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`w-64 bg-white shadow-lg border-r border-gray-200 flex-shrink-0 ${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
              <button
                className="md:hidden text-gray-700 p-1 rounded-md hover:bg-gray-100"
                onClick={() => setIsSidebarOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                { id: 'orders', label: 'Orders', icon: '📦' },
                { id: 'products', label: 'Products', icon: '🛍️' },
                { id: 'categories', label: 'Categories', icon: '📂' },
                { id: 'cart-reminders', label: 'Cart Reminders', icon: '🔔' },
                { id: 'push-tester', label: 'Push Tester', icon: '🧪' },
              ].map(section => (
                <button
                  key={section.id}
                  onClick={() => { setActiveSection(section.id); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-pink-100 text-pink-700 font-medium'
                      : 'text-gray-700 hover:bg-pink-50 hover:text-pink-700'
                  }`}
                >
                  <span className="text-xl">{section.icon}</span>
                  <span>{section.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
            <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform md:hidden">
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
                  <button
                    className="text-gray-700 p-1 rounded-md hover:bg-gray-100"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                  {[
                    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                    { id: 'orders', label: 'Orders', icon: '📦' },
                    { id: 'products', label: 'Products', icon: '🛍️' },
                    { id: 'categories', label: 'Categories', icon: '📂' },
                    { id: 'cart-reminders', label: 'Cart Reminders', icon: '🔔' },
                    { id: 'push-tester', label: 'Push Tester', icon: '🧪' },
                  ].map(section => (
                    <button
                      key={section.id}
                      onClick={() => { setActiveSection(section.id); setIsSidebarOpen(false); }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        activeSection === section.id
                          ? 'bg-pink-100 text-pink-700 font-medium'
                          : 'text-gray-700 hover:bg-pink-50 hover:text-pink-700'
                      }`}
                    >
                      <span className="text-xl">{section.icon}</span>
                      <span>{section.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {activeSection === 'dashboard' && renderDashboard()}
          {activeSection === 'orders' && <Orders orders={orders} refreshData={loadAllData} />}
          {activeSection === 'products' && (
            <div className="space-y-6">
              <AdminProductForm editProduct={editProduct} fetchProducts={fetchProducts} />
              <AdminProductList products={products} fetchProducts={fetchProducts} setEditProduct={setEditProduct} />
            </div>
          )}
          {activeSection === 'categories' && (
            <div className="space-y-6">
              <AdminCategoryForm editCategory={editCategory} fetchCategories={fetchCategories} />
              <AdminCategoryList categories={categories} fetchCategories={fetchCategories} setEditCategory={setEditCategory} />
            </div>
          )}
          {activeSection === 'cart-reminders' && <CartReminderManager />}
          {activeSection === 'push-tester' && <PushNotificationTester />}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
