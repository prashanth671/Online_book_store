import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider }          from './context/CartContext'
import { ToastProvider }         from './context/ToastContext'

import Navbar          from './components/Navbar'
import Footer          from './components/Footer'
import Home            from './pages/Home'
import BookDetail      from './pages/BookDetail'
import Cart            from './pages/Cart'
import Checkout        from './pages/Checkout'
import Orders          from './pages/Orders'
import Login           from './pages/Login'
import Register        from './pages/Register'
import AdminDashboard  from './pages/AdminDashboard'

const PrivateRoute = ({ children }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}
const AdminRoute = ({ children }) => {
  const { user } = useAuth()
  if (!user)              return <Navigate to="/login"  replace />
  if (user.role !== 'admin') return <Navigate to="/"   replace />
  return children
}

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/register"  element={<Register />} />
          <Route path="/cart"      element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/checkout"  element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="/orders"    element={<PrivateRoute><Orders /></PrivateRoute>} />
          <Route path="/admin"     element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <Layout />
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
