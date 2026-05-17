import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { cart, cartOpen, setCartOpen, removeFromCart, cartTotal } = useCart()
  const navigate = useNavigate()

  const goToCheckout = () => {
    setCartOpen(false)
    navigate('/checkout')
  }

  return (
    <>
      <div className={`cart-overlay${cartOpen ? ' open' : ''}`} onClick={() => setCartOpen(false)} />
      <div className={`cart-drawer${cartOpen ? ' open' : ''}`}>
        <div className="cart-drawer-header">
          <div className="cart-drawer-title">CART</div>
          <button className="close-btn" onClick={() => setCartOpen(false)}>×</button>
        </div>
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">// NO ITEMS YET.</div>
          ) : (
            cart.map(item => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-icon">
                  {item.image && <img src={item.image} alt={item.name} loading="lazy" />}
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">${item.price}</div>
                  <div className="cart-item-qty">Qty: {item.qty}</div>
                </div>
                <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>×</button>
              </div>
            ))
          )}
        </div>
        <div className="cart-footer">
          <div className="cart-total">
            <span className="cart-total-label">TOTAL</span>
            <span className="cart-total-amount">${cartTotal}</span>
          </div>
          <button className="btn-primary" style={{ width: '100%' }} onClick={goToCheckout} disabled={cart.length === 0}>
            CHECKOUT →
          </button>
        </div>
      </div>
    </>
  )
}
