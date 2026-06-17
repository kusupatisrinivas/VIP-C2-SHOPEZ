import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import toast from 'react-hot-toast'
import './Cart.css'

export default function Cart() {
  const { cartItems, cartTotal, updateItem, removeItem, clearCart, cartLoading } = useCart()
  const nav = useNavigate()

  const handleCheckout = () => {
    if (cartItems.length === 0) return toast.error('Cart is empty')
    nav('/orders/new')
  }

  if (cartLoading) return <div className="loading">Loading cart…</div>

  return (
    <div className="page">
      <div className="container">
        <div className="page-header-row">
          <h1 className="page-title">Cart ({cartItems.length})</h1>
          {cartItems.length > 0 && (
            <button className="btn sm" onClick={clearCart}>Clear all</button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
            <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>Your cart is empty</p>
            <button className="btn dark" onClick={() => nav('/products')}>Browse products</button>
          </div>
        ) : (
          <div className="cart-layout">

            <div className="cart-items">
              {cartItems.map(item => {
                const discounted = item.price - (item.price * (item.discount || 0) / 100)
                return (
                  <div key={item._id} className="cart-item">
                    <img src={item.mainImg} alt={item.title} className="cart-img" />
                    <div className="cart-item-info">
                      <div className="cart-item-title">{item.title}</div>
                      {item.size && <div className="cart-item-size">Size: {item.size}</div>}
                      <div className="cart-item-price">₹{discounted.toFixed(0)}</div>
                      <div className="cart-qty">
                        <button className="qty-btn" onClick={() => item.quantity > 1 ? updateItem(item._id, item.quantity - 1) : removeItem(item._id)}>−</button>
                        <span className="qty-val">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateItem(item._id, item.quantity + 1)}>+</button>
                      </div>
                    </div>
                    <div className="cart-item-total">
                      <div>₹{(discounted * item.quantity).toFixed(0)}</div>
                      <button className="btn sm danger" style={{ marginTop: 8 }} onClick={() => removeItem(item._id)}>Remove</button>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="cart-summary card">
              <div className="summary-title">Order summary</div>
              <div className="summary-row">
                <span>Items ({cartItems.length})</span>
                <span>₹{cartTotal.toFixed(0)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery</span>
                <span style={{ color: 'var(--green)' }}>Free</span>
              </div>
              <hr className="divider" />
              <div className="summary-row total-row">
                <span>Total</span>
                <span>₹{cartTotal.toFixed(0)}</span>
              </div>
              <button className="btn dark" style={{ width: '100%', justifyContent: 'center', padding: 10, marginTop: 14 }}
                onClick={handleCheckout}>
                Proceed to checkout
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
