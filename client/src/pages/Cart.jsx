import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import Spinner from '../components/Spinner'

export default function Cart() {
  const { cart, cartTotal, cartLoading, updateQuantity, removeFromCart } = useCart()
  const { info } = useToast()
  const navigate = useNavigate()

  const handleRemove = (book) => {
    removeFromCart(book._id)
    info(`"${book.title}" removed from cart`)
  }

  if (cartLoading) return <Spinner fullPage text="Loading cart…" />

  if (!cart.length) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center fade-up">
        <div className="w-24 h-24 bg-primary-light rounded-full flex items-center justify-center mb-6">
          <span className="text-5xl">🛒</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-8 max-w-xs">Looks like you haven't added any books yet. Start browsing!</p>
        <Link to="/" className="btn btn-primary btn-lg">Browse Books</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-up">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">
        Shopping Cart
        <span className="ml-2 text-lg font-normal text-gray-400">({cart.length} item{cart.length !== 1 ? 's' : ''})</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Item list ── */}
        <div className="lg:col-span-2 space-y-3">
          {cart.map(item => {
            const book = item.book
            if (!book) return null
            return (
              <div key={book._id} className="card p-4 flex gap-4 items-start fade-in">
                {/* Cover */}
                <Link to={`/books/${book._id}`} className="flex-shrink-0">
                  <div className="w-16 h-22 overflow-hidden rounded-lg bg-gray-100" style={{ height: '88px', width: '64px' }}>
                    {book.coverImage ? (
                      <img src={book.coverImage} alt={book.title}
                        className="w-full h-full object-cover"
                        onError={e => { e.target.style.display = 'none' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl bg-primary-light">📖</div>
                    )}
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link to={`/books/${book._id}`}
                    className="font-semibold text-gray-900 hover:text-primary transition-colors text-sm leading-snug line-clamp-2 block">
                    {book.title}
                  </Link>
                  <p className="text-xs text-gray-400 mt-0.5 mb-2">{book.author}</p>

                  {/* Quantity control */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                      <button
                        onClick={() => updateQuantity(book._id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-primary transition-colors font-bold text-lg"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-8 h-8 flex items-center justify-center text-sm font-bold text-gray-800 border-x border-gray-200">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(book._id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-primary transition-colors font-bold text-lg"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemove(book)}
                      className="text-xs text-red-400 hover:text-red-600 transition-colors font-medium flex items-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>

                {/* Line total */}
                <div className="flex-shrink-0 text-right">
                  <p className="font-bold text-gray-900">${(book.price * item.quantity).toFixed(2)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">${book.price.toFixed(2)} each</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Order summary ── */}
        <div className="lg:col-span-1 h-fit">
          <div className="card p-6 sticky top-24">
            <h2 className="font-bold text-gray-900 text-lg mb-5">Order Summary</h2>

            <div className="space-y-3 text-sm">
              {cart.map(item => item.book && (
                <div key={item.book._id} className="flex justify-between text-gray-600">
                  <span className="truncate max-w-[65%]">{item.book.title} <span className="text-gray-400">×{item.quantity}</span></span>
                  <span className="font-medium text-gray-800">${(item.book.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}

              <div className="border-t border-gray-100 pt-3 mt-1 space-y-2">
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-gray-900 font-extrabold text-base">
                  <span>Total</span>
                  <span className="text-primary">${cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary btn-lg w-full mt-6"
            >
              Proceed to Checkout →
            </button>
            <Link to="/" className="block text-center text-sm text-primary hover:underline mt-3 font-medium">
              ← Continue Shopping
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
