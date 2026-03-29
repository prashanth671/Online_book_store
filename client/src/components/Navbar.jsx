import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const { info } = useToast()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    info('Logged out successfully')
    navigate('/')
    setMobileOpen(false)
    setUserMenuOpen(false)
  }

  const navLink = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-150 ${isActive ? 'text-primary' : 'text-gray-600 hover:text-primary'}`

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setMobileOpen(false)}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm group-hover:bg-primary-dark transition-colors">
              <span className="text-white text-base">📚</span>
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">BookStore</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" end className={navLink}>Browse</NavLink>
            {user && <NavLink to="/orders" className={navLink}>My Orders</NavLink>}
            {user?.role === 'admin' && (
              <NavLink to="/admin" className={navLink}>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  Admin
                </span>
              </NavLink>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Cart icon */}
            {user && (
              <Link to="/cart"
                className="relative p-2 rounded-xl text-gray-500 hover:text-primary hover:bg-primary-light transition-all"
                aria-label="Cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3c-.6.6-.2 1.7.7 1.7H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Desktop: user menu or auth buttons */}
            {user ? (
              <div className="hidden md:block relative">
                <button
                  onClick={() => setUserMenuOpen(o => !o)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                >
                  <div className="w-7 h-7 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.name.split(' ')[0]}</span>
                  <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-1.5 slide-down">
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-800 truncate">{user.email}</p>
                    </div>
                    <Link to="/orders" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                      📋 My Orders
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                        ⚙️ Admin Panel
                      </Link>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                      🚪 Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login"    className="btn btn-ghost btn-sm">Log In</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(o => !o)}
              className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen
                ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white slide-down">
          <div className="px-4 py-3 space-y-1">
            <NavLink to="/" end className={navLink} onClick={() => setMobileOpen(false)}>
              <div className="px-3 py-2.5 rounded-xl hover:bg-gray-50">Browse Books</div>
            </NavLink>
            {user && (
              <NavLink to="/orders" className={navLink} onClick={() => setMobileOpen(false)}>
                <div className="px-3 py-2.5 rounded-xl hover:bg-gray-50">My Orders</div>
              </NavLink>
            )}
            {user?.role === 'admin' && (
              <NavLink to="/admin" className={navLink} onClick={() => setMobileOpen(false)}>
                <div className="px-3 py-2.5 rounded-xl hover:bg-gray-50">Admin Panel</div>
              </NavLink>
            )}
            <div className="pt-2 border-t border-gray-100">
              {user ? (
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  <button onClick={handleLogout} className="btn btn-danger btn-sm">Log Out</button>
                </div>
              ) : (
                <div className="flex gap-2 pt-1">
                  <Link to="/login"    className="btn btn-outline btn-md flex-1" onClick={() => setMobileOpen(false)}>Log In</Link>
                  <Link to="/register" className="btn btn-primary btn-md flex-1" onClick={() => setMobileOpen(false)}>Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
