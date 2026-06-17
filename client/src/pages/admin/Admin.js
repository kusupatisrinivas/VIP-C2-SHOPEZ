import { useEffect, useState } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import './Admin.css'

const TABS = ['overview', 'products', 'orders', 'categories', 'banners', 'users']

export default function Admin() {
  const [tab,     setTab]     = useState('overview')
  const [stats,   setStats]   = useState(null)
  const [products, setProducts] = useState([])
  const [orders,   setOrders]   = useState([])
  const [cats,     setCats]     = useState([])
  const [banners,  setBanners]  = useState([])
  const [users,    setUsers]    = useState([])

  // New product form
  const [newProduct, setNewProduct] = useState({
    title: '', description: '', mainImg: '', category: '', gender: 'unisex',
    price: '', discount: 0, sizes: ''
  })

  // New category / banner
  const [newCat,    setNewCat]    = useState({ name: '', image: '' })
  const [newBanner, setNewBanner] = useState({ image: '', title: '' })

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    if (tab === 'products')   api.get('/products').then(r => setProducts(r.data)).catch(() => {})
    if (tab === 'orders')     api.get('/orders/all').then(r => setOrders(r.data)).catch(() => {})
    if (tab === 'categories') api.get('/admin/categories').then(r => setCats(r.data)).catch(() => {})
    if (tab === 'banners')    api.get('/admin/banners').then(r => setBanners(r.data)).catch(() => {})
    if (tab === 'users')      api.get('/admin/users').then(r => setUsers(r.data)).catch(() => {})
  }, [tab])

  const addProduct = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...newProduct,
        price:    Number(newProduct.price),
        discount: Number(newProduct.discount),
        sizes:    newProduct.sizes.split(',').map(s => s.trim()).filter(Boolean)
      }
      await api.post('/products', payload)
      toast.success('Product added')
      setNewProduct({ title: '', description: '', mainImg: '', category: '', gender: 'unisex', price: '', discount: 0, sizes: '' })
      api.get('/products').then(r => setProducts(r.data))
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  const deleteProduct = async (id) => {
    if (!window.confirm('Remove this product?')) return
    await api.delete(`/products/${id}`)
    setProducts(prev => prev.filter(p => p._id !== id))
    toast.success('Product removed')
  }

  const updateOrderStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status })
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o))
    toast.success('Status updated')
  }

  const addCategory = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/admin/categories', newCat)
      setCats(prev => [data, ...prev])
      setNewCat({ name: '', image: '' })
      toast.success('Category added')
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  const deleteCat = async (id) => {
    await api.delete(`/admin/categories/${id}`)
    setCats(prev => prev.filter(c => c._id !== id))
    toast.success('Category deleted')
  }

  const addBanner = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/admin/banners', newBanner)
      setBanners(prev => [data, ...prev])
      setNewBanner({ image: '', title: '' })
      toast.success('Banner added')
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  const deleteBanner = async (id) => {
    await api.delete(`/admin/banners/${id}`)
    setBanners(prev => prev.filter(b => b._id !== id))
    toast.success('Banner deleted')
  }

  const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title" style={{ marginBottom: 16 }}>Admin Panel</h1>

        {/* Stats */}
        {stats && (
          <div className="admin-stats">
            {[
              { label: 'Users',      val: stats.users },
              { label: 'Products',   val: stats.products },
              { label: 'Orders',     val: stats.orders },
              { label: 'Categories', val: stats.categories },
              { label: 'Revenue',    val: `₹${Number(stats.revenue).toLocaleString('en-IN')}` }
            ].map(s => (
              <div key={s.label} className="stat-card card">
                <div className="stat-label">{s.label}</div>
                <div className="stat-val">{s.val}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="admin-tabs">
          {TABS.map(t => (
            <button key={t} className={`admin-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* ── Overview ── */}
        {tab === 'overview' && (
          <div className="card" style={{ color: 'var(--muted)', textAlign: 'center', padding: 40 }}>
            <p style={{ fontSize: 15, marginBottom: 6 }}>Welcome, Admin</p>
            <p style={{ fontSize: 13 }}>Use the tabs above to manage products, orders, categories and banners.</p>
          </div>
        )}

        {/* ── Products ── */}
        {tab === 'products' && (
          <div>
            <form onSubmit={addProduct} className="card add-form">
              <div className="section-label" style={{ marginBottom: 14 }}>Add new product</div>
              <div className="form-grid-3">
                <div><label className="label">Title</label><input className="input" value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} required /></div>
                <div><label className="label">Category</label><input className="input" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} required /></div>
                <div>
                  <label className="label">Gender</label>
                  <select className="input" value={newProduct.gender} onChange={e => setNewProduct({...newProduct, gender: e.target.value})}>
                    {['men','women','unisex','kids'].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div><label className="label">Price (₹)</label><input className="input" type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required /></div>
                <div><label className="label">Discount (%)</label><input className="input" type="number" min="0" max="100" value={newProduct.discount} onChange={e => setNewProduct({...newProduct, discount: e.target.value})} /></div>
                <div><label className="label">Sizes (comma-separated)</label><input className="input" placeholder="S, M, L, XL" value={newProduct.sizes} onChange={e => setNewProduct({...newProduct, sizes: e.target.value})} /></div>
                <div style={{ gridColumn: '1/-1' }}><label className="label">Main image URL</label><input className="input" value={newProduct.mainImg} onChange={e => setNewProduct({...newProduct, mainImg: e.target.value})} required /></div>
                <div style={{ gridColumn: '1/-1' }}><label className="label">Description</label><textarea className="input" rows={2} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} required style={{ resize: 'none' }} /></div>
              </div>
              <button className="btn dark" style={{ marginTop: 12 }}>Add product</button>
            </form>

            <div className="card" style={{ marginTop: 14 }}>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Product</th><th>Category</th><th style={{ textAlign:'right' }}>Price</th><th style={{ textAlign:'right' }}>Discount</th><th></th></tr></thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p._id}>
                        <td>
                          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                            {p.mainImg && <img src={p.mainImg} alt="" style={{ width:40, height:40, objectFit:'cover', borderRadius:5 }} />}
                            <span style={{ fontWeight:500 }}>{p.title}</span>
                          </div>
                        </td>
                        <td style={{ color:'var(--muted)' }}>{p.category}</td>
                        <td style={{ textAlign:'right' }}>₹{p.price}</td>
                        <td style={{ textAlign:'right' }}>{p.discount}%</td>
                        <td><button className="btn sm danger" onClick={() => deleteProduct(p._id)}>Remove</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Orders ── */}
        {tab === 'orders' && (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead><tr><th>User</th><th>Product</th><th>Qty</th><th style={{ textAlign:'right' }}>Total</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id}>
                      <td>{o.userId?.username || o.name}</td>
                      <td style={{ maxWidth:180 }}>{o.title}</td>
                      <td>{o.quantity}</td>
                      <td style={{ textAlign:'right', fontWeight:500 }}>₹{(o.price * o.quantity).toFixed(0)}</td>
                      <td style={{ fontSize:12, color:'var(--muted)' }}>{new Date(o.orderDate).toLocaleDateString('en-IN')}</td>
                      <td>
                        <select className="input" style={{ padding:'4px 8px', fontSize:12, width:'auto' }}
                          value={o.status} onChange={e => updateOrderStatus(o._id, e.target.value)}>
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Categories ── */}
        {tab === 'categories' && (
          <div>
            <form onSubmit={addCategory} className="card add-form">
              <div className="section-label" style={{ marginBottom: 12 }}>Add category</div>
              <div style={{ display:'flex', gap:12 }}>
                <div style={{ flex:1 }}><label className="label">Name</label><input className="input" value={newCat.name} onChange={e => setNewCat({...newCat, name: e.target.value})} required /></div>
                <div style={{ flex:2 }}><label className="label">Image URL (optional)</label><input className="input" value={newCat.image} onChange={e => setNewCat({...newCat, image: e.target.value})} /></div>
              </div>
              <button className="btn dark" style={{ marginTop:12 }}>Add</button>
            </form>
            <div className="card" style={{ marginTop:14 }}>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Name</th><th>Image</th><th>Status</th><th></th></tr></thead>
                  <tbody>
                    {cats.map(c => (
                      <tr key={c._id}>
                        <td style={{ fontWeight:500 }}>{c.name}</td>
                        <td>{c.image ? <img src={c.image} alt="" style={{ width:36, height:36, objectFit:'cover', borderRadius:4 }} /> : '—'}</td>
                        <td><span className={`badge ${c.isActive ? 'green' : 'red'}`}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
                        <td><button className="btn sm danger" onClick={() => deleteCat(c._id)}>Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Banners ── */}
        {tab === 'banners' && (
          <div>
            <form onSubmit={addBanner} className="card add-form">
              <div className="section-label" style={{ marginBottom: 12 }}>Add banner</div>
              <div style={{ display:'flex', gap:12 }}>
                <div style={{ flex:2 }}><label className="label">Image URL</label><input className="input" value={newBanner.image} onChange={e => setNewBanner({...newBanner, image: e.target.value})} required /></div>
                <div style={{ flex:1 }}><label className="label">Title (optional)</label><input className="input" value={newBanner.title} onChange={e => setNewBanner({...newBanner, title: e.target.value})} /></div>
              </div>
              <button className="btn dark" style={{ marginTop:12 }}>Add</button>
            </form>
            <div className="card" style={{ marginTop:14 }}>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Preview</th><th>Title</th><th></th></tr></thead>
                  <tbody>
                    {banners.map(b => (
                      <tr key={b._id}>
                        <td><img src={b.image} alt="" style={{ width:120, height:50, objectFit:'cover', borderRadius:4 }} /></td>
                        <td>{b.title || '—'}</td>
                        <td><button className="btn sm danger" onClick={() => deleteBanner(b._id)}>Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Users ── */}
        {tab === 'users' && (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead><tr><th>Username</th><th>Email</th><th>Joined</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td style={{ fontWeight:500 }}>{u.username}</td>
                      <td style={{ color:'var(--muted)' }}>{u.email}</td>
                      <td style={{ fontSize:12, color:'var(--muted)' }}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
