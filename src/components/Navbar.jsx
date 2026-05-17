import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

export default function Navbar() {
  const { user, signIn, signUp, signOut, isAdmin } = useAuth()
  const { cartCount, setCartOpen } = useCart()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)
  const [tab, setTab] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const openModal = (t = 'signin') => { setTab(t); setError(''); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEmail(''); setPassword(''); setError('') }

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = tab === 'signin'
      ? await signIn(email, password)
      : await signUp(email, password)
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      closeModal()
      showToast(tab === 'signin' ? 'Welcome back!' : 'Account created! Check your email to confirm.')
    }
  }

  const handleSignOut = async () => {
    await signOut()
    showToast('Signed out')
    navigate('/')
  }

  return (
    <>
      <nav>
        <Link className="nav-logo" to="/">ELITE<span>.</span>EQUIPMENT</Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          {user && <Link to="/account">Account</Link>}
          {isAdmin && <Link to="/admin">Admin</Link>}
        </div>
        <div className="nav-actions">
          <button className="cart-btn" onClick={() => setCartOpen(true)}>
            CART {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
          {user ? (
            <button className="user-btn" onClick={handleSignOut}>SIGN OUT</button>
          ) : (
            <button className="user-btn" onClick={() => openModal('signin')}>SIGN IN</button>
          )}
        </div>
      </nav>

      {modalOpen && (
        <div className="modal-overlay open" onClick={closeModal}>
          <div className="signin-modal-box" onClick={e => e.stopPropagation()}>
            <div className="signin-tabs">
              <button className={`signin-tab${tab === 'signin' ? ' active' : ''}`} onClick={() => { setTab('signin'); setError('') }}>Sign In</button>
              <button className={`signin-tab${tab === 'signup' ? ' active' : ''}`} onClick={() => { setTab('signup'); setError('') }}>Create Account</button>
            </div>
            <form onSubmit={handleAuth}>
              <div className="form-field">
                <label>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" autoFocus />
              </div>
              <div className="form-field">
                <label>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" minLength={6} />
              </div>
              {error && <p style={{ color: 'var(--red)', fontSize: '13px', marginBottom: '1rem' }}>{error}</p>}
              <button className="btn-primary" type="submit" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'LOADING...' : tab === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
