// components/Layout.js
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';

const Layout = ({ children, onLoginClick }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const hasAuthToken = document.cookie.includes('auth-token');
      setIsAuthenticated(hasAuthToken);
    };

    // Initial check
    checkAuth();

    // Set up interval to check auth status
    const interval = setInterval(checkAuth, 1000);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);

  const handleLogoutClick = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Clear auth state
        setIsAuthenticated(false);
        // Force reload to clear any cached state
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        onLoginClick={onLoginClick}
        onLogoutClick={handleLogoutClick}
        isAuthenticated={isAuthenticated}
      />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600">
              © {new Date().getFullYear()} {process.env.NEXT_PUBLIC_BRAND_NAME}. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;