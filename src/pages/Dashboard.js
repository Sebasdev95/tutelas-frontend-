import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { API } from '../context/AuthContext';

const BLUE = '#2773F5';

const estadoConfig = {
  pendiente:  { label: 'Pendiente',  bg: '#fff3cd', color: '#856404', dot: '#f0ad4e' },
  en_tramite: { label: 'En Trámite', bg: '#d1ecf1', color: '#0c5460', dot: '#17a2b8' },
  tramitada:  { label: 'Tramitada',  bg: '#d4edda', color: '#155724', dot: '#2AF527' },
};

export default function Dashboard() {
  const [tutelas, setTutelas] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchTutelas = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/tutelas`);
      setTutelas(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTutelas(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta tutela?')) return;
    await axios.delete(`${API}/api/tutelas/${id}`);
    fetchTutelas();
  };

  const filtered = tutelas.filter(t => {
    const matchText = !filtro || t.numero_caso.toLowerCase().includes(filtro.toLowerCase()) ||
      t.nombre_accionante.toLowerCase().includes(filtro.toLowerCase());
    const matchEstado = !estadoFiltro || t.estado === estadoFiltro;
    return matchText && matchEstado;
  });

  const stats = {
    total: tutelas.length,
    pendiente: tutelas.filter(t => t.estado === 'pendiente').length,
    en_tramite: tutelas.filter(t => t.estado === 'en_tramite').length,
    tramitada: tutelas.filter(t => t.estado === 'tramitada').length,
  };

  return (
    <Layout>
      <div style={{ maxWidth: 1100 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a2744' }}>Registro de Tutelas</h1>
          <p style={{ color: '#666', marginTop: 4 }}>Gestión y seguimiento de tutelas</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Total', value: stats.total, color: BLUE },
            { label: 'Pendientes', value: stats.pendiente, color: '#f0ad4e' },
            { label: 'En Trámite', value: stats.en_tramite, color: '#17a2b8' },
            { label: 'Tramitadas', value: stats.tramitada, color: '#28a745' },
          ].map(s => (
            <div key={s.label} style={{
              background: '#fff', borderRadius: 12, padding: '18px 20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: `4px solid ${s.color}`
            }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{
          background: '#fff', borderRadius: 12, padding: '18px 20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 20,
          display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap'
        }}>
          <input placeholder="🔍 Buscar por caso o accionante..." value={filtro} onChange={e => setFiltro(e.target.value)}
            style={{ flex: 1, minWidth: 200, padding: '10px 14px', border: '2px solid #e0e0e0', borderRadius: 8, fontSize: 13, outline: 'none' }}
            onFocus={e => e.target.style.borderColor = BLUE} onBlur={e => e.target.style.borderColor = '#e0e0e0'} />
          <select value={estadoFiltro} onChange={e => setEstadoFiltro(e.target.value)}
            style={{ padding: '10px 14px', border: '2px solid #e0e0e0', borderRadius: 8, fontSize: 13, outline: 'none' }}>
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="en_tramite">En Trámite</option>
            <option value="tramitada">Tramitada</option>
          </select>
          {user?.rol !== 'visualizador' && (
            <button onClick={() => navigate('/nueva-tutela')} style={{ padding: '10px 20px', background: BLUE, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              ➕ Nueva Tutela
            </button>
          )}
        </div>

        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>Cargando...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#aaa' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📂</div>No hay tutelas registradas
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9ff', borderBottom: '2px solid #e8f0fe' }}>
                  {['N° Caso', 'Accionante', 'Estado', 'Evidencia', 'Creado', 'Acciones'].map(h => (
                    <th key={h} style={{ padding: '13px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#555', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => {
                  const est = estadoConfig[t.estado] || estadoConfig.pendiente;
                  return (
                    <tr key={t.id} style={{ borderBottom: '1px solid #f0f0f0', background: i % 2 === 0 ? '#fff' : '#fafbff' }}>
                      <td style={{ padding: '13px 16px', fontWeight: 700, color: BLUE, fontSize: 13 }}>{t.numero_caso}</td>
                      <td style={{ padding: '13px 16px', fontSize: 13, color: '#333' }}>{t.nombre_accionante}</td>
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{ background: est.bg, color: est.color, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: est.dot, display: 'inline-block' }} />
                          {est.label}
                        </span>
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 13 }}>
                        {t.evidencia_path ? (
                          <a href={`${API}/uploads/${t.evidencia_path}`} target="_blank" rel="noreferrer" style={{ color: BLUE, textDecoration: 'none', fontSize: 12 }}>
                            📎 {t.evidencia_nombre?.substring(0, 20)}{t.evidencia_nombre?.length > 20 ? '...' : ''}
                          </a>
                        ) : <span style={{ color: '#ccc', fontSize: 12 }}>Sin archivo</span>}
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 12, color: '#888' }}>
                        {new Date(t.created_at).toLocaleDateString('es-CO')}
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => navigate(`/tutela/${t.id}`)} style={{ padding: '5px 12px', background: '#e8f0fe', color: BLUE, border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Ver</button>
                          {user?.rol !== 'visualizador' && (
                            <button onClick={() => navigate(`/editar-tutela/${t.id}`)} style={{ padding: '5px 12px', background: '#fff8e1', color: '#856404', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Editar</button>
                          )}
                          {user?.rol === 'administrador' && (
                            <button onClick={() => handleDelete(t.id)} style={{ padding: '5px 12px', background: '#fff0f0', color: '#c00', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Eliminar</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}
