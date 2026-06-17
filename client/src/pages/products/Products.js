import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import './Products.css'

export default function Products() {
  const [products,   setProducts]   = useState([])
  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [params, setParams]         = useSearchParams()
  const nav = useNavigate()

  const category = params.get('category') || ''
  const gender   = params.get('gender') || ''
  const search   = params.get('search') || ''

  useEffect(() => {
    setLoading(true)
    const q = new URLSearchParams()
    if (category) q.set('category', category)
    if (gender)   q.set('gender', gender)
    if (search)   q.set('search', search)

    api.get(`/products?${q}`).then(r => setProducts(r.data))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false))
  }, [category, gender, search])

  useEffect(() => {
    api.get('/admin/categories').then(r => setCategories(r.data)).catch(() => {})
  }, [])

  const setFilter = (key, val) => {
    const p = new URLSearchParams(params)
    if (val) p.set(key, val); else p.delete(key)
    setParams(p)
  }

  return (
    <div className="page">
      <div className="container">
        <div className="products-layout">

          {/* Filters sidebar */}
          <aside className="filters">
            <div className="filter-title">Filters</div>

            <div className="filter-group">
              <div className="filter-label">Search</div>
              <input className="input" placeholder="Search products…"
                value={search}
                onChange={e => setFilter('search', e.target.value)} />
            </div>

            <div className="filter-group">
              <div className="filter-label">Category</div>
              <div className="filter-options">
                <div className={`filter-opt ${!category ? 'active' : ''}`} onClick={() => setFilter('category', '')}>All</div>
                {categories.filter(c => c.isActive).map(c => (
                  <div key={c._id} className={`filter-opt ${category === c.name ? 'active' : ''}`}
                    onClick={() => setFilter('category', c.name)}>
                    {c.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <div className="filter-label">Gender</div>
              <div className="filter-options">
                {['', 'men', 'women', 'unisex', 'kids'].map(g => (
                  <div key={g} className={`filter-opt ${gender === g ? 'active' : ''}`}
                    onClick={() => setFilter('gender', g)}>
                    {g || 'All'}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Products grid */}
          <div className="products-main">
            <div className="products-header">
              <span className="page-sub">{products.length} products found</span>
            </div>

            {loading ? <div className="loading">Loading…</div> : (
              <div className="products-grid-2">
                {products.length === 0 ? (
                  <div style={{ color: 'var(--muted)', fontSize: 13, gridColumn: '1/-1', padding: '40px 0' }}>
                    No products found
                  </div>
                ) : products.map(p => {
                  const discounted = p.price - (p.price * p.discount / 100)
                  return (
                    <div key={p._id} className="product-card" onClick={() => nav(`/products/${p._id}`)}>
                      <div className="product-img-wrap">
                        <img src={p.mainImg} alt={p.title} />
                        {p.discount > 0 && <span className="discount-badge">{p.discount}% OFF</span>}
                      </div>
                      <div className="product-info">
                        <div className="product-category">{p.category}</div>
                        <div className="product-title">{p.title}</div>
                        {p.rating && (
                          <div className="product-rating">
                            {"⭐".repeat(Math.round(p.rating))} {p.rating.toFixed(1)}
                          </div>
                        )}
                        <div className="product-price">
                          ₹{discounted.toFixed(0)}
                          {p.discount > 0 && <span className="original-price">₹{p.price}</span>}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
