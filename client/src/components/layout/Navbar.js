import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cartCount }    = useCart()
  const nav = useNavigate()

  const handleLogout = () => { logout(); nav('/login') }

  return (
    <nav className="navbar">
      <div className="container nav-inner">

        <Link to="/" className="nav-logo">ShopEZ</Link>

        <div className="nav-links">
          <NavLink to="/"         className="nav-link">Home</NavLink>
          <NavLink to="/products" className="nav-link">Products</NavLink>
          
          <div className="nav-dropdown-wrapper">
            <span className="nav-link nav-dropdown-trigger">
              Categories <span className="arrow">▼</span>
            </span>
            <div className="nav-dropdown-menu">
              <Link to="/products?category=Clothing" className="nav-dropdown-item">Clothing</Link>
              <Link to="/products?category=Shoes" className="nav-dropdown-item">Shoes</Link>
              <Link to="/products?category=Sunglasses" className="nav-dropdown-item">Sunglasses</Link>
              <Link to="/products?category=Electronics" className="nav-dropdown-item">Electronics</Link>
              <Link to="/products?category=Accessories" className="nav-dropdown-item">Accessories</Link>
            </div>
          </div>

          {user && <NavLink to="/orders" className="nav-link">My Orders</NavLink>}
          {user?.usertype === 'admin' && <NavLink to="/admin" className="nav-link">Admin</NavLink>}
        </div>

        <div className="nav-right">
          {user ? (
            <>
              <Link to="/cart" className="cart-btn">
                🛒 Cart {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </Link>
              <span className="nav-user">{user.username}</span>
              <button className="btn sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn sm">Login</Link>
              <Link to="/register" className="btn sm dark">Register</Link>
            </>
          )}
        </div>

      </div>
    </nav>
  )
}
