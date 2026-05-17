import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', email: user?.email || '', address: '', city: '', state: '', zip: '',
    card: '', exp: '', cvv: ''
  })

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (cart.length === 0) return
    setLoading(true)

    if (user) {
      const { data: order } = await supabase.from('orders').insert({
        user_id: user.id,
        user_email: user.email,
        total: cartTotal,
        status: 'pending',
        shipping_name: form.name,
        shipping_address: form.address,
        shipping_city: form.city,
        shipping_state: form.state,
        shipping_zip: form.zip,
      }).select().single()

      if (order) {
        await supabase.from('order_items').insert(
          cart.map(item => ({
            order_id: order.id,
            product_id: item.id,
            product_name: item.name,
            product_price: item.price,
            product_image: item.image,
            quantity: item.qty,
          }))
        )
      }
    }

    setLoading(false)
    clearCart()
    setSuccess(true)
  }

  if (success) {
    return (
      <div style={{ paddingTop: '64px' }}>
        <div className="order-success">
          <div className="order-success-icon">✓</div>
          <div className="order-success-title">ORDER PLACED</div>
          <p className="order-success-sub">Your order has been confirmed. You'll receive tracking info when your items ship.{!user && ' Sign in to track your orders.'}</p>
          <button className="btn-primary" onClick={() => navigate('/shop')}>CONTINUE SHOPPING</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: '64px' }}>
      <div className="checkout-layout">
        <div className="checkout-form-col">
          <div className="checkout-title">CHECKOUT</div>
          <form onSubmit={handleSubmit}>
            <div className="co-section">
              <div className="co-section-title">Contact</div>
              <div className="form-field">
                <label>Full Name</label>
                <input value={form.name} onChange={set('name')} required placeholder="John Doe" />
              </div>
              <div className="form-field">
                <label>Email</label>
                <input type="email" value={form.email} onChange={set('email')} required placeholder="you@example.com" />
              </div>
            </div>
            <div className="co-section">
              <div className="co-section-title">Shipping Address</div>
              <div className="form-field">
                <label>Street Address</label>
                <input value={form.address} onChange={set('address')} required placeholder="123 Main St" />
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label>City</label>
                  <input value={form.city} onChange={set('city')} required placeholder="New York" />
                </div>
                <div className="form-field">
                  <label>State</label>
                  <input value={form.state} onChange={set('state')} required placeholder="NY" />
                </div>
              </div>
              <div className="form-field">
                <label>ZIP Code</label>
                <input value={form.zip} onChange={set('zip')} required placeholder="10001" />
              </div>
            </div>
            <div className="co-section">
              <div className="co-section-title">Payment</div>
              <div className="form-field">
                <label>Card Number</label>
                <input value={form.card} onChange={set('card')} required placeholder="1234 5678 9012 3456" maxLength={19} />
              </div>
              <div className="card-row">
                <div className="form-field">
                  <label>Expiry</label>
                  <input value={form.exp} onChange={set('exp')} required placeholder="MM/YY" maxLength={5} />
                </div>
                <div className="form-field">
                  <label>CVV</label>
                  <input value={form.cvv} onChange={set('cvv')} required placeholder="123" maxLength={4} />
                </div>
              </div>
            </div>
            <button className="btn-primary" type="submit" style={{ width: '100%' }} disabled={loading || cart.length === 0}>
              {loading ? 'PROCESSING...' : `PLACE ORDER — $${cartTotal}`}
            </button>
          </form>
        </div>
        <div className="checkout-summary-col">
          <div className="co-section-title" style={{ marginBottom: '1.5rem' }}>ORDER SUMMARY</div>
          {cart.map(item => (
            <div className="summary-item" key={item.id}>
              <span className="summary-item-name">{item.name} × {item.qty}</span>
              <span className="summary-item-price">${item.price * item.qty}</span>
            </div>
          ))}
          <div className="summary-item" style={{ borderBottom: 'none', marginTop: '1rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>TOTAL</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>${cartTotal}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
