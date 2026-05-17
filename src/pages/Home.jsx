import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'

const MARQUEE_ITEMS = ['APEX PROCESSORS', 'NVME STORAGE', 'MECHANICAL KEYBOARDS', 'ELITE BUILDS', 'FREE SHIPPING OVER $200', '30-DAY RETURNS']

export default function Home() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    supabase.from('products').select('*').eq('active', true).limit(6).then(({ data }) => {
      if (data) setProducts(data)
    })
  }, [])

  return (
    <>
      <div className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-tag">// Performance Hardware</div>
        <h1>BUILD <em>WITHOUT</em><br />LIMITS</h1>
        <p className="hero-sub">Precision-selected components for builders who refuse to compromise. Every product tested, every spec verified.</p>
        <div className="hero-actions">
          <Link className="btn-primary" to="/shop">SHOP THE COLLECTION</Link>
          <Link className="btn-ghost" to="/shop">VIEW SPECS →</Link>
        </div>
      </div>

      <div className="marquee-wrap">
        <div className="marquee-inner">
          {[0, 1].map(i => (
            <div key={i} style={{ display: 'flex' }}>
              {MARQUEE_ITEMS.map(item => (
                <div className="marquee-item" key={item}><span>★</span>{item}</div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="features-strip">
        <div className="feature-item">
          <div className="feature-num">9</div>
          <div className="feature-title">Curated Products</div>
          <div className="feature-desc">Every item hand-selected for elite performance and build compatibility.</div>
        </div>
        <div className="feature-item">
          <div className="feature-num">3</div>
          <div className="feature-title">Categories</div>
          <div className="feature-desc">CPUs, SSDs, and Keyboards — the core of every high-performance build.</div>
        </div>
        <div className="feature-item">
          <div className="feature-num">∞</div>
          <div className="feature-title">Build Potential</div>
          <div className="feature-desc">Mix and match components to create your ideal setup.</div>
        </div>
      </div>

      <div className="section-header">
        <div className="section-title">FEATURED <em>PRODUCTS</em></div>
        <Link className="section-link" to="/shop">SHOP ALL PRODUCTS →</Link>
      </div>
      <div className="product-grid">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>

      <div className="section-header">
        <div className="section-title">WHY SHOP <em>WITH US?</em></div>
      </div>
      <div className="guarantees">
        <div className="guarantee-item">
          <span className="guarantee-icon">🛡</span>
          <div className="guarantee-title">30-Day No Dead Pixel Guarantee</div>
          <div className="guarantee-desc">Any dead pixels within 30 days? We replace it, no questions asked.</div>
        </div>
        <div className="guarantee-item">
          <span className="guarantee-icon">📦</span>
          <div className="guarantee-title">DOA Protection</div>
          <div className="guarantee-desc">Every component tested before shipping. Arrives functional or we fix it.</div>
        </div>
        <div className="guarantee-item">
          <span className="guarantee-icon">📄</span>
          <div className="guarantee-title">Warranty Clarity</div>
          <div className="guarantee-desc">Transparent specs and clear warranty terms — no surprises.</div>
        </div>
      </div>

      <div className="section-header">
        <div className="section-title">BUILD <em>GUIDES</em></div>
      </div>
      <div className="builds-grid">
        {[
          { num: '01', name: 'Budget Warrior', desc: 'Maximum performance under $800. Balanced Core CPU + Speed Master SSD.' },
          { num: '02', name: 'Creator Rig', desc: '4K editing beast. Workstation CPU + Data Vault SSD + Precision Keyboard.' },
          { num: '03', name: 'Apex Setup', desc: 'No compromises. Apex CPU + Velocity SSD + Ergonomic Split Keyboard.' },
          { num: '04', name: 'Compact Pro', desc: 'Small form factor, big performance. TKL layout for clean, minimal desks.' },
        ].map(b => (
          <div className="build-card" key={b.num}>
            <div className="build-num">{b.num}</div>
            <div className="build-name">{b.name}</div>
            <div className="build-desc">{b.desc}</div>
          </div>
        ))}
      </div>

      <footer>
        <div>
          <div className="footer-logo">ELITE<span style={{ color: 'var(--accent)' }}>.</span>EQUIPMENT</div>
          <div className="footer-tagline">// Precision Hardware</div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.65', maxWidth: '280px' }}>Curated components for builders who demand the best.</p>
        </div>
        <div>
          <div className="footer-col-title">Navigation</div>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/account">Account</Link></li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Categories</div>
          <ul className="footer-links">
            <li><Link to="/shop?cat=CPU">CPUs</Link></li>
            <li><Link to="/shop?cat=SSD">SSDs</Link></li>
            <li><Link to="/shop?cat=Keyboard">Keyboards</Link></li>
          </ul>
        </div>
      </footer>
      <div className="footer-bottom">
        <span className="footer-copy">© 2025 ELITE EQUIPMENT. ALL RIGHTS RESERVED.</span>
        <span className="footer-copy">PRECISION HARDWARE FOR EVERY BUILD</span>
      </div>
    </>
  )
}
