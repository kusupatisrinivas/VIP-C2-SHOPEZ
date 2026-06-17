import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import './ProductDetail.css'

export default function ProductDetail() {
  const { id } = useParams()
  const [product,      setProduct]      = useState(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [mainImg,      setMainImg]      = useState('')
  const [loading,      setLoading]      = useState(true)
  const [adding,       setAdding]       = useState(false)
  const { user } = useAuth()
  const { addToCart } = useCart()
  const nav = useNavigate()

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(r => { setProduct(r.data); setMainImg(r.data.mainImg) })
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = async () => {
    if (!user) return nav('/login')
    if (product.sizes?.length > 0 && !selectedSize)
      return toast.error('Please select a size')
    setAdding(true)
    try {
      await addToCart(product._id, selectedSize)
      toast.success('Added to cart!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart')
    } finally {
      setAdding(false)
    }
  }

  const handleBuyNow = async () => {
    if (!user) return nav('/login')
    if (product.sizes?.length > 0 && !selectedSize)
      return toast.error('Please select a size')
    await handleAddToCart()
    nav('/cart')
  }

  if (loading) return <div className="loading">Loading…</div>
  if (!product) return <div className="loading">Product not found</div>

  const discounted = product.price - (product.price * product.discount / 100)

  return (
    <div className="page">
      <div className="container">
        <div className="detail-grid">

          {/* Images */}
          <div className="detail-images">
            <div className="main-img-wrap">
              <img src={mainImg} alt={product.title} className="main-img" />
              {product.discount > 0 && <span className="discount-badge">{product.discount}% OFF</span>}
            </div>
            {product.carousel?.length > 0 && (
              <div className="carousel-thumbs">
                <img src={product.mainImg} alt="main"
                  className={`thumb ${mainImg === product.mainImg ? 'active' : ''}`}
                  onClick={() => setMainImg(product.mainImg)} />
                {product.carousel.map((img, i) => (
                  <img key={i} src={img} alt={`carousel-${i}`}
                    className={`thumb ${mainImg === img ? 'active' : ''}`}
                    onClick={() => setMainImg(img)} />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="detail-info">
            <div className="detail-category">{product.category} · {product.gender}</div>
            <h1 className="detail-title">{product.title}</h1>

            {product.rating && (
              <div className="detail-rating">
                {"⭐".repeat(Math.round(product.rating))} {product.rating.toFixed(1)}
              </div>
            )}

            <div className="detail-price">
              ₹{discounted.toFixed(0)}
              {product.discount > 0 && (
                <>
                  <span className="original-price">₹{product.price}</span>
                  <span className="saving">You save ₹{(product.price - discounted).toFixed(0)}</span>
                </>
              )}
            </div>

            <p className="detail-desc">{product.description}</p>

            {product.sizes?.length > 0 && (
              <div className="size-section">
                <div className="size-label">Size</div>
                <div className="size-options">
                  {product.sizes.map(s => (
                    <button key={s}
                      className={`size-btn ${selectedSize === s ? 'active' : ''}`}
                      onClick={() => setSelectedSize(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="detail-actions">
              <button className="btn outline" style={{ flex: 1 }} onClick={handleAddToCart} disabled={adding}>
                {adding ? 'Adding…' : 'Add to cart'}
              </button>
              <button className="btn dark" style={{ flex: 1 }} onClick={handleBuyNow}>
                Buy now
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
