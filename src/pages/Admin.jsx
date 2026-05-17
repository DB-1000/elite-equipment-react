import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Admin() {
  const { user, isAdmin } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [tab, setTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [editOrder, setEditOrder] = useState(null)

  useEffect(() => {
    if (!user || !isAdmin) { navigate('/'); return }
    loadOrders()
    loadProducts()
  }, [user, isAdmin, navigate])

  const loadOrders = async () => {
    const { data } = await supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false })
    if (data) setOrders(data)
  }

  const loadProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('id')
    if (data) setProducts(data)
  }

  const updateOrder = async (orderId, status, tracking) => {
    await supabase.from('orders').update({ status, tracking_number: tracking || null }).eq('id', orderId)
    showToast('Order updated')
    setEditOrder(null)
    loadOrders()
  }

  const toggleProduct = async (product) => {
    await supabase.from('products').update({ active: !product.active }).eq('id', product.id)
    showToast(`${product.name} ${product.active ? 'hidden' : 'now visible'}`)
    loadProducts()
  }

  const updatePrice = async (id, price) => {
    if (!price || isNaN(price)) return
    await supabase.from('products').update({ price: parseInt(price) }).eq('id', id)
    showToast('Price updated')
  }

  if (!isAdmin) return null

  const revenue = orders.reduce((s, o) => s + o.total, 0)

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh' }}>
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-logo-badge">ADMIN PANEL</div>
          {['orders', 'products'].map(t => (
            <button key={t} className={`admin-nav-item${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </aside>
        <div className="admin-main">
          <div className="admin-stats">
            <div className="stat-card"><div className="stat-label">Total Orders</div><div className="stat-val accent">{orders.length}</div></div>
            <div className="stat-card"><div className="stat-label">Revenue</div><div className="stat-val accent">${revenue}</div></div>
            <div className="stat-card"><div className="stat-label">Active Products</div><div className="stat-val accent">{products.filter(p => p.active).length}</div></div>
            <div className="stat-card"><div className="stat-label">Pending</div><div className="stat-val" style={{ color: 'var(--red)' }}>{orders.filter(o => o.status === 'pending').length}</div></div>
          </div>

          {tab === 'orders' && (
            <>
              <div className="admin-panel-title">ORDERS</div>
              <div className="admin-panel-sub">Update order status and add tracking numbers.</div>
              <div className="table-wrap">
                <table className="admin-table">
                  <thead><tr><th>ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Tracking</th><th>Date</th><th>Action</th></tr></thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>#{o.id}</td>
                        <td>{o.user_email}</td>
                        <td style={{ fontFamily: 'var(--font-display)' }}>${o.total}</td>
                        <td><span className={`pill ${o.status === 'shipped' || o.status === 'delivered' ? 'pill-green' : o.status === 'pending' ? 'pill-yellow' : 'pill-dim'}`}>{o.status}</span></td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent)' }}>{o.tracking_number || '—'}</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{new Date(o.created_at).toLocaleDateString()}</td>
                        <td><button className="btn-edit" onClick={() => setEditOrder(o)}>EDIT</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {tab === 'products' && (
            <>
              <div className="admin-panel-title">PRODUCTS</div>
              <div className="admin-panel-sub">Toggle visibility and update prices.</div>
              <div className="table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Name</th><th>Category</th><th>Price ($)</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id}>
                        <td>{p.name}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{p.category}</td>
                        <td>
                          <input
                            type="number"
                            defaultValue={p.price}
                            style={{ width: '80px' }}
                            onBlur={e => updatePrice(p.id, e.target.value)}
                          />
                        </td>
                        <td><span className={`pill ${p.active ? 'pill-green' : 'pill-dim'}`}>{p.active ? 'Active' : 'Hidden'}</span></td>
                        <td><button className="btn-edit" onClick={() => toggleProduct(p)}>{p.active ? 'HIDE' : 'SHOW'}</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {editOrder && <OrderEditModal order={editOrder} onClose={() => setEditOrder(null)} onSave={updateOrder} />}
    </div>
  )
}

function OrderEditModal({ order, onClose, onSave }) {
  const [status, setStatus] = useState(order.status)
  const [tracking, setTracking] = useState(order.tracking_number || '')

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">EDIT ORDER #{order.id}</div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          <p>Customer: {order.user_email}</p>
          {order.shipping_address && <p style={{ marginTop: '0.25rem' }}>Ship to: {order.shipping_address}, {order.shipping_city}, {order.shipping_state} {order.shipping_zip}</p>}
        </div>
        <div className="form-field">
          <label>Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            {['pending', 'processing', 'shipped', 'delivered'].map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label>Tracking Number</label>
          <input value={tracking} onChange={e => setTracking(e.target.value)} placeholder="e.g. 1Z999AA10123456784" />
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>CANCEL</button>
          <button className="btn-primary" onClick={() => onSave(order.id, status, tracking)}>SAVE CHANGES</button>
        </div>
      </div>
    </div>
  )
}
