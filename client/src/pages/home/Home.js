import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import './Home.css'

export default function Home() {
  const [featured,   setFeatured]   = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [wishlist,   setWishlist]   = useState(() => {
    try {
      const saved = localStorage.getItem('shopez_wishlist')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const nav = useNavigate()

  useEffect(() => {
    api.get('/products').then(r => setFeatured(r.data.slice(0, 8))).catch(() => {})
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      nav(`/products?search=${encodeURIComponent(searchTerm.trim())}`)
    } else {
      nav('/products')
    }
  }

  const toggleWishlist = (e, productId) => {
    e.stopPropagation()
    let updated
    if (wishlist.includes(productId)) {
      updated = wishlist.filter(id => id !== productId)
      toast.success('Removed from wishlist')
    } else {
      updated = [...wishlist, productId]
      toast.success('Added to wishlist')
    }
    setWishlist(updated)
    localStorage.setItem('shopez_wishlist', JSON.stringify(updated))
  }

  return (
    <div className="home-wrapper">
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

      {/* Premium Hero Section */}
      <div className="container" style={{ marginTop: '24px' }}>
        <div className="premium-hero-container">
          {/* Full-width content area */}
          <div className="hero-content-area">
            <span className="hero-badge">New Arrivals</span>
            <h1 className="hero-heading">Shop Smarter with ShopEZ</h1>
            <p className="hero-subtitle">Explore the best curated collection of lifestyle products.</p>
            
            <button className="btn dark hero-cta-btn" onClick={() => nav('/products')}>
              Shop Now
            </button>

            {/* Feature Chips */}
            <div className="hero-feature-chips">
              <div className="feature-chip">
                <svg className="chip-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>Premium Quality</span>
              </div>
              <div className="feature-chip">
                <svg className="chip-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>Fast Delivery</span>
              </div>
              <div className="feature-chip">
                <svg className="chip-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>Easy Returns</span>
              </div>
              <div className="feature-chip">
                <svg className="chip-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="container">
        {featured.length > 0 && (
          <section className="home-section featured-picks-section">
            <div className="picks-header">
              <span className="picks-label">OUR PICKS</span>
              <h2 className="picks-title">Featured Products</h2>
            </div>
            
            <div className="products-grid">
              {featured.map(p => {
                const discountedPrice = p.price - (p.price * p.discount / 100)
                const isWishlisted = wishlist.includes(p._id)
                return (
                  <div key={p._id} className="product-card premium-product-card" onClick={() => nav(`/products/${p._id}`)}>
                    <div className="product-img-wrap">
                      <img src={p.mainImg} alt={p.title} />
                      {p.discount > 0 && <span className="discount-badge">{p.discount}% OFF</span>}
                      
                      {/* Wishlist Icon */}
                      <button 
                        className={`wishlist-btn ${isWishlisted ? 'active' : ''}`} 
                        onClick={(e) => toggleWishlist(e, p._id)}
                        aria-label="Toggle Wishlist"
                      >
                        <svg 
                          className="wishlist-icon" 
                          fill={isWishlisted ? '#ef4444' : 'none'} 
                          stroke={isWishlisted ? '#ef4444' : 'currentColor'} 
                          viewBox="0 0 24 24" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="product-info">
                      <div className="product-title">{p.title}</div>
                      {p.rating && (
                        <div className="product-rating">
                          {"⭐".repeat(Math.round(p.rating))} {p.rating.toFixed(1)}
                        </div>
                      )}
                      <div className="product-price-row">
                        <span className="price-tag">₹{discountedPrice.toFixed(0)}</span>
                        {p.discount > 0 && <span className="original-price-tag">₹{p.price}</span>}
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
            <p style={{ fontSize: 13 }}>No products yet. Admin can add products.</p>
          </div>
        )}
      </div>
    </div>
  )
}
