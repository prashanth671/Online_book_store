import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import API from '../services/api'
import Spinner from '../components/Spinner'

const STATUS = {
  pending:   { label: 'Pending',   color: 'bg-yellow-100 text-yellow-700',  icon: '⏳' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700',      icon: '✅' },
  shipped:   { label: 'Shipped',   color: 'bg-purple-100 text-purple-700',  icon: '🚚' },
  delivered: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-700',icon: '📦' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-600',        icon: '❌' },
}

export default function Orders() {
  const location = useLocation()
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [banner, setBanner]   = useState(location.state?.orderPlaced || false)

  useEffect(() => {
    // clear navigation state so banner doesn't re-show on refresh
    window.history.replaceState({}, '')
    API.get('/orders/my')
      .then(({ data }) => setOrders(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!banner) return
    const t = setTimeout(() => setBanner(false), 5000)
    return () => clearTimeout(t)
  }, [banner])

  if (loading) return <Spinner fullPage text="Loading orders…" />

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-up">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">My Orders</h1>

      {/* Order placed success banner */}
      {banner && (
        <div className="flex items-center gap-4 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 mb-6 fade-in">
          <span className="text-3xl">🎉</span>
          <div>
            <p className="font-bold text-emerald-800">Order placed successfully!</p>
            <p className="text-sm text-emerald-600">Your books are being prepared. We'll ship them soon.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">{error}</div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-24 fade-in">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <span className="text-4xl">📋</span>
          </div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">No orders yet</h2>
          <p className="text-gray-400 mb-7">When you place orders they'll appear here.</p>
          <Link to="/" className="btn btn-primary btn-lg">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order, i) => {
            const st = STATUS[order.status] || STATUS.pending
            return (
              <div key={order._id} className="card overflow-hidden fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                {/* Header */}
                <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between">
                  <div>
                    <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold">Order ID</p>
                    <p className="font-mono text-sm font-bold text-gray-800">#{order._id.slice(-10).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold">Date</p>
                    <p className="text-sm text-gray-700 font-medium">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold">Total</p>
                    <p className="text-base font-extrabold text-primary">${order.totalAmount.toFixed(2)}</p>
                  </div>
                  <span className={`badge ${st.color} px-3 py-1.5 text-xs font-bold`}>
                    {st.icon} {st.label}
                  </span>
                </div>

                {/* Items */}
                <div className="p-5 space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <div className="w-12 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-primary-light">
                        {item.coverImage
                          ? <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" onError={e=>e.target.style.display='none'} />
                          : <div className="w-full h-full flex items-center justify-center text-xl">📖</div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm line-clamp-1">{item.title}</p>
                        {item.author && <p className="text-xs text-gray-400">{item.author}</p>}
                        <p className="text-xs text-gray-500 mt-1">
                          {item.quantity} × ${item.price?.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-bold text-gray-900 text-sm flex-shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Shipping address */}
                {order.shippingAddress?.address && (
                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      <span className="font-semibold text-gray-600">📍 Ship to:</span>{' '}
                      {order.shippingAddress.name}, {order.shippingAddress.address},{' '}
                      {order.shippingAddress.city} – {order.shippingAddress.pincode}
                      {order.shippingAddress.phone && ` · ${order.shippingAddress.phone}`}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
