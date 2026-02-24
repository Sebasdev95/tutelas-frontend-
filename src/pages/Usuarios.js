import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { API } from '../context/AuthContext';

const BLUE = '#2773F5';
const rolConfig = {
  administrador: { bg: '#fff3cd', color: '#856404' },
  abogada:       { bg: '#d1ecf1', color: '#0c5460' },
  visualizador:  { bg: '#d4edda', color: '#155724' },
};

export default function Usuarios() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ nombre: '', username: '', password: '', rol: 'abogada' });
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    const res = await axios.get(`${API}/api/users`);
    setUsers(res.data);
  };
  useEffect(() => { fetchUsers(); }, []);

  const openCreate = () => { setEditUser(null); setForm({ nombre: '', username: '', password: '', rol: 'abogada' }); setError(''); setShowModal(true); };
  const openEdit = (u) => { setEditUser(u); setForm({ nombre: u.nombre, username: u.username, password: '', rol: u.rol, activo: u.activo }); setError(''); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      if (editUser) await axios.put(`${API}/api/users/${editUser.id}`, { ...form, activo: form.activo ?? 1 });
      else await axios.post(`${API}/api/users`, form);
      setShowModal(false); fetchUsers();
    } catch (err) { setError(err.response?.data?.error || 'Error al guardar'); }
  };

  const handleToggle = async (u) => {
    await axios.put(`${API}/api/users/${u.id}`, { ...u, activo: u.activo ? 0 : 1, password: undefined });
    fetchUsers();
  };

  const inputStyle = { width: '100%', padding: '10px 13px', border: '2px solid #e0e0e0', borderRadius: 8, fontSize: 14, outline: 'none' };

  return (
    <Layout>
      <div style={{ maxWidth: 900 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a2744' }}>Gestión de Usuarios</h1>
            <p style={{ color: '#666', marginTop: 4 }}>Administra el acceso al sistema</p>
          </div>
          <button onClick={openCreate} style={{ padding: '10px 22px', background: BLUE, color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>➕ Nuevo Usuario</button>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9ff', borderBottom: '2px solid #e8f0fe' }}>
                {['Nombre','Usuario','Rol','Estado','Creado','Acciones'].map(h => (
                  <th key={h} style={{ padding: '13px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#555', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => {
                const rc = rolConfig[u.rol] || {};
                return (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f0f0f0', background: i % 2 === 0 ? '#fff' : '#fafbff' }}>
                    <td style={{ padding: '13px 16px', fontWeight: 600, color: '#333', fontSize: 14 }}>{u.nombre}</td>
                    <td style={{ padding: '13px 16px', color: '#666', fontSize: 13, fontFamily: 'monospace' }}>{u.username}</td>
                    <td style={{ padding: '13px 16px' }}><span style={{ background: rc.bg, color: rc.color, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{u.rol}</span></td>
                    <td style={{ padding: '13px 16px' }}><span style={{ background: u.activo ? '#d4edda' : '#f8d7da', color: u.activo ? '#155724' : '#721c24', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{u.activo ? 'Activo' : 'Inactivo'}</span></td>
                    <td style={{ padding: '13px 16px', fontSize: 12, color: '#888' }}>{new Date(u.created_at).toLocaleDateString('es-CO')}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => openEdit(u)} style={{ padding: '5px 12px', background: '#e8f0fe', color: BLUE, border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Editar</button>
                        <button onClick={() => handleToggle(u)} style={{ padding: '5px 12px', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontWeight: 600, background: u.activo ? '#fff0f0' : '#f0fff4', color: u.activo ? '#c00' : '#28a745' }}>{u.activo ? 'Desactivar' : 'Activar'}</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a2744', marginBottom: 24 }}>{editUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Nombre Completo *</label>
                  <input value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required style={inputStyle} placeholder="Ej: María García" onFocus={e => e.target.style.borderColor=BLUE} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                </div>
                {!editUser && (
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Usuario *</label>
                    <input value={form.username} onChange={e => setForm({...form, username: e.target.value})} required style={inputStyle} placeholder="Nombre de usuario" onFocus={e => e.target.style.borderColor=BLUE} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                  </div>
                )}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{editUser ? 'Nueva Contraseña (vacío = no cambiar)' : 'Contraseña *'}</label>
                  <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required={!editUser} style={inputStyle} placeholder="••••••••" onFocus={e => e.target.style.borderColor=BLUE} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Rol *</label>
                  <select value={form.rol} onChange={e => setForm({...form, rol: e.target.value})} style={{ ...inputStyle, background: '#fff' }}>
                    <option value="administrador">Administrador</option>
                    <option value="abogada">Abogada</option>
                    <option value="visualizador">Visualizador</option>
                  </select>
                </div>
                {error && <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: 8, padding: '10px 14px', color: '#c00', fontSize: 13, marginBottom: 16 }}>{error}</div>}
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '11px', border: '2px solid #e0e0e0', borderRadius: 8, background: '#fff', fontSize: 14, cursor: 'pointer', color: '#666' }}>Cancelar</button>
                  <button type="submit" style={{ flex: 1, padding: '11px', background: BLUE, color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>{editUser ? 'Actualizar' : 'Crear Usuario'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
