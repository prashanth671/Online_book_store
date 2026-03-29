import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import API from '../services/api'

export default function Checkout() {
  const { cart, cartTotal, clearCart, cartLoading } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm]       = useState({ name: user?.name || '', address: '', city: '', pincode: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  // FIX: redirect in useEffect, not during render
  useEffect(() => {
    if (!cartLoading && cart.length === 0) navigate('/cart', { replace: true })
  }, [cart, cartLoading, navigate])

  const handle = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.address.trim() || !form.city.trim() || !form.pincode.trim() || !form.phone.trim())
      return setError('Please fill in all shipping fields')

    setError('')
    setLoading(true)
    try {
      await API.post('/orders', { shippingAddress: form })
      await clearCart()
      navigate('/orders', { state: { orderPlaced: true }, replace: true })
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (cartLoading || !cart.length) return null   // useEffect will redirect

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-up">
      {/* Progress indicator */}
      <div className="flex items-center gap-2 text-sm mb-8">
        <Link to="/cart" className="text-primary font-medium hover:underline">Cart</Link>
        <span className="text-gray-300">›</span>
        <span className="text-gray-900 font-semibold">Checkout</span>
        <span className="text-gray-300">›</span>
        <span className="text-gray-400">Confirmation</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">

        {/* ── Shipping form ── */}
        <div className="lg:col-span-2">
          <div className="card p-7">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
              Shipping Details
            </h2>

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
                <span className="mt-0.5">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                  <input type="text" required value={form.name} onChange={handle('name')} placeholder="John Doe" className="input" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number *</label>
                  <input type="tel" required value={form.phone} onChange={handle('phone')} placeholder="+91 98765 43210" className="input" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">City *</label>
                  <input type="text" required value={form.city} onChange={handle('city')} placeholder="Mumbai" className="input" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Street Address *</label>
                  <textarea required rows={2} value={form.address} onChange={handle('address')}
                    placeholder="House no., Street, Locality…" className="input resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">PIN Code *</label>
                  <input type="text" required value={form.pincode} onChange={handle('pincode')} placeholder="400001" className="input" />
                </div>
              </div>
            </form>

            {/* Payment section */}
            <div className="mt-7 pt-6 border-t border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                Payment Method
              </h2>
              <div className="border-2 border-emerald-400 bg-emerald-50 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-xl">💵</div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm">Cash on Delivery</p>
                  <p className="text-xs text-gray-500">Pay when your books arrive at your doorstep</p>
                </div>
                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Summary sidebar ── */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4">Your Order</h3>

            {/* Items */}
            <div className="space-y-3 mb-5 max-h-64 overflow-y-auto pr-1">
              {cart.map(item => (
                <div key={item.book?._id} className="flex gap-3 text-sm items-center">
                  <div className="w-10 flex-shrink-0 rounded overflow-hidden bg-gray-100" style={{ height: '40px' }}>
                    {item.book?.coverImage
                      ? <img src={item.book.coverImage} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
                      : <div className="w-full h-full flex items-center justify-center text-base">📖</div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 line-clamp-1 text-xs">{item.book?.title}</p>
                    <p className="text-gray-400 text-xs">×{item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-800 text-xs flex-shrink-0">
                    ${((item.book?.price || 0) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-500"><span>Shipping</span><span className="text-emerald-600 font-medium">Free</span></div>
              <div className="flex justify-between text-gray-900 font-extrabold text-base pt-2 border-t border-gray-100">
                <span>Total</span>
                <span className="text-primary">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={loading}
              className="btn btn-primary btn-lg w-full mt-5"
            >
              {loading
                ? <span className="flex items-center gap-2"><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg> Placing Order…</span>
                : `Place Order • $${cartTotal.toFixed(2)}`}
            </button>

            <p className="text-center text-xs text-gray-400 mt-3">
              🔒 Your information is secure
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
