import { useState, useEffect, useCallback } from 'react'
import API from '../services/api'
import Spinner from '../components/Spinner'
import { useToast } from '../context/ToastContext'

const CATEGORIES = ['Fiction','Non-Fiction','Science','History','Biography','Technology','Self-Help','Mystery','Fantasy','Romance']
const EMPTY = { title:'', author:'', description:'', price:'', category:'Fiction', coverImage:'', stock:'10', rating:'4.0', pages:'', publisher:'', publishedYear:'' }

const STATUS_OPTIONS = ['pending','confirmed','shipped','delivered','cancelled']
const STATUS_COLORS  = { pending:'text-yellow-600 bg-yellow-50', confirmed:'text-blue-600 bg-blue-50', shipped:'text-purple-600 bg-purple-50', delivered:'text-emerald-600 bg-emerald-50', cancelled:'text-red-500 bg-red-50' }

export default function AdminDashboard() {
  const { success, error: toastError } = useToast()
  const [tab, setTab]         = useState('books')
  const [books, setBooks]     = useState([])
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [modal, setModal]     = useState(false)
  const [form, setForm]       = useState(EMPTY)
  const [editId, setEditId]   = useState(null)
  const [saving, setSaving]   = useState(false)
  const [formErr, setFormErr] = useState('')
  const [deleteId, setDeleteId] = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [bRes, oRes] = await Promise.all([
        API.get('/books?limit=200'),
        API.get('/orders')
      ])
      setBooks(bRes.data.books || [])
      setOrders(oRes.data || [])
    } catch (err) {
      toastError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const openAdd = () => { setForm(EMPTY); setEditId(null); setFormErr(''); setModal(true) }
  const openEdit = (b) => {
    setForm({
      title: b.title, author: b.author, description: b.description,
      price: String(b.price), category: b.category,
      coverImage: b.coverImage || '', stock: String(b.stock),
      rating: String(b.rating), pages: String(b.pages || ''),
      publisher: b.publisher || '', publishedYear: String(b.publishedYear || '')
    })
    setEditId(b._id); setFormErr(''); setModal(true)
  }
  const closeModal = () => { setModal(false); setEditId(null) }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.author.trim() || !form.description.trim() || !form.price)
      return setFormErr('Title, Author, Description, and Price are required')
    setSaving(true); setFormErr('')
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock) || 0,
        rating: parseFloat(form.rating) || 4.0,
        pages: parseInt(form.pages) || 0,
        publishedYear: parseInt(form.publishedYear) || undefined
      }
      if (editId) {
        await API.put(`/books/${editId}`, payload)
        success('Book updated successfully')
      } else {
        await API.post('/books', payload)
        success('Book added successfully')
      }
      closeModal()
      fetchAll()
    } catch (err) {
      setFormErr(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    setDeleteId(id)
    try {
      await API.delete(`/books/${id}`)
      success('Book deleted')
      fetchAll()
    } catch (err) {
      toastError(err.message)
    } finally {
      setDeleteId(null)
    }
  }

  const handleStatusChange = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status })
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o))
      success(`Order status updated to "${status}"`)
    } catch (err) {
      toastError(err.message)
    }
  }

  const fld = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const filteredBooks = books.filter(b =>
    !search.trim() ||
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <Spinner fullPage text="Loading admin data…" />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-up">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">{books.length} books · {orders.length} orders</p>
        </div>
        {tab === 'books' && (
          <button onClick={openAdd} className="btn btn-primary btn-md">
            + Add Book
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl w-fit mb-7">
        {[['books', '📚 Books'], ['orders', '📋 Orders']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${tab === key ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* ── BOOKS TAB ── */}
      {tab === 'books' && (
        <>
          <div className="mb-4">
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search books by title or author…" className="input max-w-sm" />
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['Book','Author','Category','Price','Stock','Rating','Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredBooks.map(book => (
                    <tr key={book._id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 max-w-[220px]">
                          <div className="w-9 h-12 rounded-md overflow-hidden bg-primary-light flex-shrink-0">
                            {book.coverImage
                              ? <img src={book.coverImage} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
                              : <div className="w-full h-full flex items-center justify-center text-base">📖</div>
                            }
                          </div>
                          <span className="font-semibold text-gray-800 line-clamp-2 text-sm leading-snug">{book.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{book.author}</td>
                      <td className="px-4 py-3"><span className="badge bg-primary-light text-primary">{book.category}</span></td>
                      <td className="px-4 py-3 font-bold text-primary whitespace-nowrap">${book.price.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`font-bold ${book.stock === 0 ? 'text-red-500' : book.stock <= 5 ? 'text-orange-500' : 'text-emerald-600'}`}>
                          {book.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-yellow-500 font-semibold">★ {book.rating}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(book)}
                            className="btn btn-ghost btn-sm text-primary hover:bg-primary-light border border-primary-light">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(book._id)} disabled={deleteId === book._id}
                            className="btn btn-danger btn-sm">
                            {deleteId === book._id ? '…' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredBooks.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  {search ? `No books matching "${search}"` : 'No books yet. Add one!'}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── ORDERS TAB ── */}
      {tab === 'orders' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Order','Customer','Items','Total','Date','Status'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-gray-500">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">{order.user?.name || '–'}</p>
                      <p className="text-xs text-gray-400">{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{order.items.length}</td>
                    <td className="px-4 py-3 font-bold text-primary">${order.totalAmount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order._id, e.target.value)}
                        className={`text-xs border rounded-xl px-2.5 py-1.5 font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${STATUS_COLORS[order.status] || ''}`}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && <div className="text-center py-12 text-gray-400">No orders yet</div>}
          </div>
        </div>
      )}

      {/* ── ADD / EDIT MODAL ── */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 fade-in" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto fade-up">
            {/* Modal header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl z-10">
              <h2 className="text-xl font-extrabold text-gray-900">{editId ? 'Edit Book' : 'Add New Book'}</h2>
              <button onClick={closeModal} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors text-xl font-light">
                ×
              </button>
            </div>

            <form onSubmit={handleSave} className="p-7 space-y-5">
              {formErr && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{formErr}</div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title *</label>
                  <input required value={form.title} onChange={fld('title')} className="input" placeholder="Book title" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Author *</label>
                  <input required value={form.author} onChange={fld('author')} className="input" placeholder="Author name" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category *</label>
                  <select required value={form.category} onChange={fld('category')} className="input">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price ($) *</label>
                  <input required type="number" step="0.01" min="0" value={form.price} onChange={fld('price')} className="input" placeholder="12.99" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Stock</label>
                  <input type="number" min="0" value={form.stock} onChange={fld('stock')} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Rating (0–5)</label>
                  <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={fld('rating')} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pages</label>
                  <input type="number" min="0" value={form.pages} onChange={fld('pages')} className="input" placeholder="320" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Published Year</label>
                  <input type="number" min="1000" max="2099" value={form.publishedYear} onChange={fld('publishedYear')} className="input" placeholder="2024" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Publisher</label>
                  <input value={form.publisher} onChange={fld('publisher')} className="input" placeholder="Publisher name" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cover Image URL</label>
                  <input value={form.coverImage} onChange={fld('coverImage')} className="input" placeholder="https://…" />
                  {form.coverImage && (
                    <img src={form.coverImage} alt="preview" className="mt-2 h-20 rounded-lg object-cover border border-gray-100"
                      onError={e => e.target.style.display='none'} />
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description *</label>
                  <textarea required rows={3} value={form.description} onChange={fld('description')} className="input resize-none" placeholder="Book description…" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="btn btn-ghost btn-lg flex-1 border border-gray-200">Cancel</button>
                <button type="submit" disabled={saving} className="btn btn-primary btn-lg flex-1">
                  {saving
                    ? <span className="flex items-center gap-2"><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg> Saving…</span>
                    : editId ? 'Update Book' : 'Add Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
