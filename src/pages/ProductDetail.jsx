import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { showToast } = useToast()
  const [product, setProduct] = useState(null)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    supabase.from('products').select('*').eq('id', id).single().then(({ data }) => {
      if (data) setProduct(data)
      else navigate('/shop')
    })
  }, [id, navigate])

  if (!product) return null

  const specs = typeof product.specs === 'string' ? JSON.parse(product.specs) : (product.specs || {})

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(product)
    showToast(`${product.name} added to cart`)
  }

  return (
    <div style={{ paddingTop: '64px' }}>
      <div className="product-detail">
        <div className="product-detail-img">
          {product.image && <img src={product.image} alt={product.name} />}
        </div>
        <div className="product-detail-info">
          <div className="product-detail-cat">{product.category}</div>
          <div className="product-detail-name">{product.name}</div>
          <div className="product-detail-price">${product.price}</div>
          <p className="product-detail-desc">{product.description}</p>
          <div className="product-specs">
            {Object.entries(specs).map(([k, v]) => (
              <div className="spec-row" key={k}>
                <span className="spec-key">{k}</span>
                <span className="spec-val">{v}</span>
              </div>
            ))}
          </div>
          <div className="qty-row">
            <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
            <span className="qty-display">{qty}</span>
            <button className="qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
          </div>
          <button className="btn-primary" onClick={handleAdd}>ADD TO CART →</button>
          <div style={{ marginTop: '1rem' }}>
            <button className="btn-ghost" onClick={() => navigate('/shop')} style={{ fontSize: '12px', padding: '0.6rem 1.2rem' }}>← BACK TO SHOP</button>
          </div>
        </div>
      </div>
    </div>
  )
}
