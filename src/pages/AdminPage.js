// src/pages/AdminPage.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import AdminProductForm from '../components/AdminProductForm';
import AdminProductList from '../components/AdminProductList';
import Orders from '../components/Orders';
import AdminCategoryForm from '../components/AdminCategoryForm';
import AdminCategoryList from '../components/AdminCategoryList';

const AdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [editProduct, setEditProduct] = useState(null);
  const [editCategory, setEditCategory] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/products');
      setProducts(response.data);
      setError(null);
    } catch (error) {
      setError('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/categories');
      setCategories(response.data);
      setError(null);
    } catch (error) {
      setError('Error fetching categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Handling loading and errors
  if (loading) {
    return <div className="text-center py-10 text-gray-700">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50">
      <div className="flex md:flex-row flex-col">
        {/* Sidebar Toggle Button */}
        <button
          className="md:hidden text-gray-700 mb-4"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? '✖' : '☰'}
        </button>

        {/* Sidebar */}
        <div className={`sidebar ${isSidebarOpen ? 'block' : 'hidden'} md:block col-span-3 border-r border-gray-300 bg-white shadow-lg`}>
          <div className="p-4">
            <h5 className="text-lg font-bold mb-4 text-center">ॐ साईं Women's collection</h5>
            <ul className="flex flex-col space-y-1">
              <li>
                <a
                  className={`nav-link block px-4 py-2 rounded-md text-gray-700 ${activeSection === 'dashboard' ? 'bg-gray-300 font-semibold' : 'hover:bg-gray-200'}`}
                  href="#"
                  onClick={() => { setActiveSection('dashboard'); setIsSidebarOpen(false); }}
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  className={`nav-link block px-4 py-2 rounded-md text-gray-700 ${activeSection === 'orders' ? 'bg-gray-300 font-semibold' : 'hover:bg-gray-200'}`}
                  href="#"
                  onClick={() => { setActiveSection('orders'); setIsSidebarOpen(false); }}
                >
                  Orders
                </a>
              </li>
              <li>
                <a
                  className={`nav-link block px-4 py-2 rounded-md text-gray-700 ${activeSection === 'products' ? 'bg-gray-300 font-semibold' : 'hover:bg-gray-200'}`}
                  href="#"
                  onClick={() => { setActiveSection('products'); setIsSidebarOpen(false); }}
                >
                  Products
                </a>
              </li>
              <li>
                <a
                  className={`nav-link block px-4 py-2 rounded-md text-gray-700 ${activeSection === 'categories' ? 'bg-gray-300 font-semibold' : 'hover:bg-gray-200'}`}
                  href="#"
                  onClick={() => { setActiveSection('categories'); setIsSidebarOpen(false); }}
                >
                  Categories
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Content Area */}
        <div className="col-span-9 p-4">
          {activeSection === 'dashboard' && <h2 className="text-2xl font-bold">Dashboard</h2>}
          {activeSection === 'orders' && <Orders orders={orders} />}
          {activeSection === 'products' && (
            <>
              <AdminProductForm editProduct={editProduct} fetchProducts={fetchProducts} />
              <AdminProductList products={products} fetchProducts={fetchProducts} setEditProduct={setEditProduct} />
            </>
          )}
          {activeSection === 'categories' && (
            <>
              <AdminCategoryForm editCategory={editCategory} fetchCategories={fetchCategories} />
              <AdminCategoryList categories={categories} fetchCategories={fetchCategories} setEditCategory={setEditCategory} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
