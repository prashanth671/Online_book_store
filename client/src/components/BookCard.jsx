import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import StarRating from './StarRating'

// Fallback image per category
const CATEGORY_COLORS = {
  Fiction: 'from-blue-100 to-blue-200',
  'Non-Fiction': 'from-slate-100 to-slate-200',
  Science: 'from-cyan-100 to-cyan-200',
  History: 'from-amber-100 to-amber-200',
  Biography: 'from-orange-100 to-orange-200',
  Technology: 'from-violet-100 to-violet-200',
  'Self-Help': 'from-green-100 to-green-200',
  Mystery: 'from-gray-100 to-gray-200',
  Fantasy: 'from-purple-100 to-purple-200',
  Romance: 'from-pink-100 to-pink-200',
}

export default function BookCard({ book }) {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { success, error } = useToast()
  const navigate = useNavigate()
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const gradientClass = CATEGORY_COLORS[book.category] || 'from-gray-100 to-gray-200'

  const handleAdd = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) { navigate('/login'); return }
    if (adding || book.stock === 0) return
    setAdding(true)
    const res = await addToCart(book._id)
    setAdding(false)
    if (res.success) {
      setAdded(true)
      success(`"${book.title}" added to cart!`)
      setTimeout(() => setAdded(false), 2000)
    } else {
      error(res.message)
    }
  }

  return (
    <div className="book-card card flex flex-col group fade-up overflow-hidden">
      {/* Cover */}
      <Link to={`/books/${book._id}`} className="block relative overflow-hidden" style={{ height: '200px' }}>
        {!imgError && book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="book-img w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradientClass} flex flex-col items-center justify-center p-4`}>
            <span className="text-5xl mb-2">📖</span>
            <p className="text-xs font-semibold text-gray-500 text-center line-clamp-2">{book.title}</p>
          </div>
        )}
        {/* Category badge */}
        <span className="absolute top-2 left-2 badge bg-white/90 text-gray-700 shadow-sm text-[11px]">
          {book.category}
        </span>
        {book.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="badge bg-red-500 text-white text-xs">Out of Stock</span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/books/${book._id}`}>
          <h3 className="font-semibold text-gray-900 text-sm leading-snug hover:text-primary transition-colors line-clamp-2 mb-0.5">
            {book.title}
          </h3>
        </Link>
        <p className="text-xs text-gray-500 mb-2 truncate">{book.author}</p>
        <StarRating rating={book.rating} />

        {book.stock > 0 && book.stock <= 5 && (
          <p className="text-[11px] text-orange-500 font-medium mt-1">Only {book.stock} left!</p>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <span className="text-lg font-bold text-primary">${book.price.toFixed(2)}</span>
          <button
            onClick={handleAdd}
            disabled={adding || book.stock === 0}
            className={`btn btn-sm font-semibold rounded-xl transition-all duration-200 ${
              added
                ? 'bg-emerald-500 text-white'
                : book.stock === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'btn-primary'
            }`}
          >
            {adding ? (
              <span className="flex items-center gap-1.5">
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Adding
              </span>
            ) : added ? '✓ Added' : '+ Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
