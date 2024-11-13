// components/Navbar.js
import Link from 'next/link';

export default function Navbar({ onLoginClick, isAuthenticated, onLogoutClick }) {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="text-xl font-medium text-blue-600">
            {process.env.NEXT_PUBLIC_BRAND_NAME}
          </div>
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
            <Link href="/selected-topics" className="text-gray-600 hover:text-gray-900">Selected Topics</Link>
            {isAuthenticated ? (
              <button 
                onClick={onLogoutClick}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Logout
              </button>
            ) : (
              <button 
                onClick={onLoginClick}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 