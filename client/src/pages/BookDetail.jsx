import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import API from '../services/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Spinner from '../components/Spinner'
import StarRating from '../components/StarRating'

const CATEGORY_COLORS = {
  Fiction: 'from-blue-50 to-indigo-100',
  'Non-Fiction': 'from-slate-50 to-slate-100',
  Science: 'from-cyan-50 to-cyan-100',
  History: 'from-amber-50 to-amber-100',
  Biography: 'from-orange-50 to-orange-100',
  Technology: 'from-violet-50 to-violet-100',
  'Self-Help': 'from-green-50 to-emerald-100',
  Mystery: 'from-gray-50 to-gray-100',
  Fantasy: 'from-purple-50 to-purple-100',
  Romance: 'from-pink-50 to-rose-100',
}

export default function BookDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const { success, error: toastError } = useToast()

  const [book, setBook]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding]   = useState(false)
  const [buyNow, setBuyNow]   = useState(false)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    API.get(`/books/${id}`)
      .then(({ data }) => { if (!cancelled) setBook(data) })
      .catch(() => { if (!cancelled) navigate('/') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id, navigate])

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return }
    setAdding(true)
    const res = await addToCart(book._id)
    setAdding(false)
    if (res.success) success(`"${book.title}" added to cart!`)
    else toastError(res.message)
  }

  const handleBuyNow = async () => {
    if (!user) { navigate('/login'); return }
    setBuyNow(true)
    const res = await addToCart(book._id)
    setBuyNow(false)
    if (res.success) navigate('/cart')
    else toastError(res.message)
  }

  if (loading) return <Spinner fullPage text="Loading book…" />
  if (!book)   return null

  const gradient = CATEGORY_COLORS[book.category] || 'from-gray-50 to-gray-100'

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-up">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-6 transition-colors group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="card overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-0">

          {/* ── Cover panel ── */}
          <div className={`md:col-span-2 bg-gradient-to-br ${gradient} flex items-center justify-center p-10 min-h-[320px]`}>
            {!imgError && book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="max-h-72 w-auto rounded-xl shadow-2xl object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex flex-col items-center gap-3">
                <span className="text-8xl">📖</span>
                <p className="text-sm font-semibold text-gray-600 text-center max-w-[160px]">{book.title}</p>
              </div>
            )}
          </div>

          {/* ── Details panel ── */}
          <div className="md:col-span-3 p-7 flex flex-col">
            <div className="mb-2">
              <span className="badge bg-primary-light text-primary">{book.category}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-1">
              {book.title}
            </h1>
            <p className="text-base text-gray-500 mb-3">
              by <span className="font-semibold text-gray-700">{book.author}</span>
            </p>

            <StarRating rating={book.rating} size="lg" />

            <p className="text-gray-600 mt-5 text-sm leading-relaxed">{book.description}</p>

            {/* Metadata grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 py-5 border-t border-b border-gray-100">
              {[
                book.pages       > 0 && { label: 'Pages',     value: book.pages },
                book.publishedYear   && { label: 'Year',      value: book.publishedYear },
                book.publisher       && { label: 'Publisher',  value: book.publisher },
                { label: 'Stock', value: book.stock === 0 ? 'Out of stock' : `${book.stock} left`, color: book.stock === 0 ? 'text-red-500' : book.stock <= 5 ? 'text-orange-500' : 'text-emerald-600' },
              ].filter(Boolean).map(({ label, value, color }) => (
                <div key={label}>
                  <p className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold mb-0.5">{label}</p>
                  <p className={`text-sm font-bold ${color || 'text-gray-800'}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Price & CTA */}
            <div className="mt-6">
              <p className="text-4xl font-extrabold text-primary mb-5">${book.price.toFixed(2)}</p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={adding || book.stock === 0}
                  className="btn btn-primary btn-lg"
                >
                  {adding ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                      </svg>
                      Adding…
                    </span>
                  ) : book.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
                </button>

                {book.stock > 0 && (
                  <button
                    onClick={handleBuyNow}
                    disabled={buyNow}
                    className="btn btn-outline btn-lg"
                  >
                    {buyNow ? 'Please wait…' : '⚡ Buy Now'}
                  </button>
                )}
              </div>
              {!user && (
                <p className="text-xs text-gray-400 mt-3">
                  <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link> to add to cart
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
