import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import API from '../services/api'
import BookCard from '../components/BookCard'
import Spinner from '../components/Spinner'

const CATEGORIES = ['All','Fiction','Non-Fiction','Science','History','Biography','Technology','Self-Help','Mystery','Fantasy','Romance']

function useDebounce(value, ms) {
  const [dv, setDv] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDv(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return dv
}

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [books, setBooks]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [total, setTotal]           = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage]             = useState(1)
  const [search, setSearch]         = useState(searchParams.get('search') || '')
  const [category, setCategory]     = useState(searchParams.get('category') || 'All')
  const searchRef                   = useRef(null)

  const debouncedSearch = useDebounce(search, 420)

  const fetchBooks = useCallback(async (pg = 1) => {
    setLoading(true)
    setError('')
    try {
      const params = { page: pg, limit: 12 }
      if (debouncedSearch.trim()) params.search   = debouncedSearch.trim()
      if (category !== 'All')     params.category = category
      const { data } = await API.get('/books', { params })
      setBooks(data.books || [])
      setTotal(data.total || 0)
      setTotalPages(data.totalPages || 1)
    } catch (err) {
      setError(err.message || 'Failed to load books')
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, category])

  // Reset to page 1 whenever search/category changes
  useEffect(() => { setPage(1) }, [debouncedSearch, category])

  useEffect(() => { fetchBooks(page) }, [fetchBooks, page])

  const handleCategory = (cat) => {
    setCategory(cat)
    setSearch('')
    setPage(1)
    setSearchParams(cat !== 'All' ? { category: cat } : {})
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const clearSearch = () => {
    setSearch('')
    setPage(1)
    searchRef.current?.focus()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* ── Hero ── */}
      <div className="text-center mb-10 fade-up">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
          Find Your Next Great Read
        </h1>
        <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
          Browse {total > 0 ? total : 'thousands of'} books across fiction, science, biography, and more.
        </p>
      </div>

      {/* ── Search bar ── */}
      <div className="max-w-2xl mx-auto mb-7 fade-up">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
          </span>
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by title, author, or category…"
            className="input pl-11 pr-10 py-3 text-base shadow-sm"
          />
          {search && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* ── Category chips ── */}
      <div className="flex flex-wrap gap-2 justify-center mb-8 fade-up">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => handleCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
              category === cat
                ? 'bg-primary text-white border-primary shadow-sm scale-105'
                : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Results count ── */}
      {!loading && !error && (
        <p className="text-sm text-gray-400 mb-5 fade-in">
          {total === 0
            ? 'No books found'
            : `Showing ${books.length} of ${total} book${total !== 1 ? 's' : ''}${
                debouncedSearch ? ` for "${debouncedSearch}"` : ''
              }${category !== 'All' ? ` in ${category}` : ''}`}
        </p>
      )}

      {/* ── Content ── */}
      {loading ? (
        <Spinner text="Loading books…" />
      ) : error ? (
        <div className="text-center py-20 fade-in">
          <p className="text-4xl mb-3">😕</p>
          <p className="text-red-500 font-medium mb-4">{error}</p>
          <button onClick={() => fetchBooks(page)} className="btn btn-primary btn-md">Retry</button>
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-24 fade-in">
          <p className="text-6xl mb-4">📭</p>
          <h2 className="text-xl font-bold text-gray-700 mb-2">No books found</h2>
          <p className="text-gray-400 text-sm mb-6">Try a different search term or category</p>
          <button onClick={() => { setSearch(''); setCategory('All') }} className="btn btn-outline btn-md">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 fade-in">
          {books.map((book, i) => (
            <div key={book._id} style={{ animationDelay: `${i * 30}ms` }}>
              <BookCard book={book} />
            </div>
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && !loading && !error && (
        <div className="flex justify-center items-center gap-2 mt-12 fade-in">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn btn-ghost btn-sm disabled:opacity-40"
          >
            ← Prev
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 2)
              .reduce((acc, n, idx, arr) => {
                if (idx > 0 && n - arr[idx - 1] > 1) acc.push('…')
                acc.push(n)
                return acc
              }, [])
              .map((item, idx) =>
                item === '…' ? (
                  <span key={`ellipsis-${idx}`} className="px-2 py-1.5 text-gray-400 text-sm">…</span>
                ) : (
                  <button
                    key={item}
                    onClick={() => setPage(item)}
                    className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                      page === item
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
          </div>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn btn-ghost btn-sm disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
