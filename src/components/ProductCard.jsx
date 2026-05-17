import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleAdd = (e) => {
    e.stopPropagation()
    addToCart(product)
    showToast(`${product.name} added to cart`)
  }

  return (
    <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="product-img-wrap">
        {product.image && <img src={product.image} alt={product.name} loading="lazy" />}
      </div>
      <div className="product-category">{product.category}</div>
      <div className="product-name">{product.name}</div>
      <div className="product-footer">
        <div className="product-price">${product.price}</div>
        <button className="add-to-cart" onClick={handleAdd}>+ ADD</button>
      </div>
    </div>
  )
}
