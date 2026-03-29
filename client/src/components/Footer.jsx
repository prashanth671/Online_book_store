import { Link } from 'react-router-dom'

const CATEGORIES = ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'Biography', 'Fantasy']

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">📚</span>
              </div>
              <span className="font-bold text-lg text-gray-900">BookStore</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Your one-stop shop for books across every genre. Discover, read, and explore.
            </p>
          </div>
          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {[['/', 'Browse Books'], ['/cart', 'My Cart'], ['/orders', 'My Orders']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-gray-500 hover:text-primary transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-3">Categories</h4>
            <ul className="space-y-2">
              {CATEGORIES.map(cat => (
                <li key={cat}>
                  <Link to={`/?category=${cat}`} className="text-sm text-gray-500 hover:text-primary transition-colors">{cat}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} BookStore. All rights reserved.</p>
          <p className="text-xs text-gray-400">Built with React · Node.js · MongoDB</p>
        </div>
      </div>
    </footer>
  )
}
