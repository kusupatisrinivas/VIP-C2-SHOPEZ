import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import './Home.css'

export default function Home() {
  const [featured,   setFeatured]   = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const nav = useNavigate()

  useEffect(() => {
    api.get('/products').then(r => setFeatured(r.data.slice(0, 12))).catch(() => {})
  }, [])

  const displayCategories = [
    { name: "Clothing", icon: "👕", link: "/products?category=Clothing" },
    { name: "Shoes", icon: "👟", link: "/products?category=Shoes" },
    { name: "Sunglasses", icon: "🕶️", link: "/products?category=Sunglasses" },
    { name: "Electronics", icon: "🔌", link: "/products?category=Electronics" },
    { name: "Accessories", icon: "👜", link: "/products?category=Accessories" }
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      nav(`/products?search=${encodeURIComponent(searchTerm.trim())}`)
    } else {
      nav('/products')
    }
  }

  return (
    <div>
      {/* Search Bar Section */}
      <div className="home-search-section">
        <div className="container">
          <form onSubmit={handleSearch} className="home-search-form">
            <input
              type="text"
              className="input home-search-input"
              placeholder="Search for products, categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="btn dark home-search-btn">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Categories Row */}
      <div className="categories-row-section">
        <div className="container">
          <div className="categories-pills-container">
            {displayCategories.map(cat => (
              <div key={cat.name} className="category-pill" onClick={() => nav(cat.link)}>
                <span className="category-pill-icon">{cat.icon}</span>
                <span className="category-pill-name">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container">
        {/* Featured Products */}
        {featured.length > 0 && (
          <section className="home-section">
            <h2 className="section-heading">Featured Products</h2>
            <div className="products-grid">
              {featured.map(p => {
                const discountedPrice = p.price - (p.price * p.discount / 100)
                return (
                  <div key={p._id} className="product-card" onClick={() => nav(`/products/${p._id}`)}>
                    <div className="product-img-wrap">
                      <img src={p.mainImg} alt={p.title} />
                      {p.discount > 0 && <span className="discount-badge">{p.discount}% OFF</span>}
                    </div>
                    <div className="product-info">
                      <div className="product-title">{p.title}</div>
                      {p.rating && (
                        <div className="product-rating">
                          {"⭐".repeat(Math.round(p.rating))} {p.rating.toFixed(1)}
                        </div>
                      )}
                      <div className="product-price">
                        ₹{discountedPrice.toFixed(0)}
                        {p.discount > 0 && <span className="original-price">₹{p.price}</span>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {featured.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--muted)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🛍️</div>
            <p style={{ fontSize: 16, fontWeight: 500, marginBottom: 6 }}>Welcome to ShopEZ</p>
            <p style={{ fontSize: 13 }}>No products yet. Admin can add products, banners and categories.</p>
          </div>
        )}
      </div>
    </div>
  )
}
