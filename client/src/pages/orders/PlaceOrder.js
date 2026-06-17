import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import './Orders.css'

export default function PlaceOrder() {
  const { user }  = useAuth()
  const { cartItems, cartTotal, clearCart } = useCart()
  const nav = useNavigate()

  const [form, setForm] = useState({
    name: user?.username || '',
    mobile: '',
    email: user?.email || '',
    address: '',
    pincode: '',
    paymentMethod: 'cod'
  })
  const [placing, setPlacing] = useState(false)

  const f = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handlePlace = async (e) => {
    e.preventDefault()
    if (cartItems.length === 0) return toast.error('Cart is empty')
    setPlacing(true)
    try {
      // place one order per cart item
      for (const item of cartItems) {
        const discounted = item.price - (item.price * (item.discount || 0) / 100)
        await api.post('/orders', {
          ...form,
          title:       item.title,
          description: item.description,
          image:       item.mainImg,
          size:        item.size,
          quantity:    item.quantity,
          price:       discounted,
          discount:    item.discount || 0
        })
      }
      await clearCart()
      toast.success('Order placed successfully!')
      nav('/orders')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  if (cartItems.length === 0) {
    nav('/cart')
    return null
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title" style={{ marginBottom: 20 }}>Checkout</h1>

        <div className="checkout-layout">

          <form onSubmit={handlePlace} className="checkout-form">
            <div className="card">
              <div className="section-label">Delivery details</div>
              <div className="form-grid">
                <div>
                  <label className="label">Full name</label>
                  <input className="input" value={form.name} onChange={f('name')} required />
                </div>
                <div>
                  <label className="label">Mobile</label>
                  <input className="input" value={form.mobile} onChange={f('mobile')} required />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input className="input" type="email" value={form.email} onChange={f('email')} required />
                </div>
                <div>
                  <label className="label">Pincode</label>
                  <input className="input" value={form.pincode} onChange={f('pincode')} required />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label className="label">Address</label>
                  <textarea className="input" rows={3} value={form.address} onChange={f('address')} required style={{ resize: 'none' }} />
                </div>
              </div>
            </div>

            <div className="card" style={{ marginTop: 14 }}>
              <div className="section-label">Payment method</div>
              <div className="payment-options">
                {[['cod', 'Cash on delivery'], ['online', 'Online payment']].map(([val, label]) => (
                  <label key={val} className={`payment-opt ${form.paymentMethod === val ? 'active' : ''}`}>
                    <input type="radio" name="payment" value={val}
                      checked={form.paymentMethod === val} onChange={f('paymentMethod')} />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <button className="btn dark" style={{ width: '100%', justifyContent: 'center', padding: 11, marginTop: 14 }}
              disabled={placing}>
              {placing ? 'Placing order…' : 'Place order'}
            </button>
          </form>

          {/* Order summary */}
          <div className="card order-preview">
            <div className="section-label">Items ({cartItems.length})</div>
            {cartItems.map(item => {
              const d = item.price - (item.price * (item.discount || 0) / 100)
              return (
                <div key={item._id} className="preview-row">
                  <img src={item.mainImg} alt={item.title} className="preview-img" />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{item.title}</div>
                    {item.size && <div style={{ fontSize: 11, color: 'var(--muted)' }}>Size: {item.size}</div>}
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>Qty: {item.quantity}</div>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 13, marginLeft: 'auto' }}>
                    ₹{(d * item.quantity).toFixed(0)}
                  </div>
                </div>
              )
            })}
            <hr className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
              <span>Total</span>
              <span>₹{cartTotal.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
