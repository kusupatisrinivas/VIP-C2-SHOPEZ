import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [cartLoading, setCartLoading] = useState(false)

  const fetchCart = async () => {
    if (!user) return setCartItems([])
    setCartLoading(true)
    try {
      const { data } = await api.get('/cart')
      setCartItems(data)
    } catch { setCartItems([]) }
    finally { setCartLoading(false) }
  }

  useEffect(() => { fetchCart() }, [user])

  const addToCart = async (productId, size, quantity = 1) => {
    const { data } = await api.post('/cart', { productId, size, quantity })
    await fetchCart()
    return data
  }

  const updateItem = async (id, quantity) => {
    await api.put(`/cart/${id}`, { quantity })
    await fetchCart()
  }

  const removeItem = async (id) => {
    await api.delete(`/cart/${id}`)
    setCartItems(prev => prev.filter(i => i._id !== id))
  }

  const clearCart = async () => {
    await api.delete('/cart')
    setCartItems([])
  }

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0)
  const cartTotal = cartItems.reduce((sum, i) => {
    const discounted = i.price - (i.price * (i.discount || 0) / 100)
    return sum + discounted * i.quantity
  }, 0)

  return (
    <CartContext.Provider value={{ cartItems, cartLoading, cartCount, cartTotal, addToCart, updateItem, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
