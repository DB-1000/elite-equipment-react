import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const statusClass = { pending: 'pill pill-yellow', processing: 'pill pill-dim', shipped: 'pill pill-green', delivered: 'pill pill-green' }

export default function Account() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [tab, setTab] = useState('orders')

  useEffect(() => {
    if (!user) { navigate('/'); return }
    supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setOrders(data) })
  }, [user, navigate])

  if (!user) return null

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh' }}>
      <div className="account-layout">
        <aside className="account-sidebar">
          <button className={`account-nav-item${tab === 'orders' ? ' active' : ''}`} onClick={() => setTab('orders')}>Order History</button>
          <button className={`account-nav-item${tab === 'profile' ? ' active' : ''}`} onClick={() => setTab('profile')}>Profile</button>
          <button
            className="account-nav-item"
            onClick={async () => { await signOut(); navigate('/') }}
            style={{ marginTop: 'auto', color: 'var(--red)' }}
          >
            Sign Out
          </button>
        </aside>
        <div className="account-main">
          {tab === 'orders' && (
            <>
              <div className="account-section-title">ORDER HISTORY</div>
              {orders.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                  No orders yet.{' '}
                  <button className="section-link" onClick={() => navigate('/shop')}>Start shopping →</button>
                </p>
              ) : orders.map(order => (
                <div className="account-card" key={order.id}>
                  <div className="account-card-title">
                    ORDER #{order.id} — {new Date(order.created_at).toLocaleDateString()}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span className={statusClass[order.status] || 'pill pill-dim'}>{order.status?.toUpperCase()}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>${order.total}</span>
                  </div>
                  {order.tracking_number && (
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      Tracking: <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>{order.tracking_number}</span>
                    </p>
                  )}
                  {order.order_items?.map(item => (
                    <div key={item.id} style={{ fontSize: '13px', color: 'var(--text-muted)', padding: '0.3rem 0', borderTop: '1px solid var(--border)' }}>
                      {item.product_name} × {item.quantity} — ${item.product_price * item.quantity}
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}
          {tab === 'profile' && (
            <>
              <div className="account-section-title">PROFILE</div>
              <div className="account-card">
                <div className="account-card-title">ACCOUNT INFO</div>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  Email: <span style={{ color: 'var(--text)' }}>{user.email}</span>
                </p>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  Member since: <span style={{ color: 'var(--text)' }}>{new Date(user.created_at).toLocaleDateString()}</span>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
