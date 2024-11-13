import Link from 'next/link';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold">
                Content Dashboard
              </Link>
              <div className="ml-10 flex items-baseline space-x-4">
                <Link 
                  href="/" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  Overview
                </Link>
                <Link 
                  href="/categories" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  Categories
                </Link>
                <Link 
                  href="/selected-topics"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  Selected Topics
                </Link>
                {/* Add more navigation items as needed */}
              </div>
            </div>
            <div className="flex items-center">
              {/* Add user profile or settings menu here */}
              <span className="text-sm">Welcome, User</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm">© 2024 Content Dashboard. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <Link 
                href="/privacy" 
                className="text-sm hover:text-gray-300"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-sm hover:text-gray-300"
              >
                Terms of Service
              </Link>
              <Link 
                href="/contact" 
                className="text-sm hover:text-gray-300"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 