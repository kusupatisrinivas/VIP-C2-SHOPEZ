import { useEffect, useState } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import './Orders.css'

const STATUS_COLORS = {
  pending:    'neutral',
  processing: 'neutral',
  shipped:    'neutral',
  delivered:  'green',
  cancelled:  'red'
}

export default function Orders() {
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = () => {
    api.get('/orders').then(r => setOrders(r.data)).catch(() => toast.error('Failed to load orders')).finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [])

  const cancel = async (id) => {
    try {
      await api.put(`/orders/${id}/cancel`)
      toast.success('Order cancelled')
      fetchOrders()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel')
    }
  }

  if (loading) return <div className="loading">Loading orders…</div>

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title" style={{ marginBottom: 20 }}>My Orders</h1>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>📦</div>
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(o => (
              <div key={o._id} className="order-card card">
                <div className="order-header">
                  <div>
                    <div className="order-id">Order #{o._id.slice(-8).toUpperCase()}</div>
                    <div className="order-date">{new Date(o.orderDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</div>
                  </div>
                  <span className={`badge ${STATUS_COLORS[o.status] || 'neutral'}`}>{o.status}</span>
                </div>

                <div className="order-item-row">
                  {o.image && <img src={o.image} alt={o.title} className="order-img" />}
                  <div>
                    <div style={{ fontWeight: 500, marginBottom: 2 }}>{o.title}</div>
                    {o.size && <div style={{ fontSize: 12, color: 'var(--muted)' }}>Size: {o.size}</div>}
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>Qty: {o.quantity}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', fontWeight: 600, fontSize: 15 }}>
                    ₹{(o.price * o.quantity).toFixed(0)}
                  </div>
                </div>

                <div className="order-footer">
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                    Delivery by {new Date(o.deliveryDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })} · {o.paymentMethod.toUpperCase()}
                  </div>
                  {o.status === 'pending' && (
                    <button className="btn sm danger" onClick={() => cancel(o._id)}>Cancel</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
