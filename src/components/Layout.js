import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BLUE = '#2773F5';
const GREEN = '#2AF527';

const navItems = [
  { path: '/dashboard', label: '📋 Tutelas', roles: ['administrador', 'abogada', 'visualizador'] },
  { path: '/nueva-tutela', label: '➕ Nueva Tutela', roles: ['administrador', 'abogada'] },
  { path: '/usuarios', label: '👥 Usuarios', roles: ['administrador'] },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sideOpen, setSideOpen] = useState(true);

  const handleLogout = () => { logout(); navigate('/login'); };

  const rolColors = {
    administrador: { bg: '#fff3cd', color: '#856404' },
    abogada: { bg: '#d1ecf1', color: '#0c5460' },
    visualizador: { bg: '#d4edda', color: '#155724' },
  };
  const rolC = rolColors[user?.rol] || {};

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f4ff' }}>
      {/* Sidebar */}
      <div style={{
        width: sideOpen ? 240 : 64, background: '#1a2744', transition: 'width 0.3s',
        display: 'flex', flexDirection: 'column', boxShadow: '4px 0 15px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', gap: 10
        }}>
          <span style={{ fontSize: 24, flexShrink: 0 }}>⚖️</span>
          {sideOpen && <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>Sistema Tutelas</div>
            <div style={{ color: '#2AF527', fontSize: 11 }}>Entidad de Salud</div>
          </div>}
          <button onClick={() => setSideOpen(!sideOpen)} style={{
            marginLeft: 'auto', background: 'none', border: 'none', color: '#aaa',
            cursor: 'pointer', fontSize: 18, flexShrink: 0
          }}>
            {sideOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '12px 8px' }}>
          {navItems
            .filter(item => item.roles.includes(user?.rol))
            .map(item => {
              const active = location.pathname === item.path;
              return (
                <button key={item.path} onClick={() => navigate(item.path)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                    padding: '11px 14px', border: 'none', borderRadius: 8, cursor: 'pointer',
                    marginBottom: 4, textAlign: 'left', fontSize: 13, fontWeight: active ? 700 : 400,
                    background: active ? BLUE : 'transparent',
                    color: active ? '#fff' : '#9aa5be',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{item.label.split(' ')[0]}</span>
                  {sideOpen && <span>{item.label.split(' ').slice(1).join(' ')}</span>}
                </button>
              );
            })}
        </nav>

        {/* User info */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {sideOpen && <div style={{ padding: '10px 14px', marginBottom: 8 }}>
            <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{user?.nombre}</div>
            <span style={{
              background: rolC.bg, color: rolC.color, fontSize: 11,
              padding: '2px 8px', borderRadius: 10, fontWeight: 600
            }}>{user?.rol}</span>
          </div>}
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 10, width: '100%',
            padding: '11px 14px', border: 'none', borderRadius: 8, cursor: 'pointer',
            background: 'transparent', color: '#9aa5be', fontSize: 13, textAlign: 'left'
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,80,80,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span>🚪</span>{sideOpen && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </div>

      {/* Content */}
      <main style={{ flex: 1, overflow: 'auto', padding: 32 }}>
        {children}
      </main>
    </div>
  );
}
