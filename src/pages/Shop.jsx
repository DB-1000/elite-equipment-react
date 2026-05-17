import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'

const CATEGORIES = ['all', 'CPU', 'SSD', 'Keyboard']

export default function Shop() {
  const [products, setProducts] = useState([])
  const [filter, setFilter] = useState('all')
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const cat = searchParams.get('cat')
    if (cat && CATEGORIES.includes(cat)) setFilter(cat)
  }, [searchParams])

  useEffect(() => {
    let query = supabase.from('products').select('*').eq('active', true).order('id')
    if (filter !== 'all') query = query.eq('category', filter)
    query.then(({ data }) => { if (data) setProducts(data) })
  }, [filter])

  const title = filter === 'all' ? 'ALL PRODUCTS' : filter.toUpperCase() + 'S'

  return (
    <div style={{ paddingTop: '64px' }}>
      <div className="shop-layout">
        <aside className="shop-sidebar">
          <div className="sidebar-section">
            <div className="sidebar-label">Category</div>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`filter-btn${filter === cat ? ' active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat === 'all' ? 'All Products' : cat + 's'}
              </button>
            ))}
          </div>
        </aside>
        <div className="shop-main">
          <div className="shop-header">
            <div className="shop-title">{title}</div>
            <div className="product-count">{products.length} PRODUCTS</div>
          </div>
          <div className="product-grid">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
