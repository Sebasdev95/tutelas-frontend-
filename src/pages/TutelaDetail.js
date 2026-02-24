import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { API } from '../context/AuthContext';

const BLUE = '#2773F5';
const estadoConfig = {
  pendiente:  { label: 'Pendiente',  bg: '#fff3cd', color: '#856404', dot: '#f0ad4e' },
  en_tramite: { label: 'En Trámite', bg: '#d1ecf1', color: '#0c5460', dot: '#17a2b8' },
  tramitada:  { label: 'Tramitada',  bg: '#d4edda', color: '#155724', dot: '#2AF527' },
};

export default function TutelaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tutela, setTutela] = useState(null);

  useEffect(() => {
    axios.get(`${API}/api/tutelas/${id}`).then(res => setTutela(res.data));
  }, [id]);

  if (!tutela) return <Layout><div style={{ padding: 40, textAlign: 'center' }}>Cargando...</div></Layout>;

  const est = estadoConfig[tutela.estado] || estadoConfig.pendiente;
  const Card = ({ title, children }) => (
    <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 16 }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a2744', marginBottom: 16, paddingBottom: 10, borderBottom: '2px solid #f0f4ff' }}>{title}</h3>
      {children}
    </div>
  );
  const Field = ({ label, value }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 14, color: '#333' }}>{value || <span style={{ color: '#ccc', fontStyle: 'italic' }}>Sin información</span>}</div>
    </div>
  );

  return (
    <Layout>
      <div style={{ maxWidth: 800 }}>
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#666' }}>←</button>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a2744' }}>Detalle de Tutela</h1>
              <p style={{ color: '#666', fontSize: 13 }}>Caso: <strong>{tutela.numero_caso}</strong></p>
            </div>
          </div>
          {user?.rol !== 'visualizador' && (
            <button onClick={() => navigate(`/editar-tutela/${id}`)} style={{ padding: '9px 18px', background: BLUE, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>✏️ Editar</button>
          )}
        </div>
        <Card title="📋 Información del Caso">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <Field label="N° de Caso" value={<span style={{ color: BLUE, fontWeight: 700 }}>{tutela.numero_caso}</span>} />
            <Field label="Nombre Accionante" value={tutela.nombre_accionante} />
            <Field label="Estado" value={
              <span style={{ background: est.bg, color: est.color, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: est.dot }} />{est.label}
              </span>
            } />
            <Field label="Registrado por" value={tutela.creado_por_nombre} />
            <Field label="Fecha de Registro" value={new Date(tutela.created_at).toLocaleString('es-CO')} />
            <Field label="Última Actualización" value={new Date(tutela.updated_at).toLocaleString('es-CO')} />
          </div>
        </Card>
        <Card title="💬 Observaciones">
          <Field label="Observación de la Abogada" value={tutela.observacion_abogada} />
          <Field label="Observación de Respuesta" value={tutela.observacion_respuesta} />
        </Card>
        <Card title="📎 Evidencia">
          {tutela.evidencia_path ? (
            <a href={`${API}/uploads/${tutela.evidencia_path}`} target="_blank" rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 18px', background: '#e8f0fe', borderRadius: 8, textDecoration: 'none', color: BLUE }}>
              <span style={{ fontSize: 22 }}>{tutela.evidencia_nombre?.endsWith('.pdf') ? '📑' : '🖼️'}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{tutela.evidencia_nombre}</div>
                <div style={{ fontSize: 11, marginTop: 2 }}>Click para ver</div>
              </div>
            </a>
          ) : (
            <div style={{ color: '#bbb', fontSize: 13, fontStyle: 'italic', padding: '10px 0' }}>Sin archivo adjunto</div>
          )}
        </Card>
      </div>
    </Layout>
  );
}
