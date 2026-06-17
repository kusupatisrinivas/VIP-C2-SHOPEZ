import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar       from './components/layout/Navbar'
import Login        from './pages/auth/Login'
import Register     from './pages/auth/Register'
import Home         from './pages/home/Home'
import Products     from './pages/products/Products'
import ProductDetail from './pages/products/ProductDetail'
import Cart         from './pages/cart/Cart'
import Orders       from './pages/orders/Orders'
import PlaceOrder   from './pages/orders/PlaceOrder'
import Admin        from './pages/admin/Admin'

function Protected({ children, adminOnly = false }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading">Loading…</div>
  if (!user)   return <Navigate to="/login" replace />
  if (adminOnly && user.usertype !== 'admin') return <Navigate to="/" replace />
  return children
}

function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

function AppRoutes() {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading">Loading…</div>

  return (
    <Routes>
      <Route path="/login"    element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />

      <Route path="/"          element={<Layout><Home /></Layout>} />
      <Route path="/products"  element={<Layout><Products /></Layout>} />
      <Route path="/products/:id" element={<Layout><ProductDetail /></Layout>} />

      <Route path="/cart"   element={<Protected><Layout><Cart /></Layout></Protected>} />
      <Route path="/orders" element={<Protected><Layout><Orders /></Layout></Protected>} />
      <Route path="/orders/new" element={<Protected><Layout><PlaceOrder /></Layout></Protected>} />

      <Route path="/admin"  element={<Protected adminOnly><Layout><Admin /></Layout></Protected>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: { background: '#fff', color: '#111', border: '1px solid #e5e5e5', fontSize: 13 },
              success: { iconTheme: { primary: '#2e7d32', secondary: '#fff' } },
              error:   { iconTheme: { primary: '#e53935', secondary: '#fff' } }
            }}
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
