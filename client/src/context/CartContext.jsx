import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import API from '../services/api'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [cartLoading, setCartLoading] = useState(false)
  const { user } = useAuth()
  // Prevent concurrent quantity-update requests
  const updating = useRef(false)

  // Fetch cart whenever user changes (login / logout)
  const fetchCart = useCallback(async () => {
    if (!user) { setCart([]); return }
    setCartLoading(true)
    try {
      const { data } = await API.get('/cart')
      setCart(Array.isArray(data) ? data : [])
    } catch {
      setCart([])
    } finally {
      setCartLoading(false)
    }
  }, [user])

  useEffect(() => { fetchCart() }, [fetchCart])

  // Add to cart – returns { success, message }
  const addToCart = async (bookId) => {
    if (!user) return { success: false, message: 'Please log in first' }
    try {
      const { data } = await API.post('/cart', { bookId, quantity: 1 })
      setCart(Array.isArray(data) ? data : [])
      return { success: true }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  // Update quantity (debounced internally via ref flag)
  const updateQuantity = async (bookId, quantity) => {
    if (updating.current) return
    updating.current = true
    // Optimistic UI update
    setCart(prev =>
      quantity <= 0
        ? prev.filter(i => i.book?._id !== bookId)
        : prev.map(i => i.book?._id === bookId ? { ...i, quantity } : i)
    )
    try {
      const { data } = await API.put(`/cart/${bookId}`, { quantity })
      setCart(Array.isArray(data) ? data : [])
    } catch {
      // Revert on error
      fetchCart()
    } finally {
      updating.current = false
    }
  }

  // Remove single item
  const removeFromCart = async (bookId) => {
    // Optimistic
    setCart(prev => prev.filter(i => i.book?._id !== bookId))
    try {
      const { data } = await API.delete(`/cart/${bookId}`)
      setCart(Array.isArray(data) ? data : [])
    } catch {
      fetchCart()
    }
  }

  // Clear entire cart
  const clearCart = async () => {
    setCart([])    // immediate optimistic clear
    try {
      await API.delete('/cart/clear')
    } catch {
      fetchCart()  // revert if API fails
    }
  }

  const cartCount = cart.reduce((s, i) => s + (i.quantity || 0), 0)
  const cartTotal = cart.reduce((s, i) => s + ((i.book?.price || 0) * (i.quantity || 0)), 0)

  return (
    <CartContext.Provider value={{ cart, cartCount, cartTotal, cartLoading, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
