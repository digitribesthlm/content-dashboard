// pages/index.js
import Layout from '../components/Layout.js';
import ServicesGrid from '../components/ServicesGrid';
import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';

export default function Home() {
  const router = useRouter();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    error: ''
  });

  // Check authentication once on mount
  useEffect(() => {
    const authToken = document.cookie.includes('auth-token');
    if (authToken) {
      router.push('/dashboard');
    }
  }, []);

  // Memoized form handlers
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: formData.email,
                password: formData.password
            }),
        });

        if (res.ok) {
            window.location.href = '/dashboard';  // Use window.location instead of router
        } else {
            const data = await res.json();
            setFormData(prev => ({
                ...prev,
                error: data.message || 'Login failed'
            }));
        }
    } catch (error) {
        console.error('Login error:', error);
        setFormData(prev => ({
            ...prev,
            error: 'An error occurred'
        }));
    } finally {
        setIsLoading(false);
    }
  }, [formData.email, formData.password]);

  const toggleLoginForm = useCallback(() => {
    setShowLoginForm(prev => !prev);
    setFormData({ email: '', password: '', error: '' });
  }, []);

  return (
    <Layout onLoginClick={() => setShowLoginForm(true)}>
      {!showLoginForm ? (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome to Content Dashboard
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Manage and organize your content strategy efficiently
              </p>
              <button
                onClick={() => setShowLoginForm(true)}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
          <ServicesGrid />
        </>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-center mb-8">Login</h2>
            <form onSubmit={handleLogin} className="space-y-6">
              {formData.error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                  {formData.error}
                </div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
            <button
              onClick={toggleLoginForm}
              className="mt-4 text-sm text-gray-600 hover:text-gray-900 flex items-center"
            >
              <span className="mr-1">←</span> Back to welcome page
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}