import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { API } from '../context/AuthContext';

const BLUE = '#2773F5';

export default function TutelaForm({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [file, setFile] = useState(null);
  const [existingFile, setExistingFile] = useState(null);
  const [form, setForm] = useState({ numero_caso: '', nombre_accionante: '', estado: 'pendiente', observacion_abogada: '', observacion_respuesta: '' });

  useEffect(() => {
    if (mode === 'edit' && id) {
      axios.get(`${API}/api/tutelas/${id}`).then(res => {
        const t = res.data;
        setForm({ numero_caso: t.numero_caso, nombre_accionante: t.nombre_accionante, estado: t.estado, observacion_abogada: t.observacion_abogada || '', observacion_respuesta: t.observacion_respuesta || '' });
        if (t.evidencia_path) setExistingFile({ path: t.evidencia_path, nombre: t.evidencia_nombre });
      });
    }
  }, [mode, id]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess(''); setLoading(true);
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (file) data.append('evidencia', file);
    try {
      if (mode === 'edit') {
        await axios.put(`${API}/api/tutelas/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
        setSuccess('Tutela actualizada correctamente');
      } else {
        await axios.post(`${API}/api/tutelas`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
        setSuccess('Tutela registrada correctamente');
        setForm({ numero_caso: '', nombre_accionante: '', estado: 'pendiente', observacion_abogada: '', observacion_respuesta: '' });
        setFile(null);
      }
    } catch (err) { setError(err.response?.data?.error || 'Error al guardar'); }
    finally { setLoading(false); }
  };

  const inputStyle = { width: '100%', padding: '11px 14px', border: '2px solid #e0e0e0', borderRadius: 8, fontSize: 14, outline: 'none' };
  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 };

  return (
    <Layout>
      <div style={{ maxWidth: 720 }}>
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#666' }}>←</button>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a2744' }}>{mode === 'edit' ? 'Editar Tutela' : 'Registrar Nueva Tutela'}</h1>
            <p style={{ color: '#666', fontSize: 13, marginTop: 2 }}>{mode === 'edit' ? `Editando caso ${form.numero_caso}` : 'Complete los datos de la tutela'}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a2744', marginBottom: 20, paddingBottom: 12, borderBottom: '2px solid #f0f4ff' }}>📋 Datos del Caso</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              <div>
                <label style={labelStyle}>N° de Caso *</label>
                <input name="numero_caso" value={form.numero_caso} onChange={e => setForm({...form, numero_caso: e.target.value})} required placeholder="Ej: TUT-2024-001" style={inputStyle} onFocus={e => e.target.style.borderColor=BLUE} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
              </div>
              <div>
                <label style={labelStyle}>Estado *</label>
                <select name="estado" value={form.estado} onChange={e => setForm({...form, estado: e.target.value})} style={{ ...inputStyle, background: '#fff' }}>
                  <option value="pendiente">Pendiente</option>
                  <option value="en_tramite">En Trámite</option>
                  <option value="tramitada">Tramitada</option>
                </select>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Nombre del Accionante *</label>
                <input name="nombre_accionante" value={form.nombre_accionante} onChange={e => setForm({...form, nombre_accionante: e.target.value})} required placeholder="Nombre completo" style={inputStyle} onFocus={e => e.target.style.borderColor=BLUE} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
              </div>
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a2744', marginBottom: 20, paddingBottom: 12, borderBottom: '2px solid #f0f4ff' }}>💬 Observaciones</h3>
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Observación de la Abogada</label>
              <textarea name="observacion_abogada" value={form.observacion_abogada} onChange={e => setForm({...form, observacion_abogada: e.target.value})} rows={4} placeholder="Observaciones del área jurídica..." style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} onFocus={e => e.target.style.borderColor=BLUE} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
            </div>
            <div>
              <label style={labelStyle}>Observación de Respuesta</label>
              <textarea name="observacion_respuesta" value={form.observacion_respuesta} onChange={e => setForm({...form, observacion_respuesta: e.target.value})} rows={4} placeholder="Observaciones del personal que responde..." style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} onFocus={e => e.target.style.borderColor=BLUE} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a2744', marginBottom: 20, paddingBottom: 12, borderBottom: '2px solid #f0f4ff' }}>📎 Evidencia</h3>
            {existingFile && !file && (
              <div style={{ background: '#e8f0fe', borderRadius: 8, padding: '12px 16px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>📄</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>{existingFile.nombre}</div>
                  <a href={`${API}/uploads/${existingFile.path}`} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: BLUE }}>Ver archivo actual</a>
                </div>
              </div>
            )}
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', border: '2px dashed #c5d5f5', borderRadius: 8, cursor: 'pointer', background: '#f8f9ff' }}>
              <span style={{ fontSize: 28 }}>📂</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>{file ? file.name : (existingFile ? 'Reemplazar archivo' : 'Cargar archivo')}</div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>PNG o PDF — máximo 10MB</div>
              </div>
              <input type="file" accept=".pdf,.png" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
            </label>
          </div>
          {error && <div style={{ background: '#fff0f0', border: '1px solid #ffc', borderRadius: 8, padding: '12px 16px', color: '#c00', fontSize: 13, marginBottom: 16 }}>{error}</div>}
          {success && <div style={{ background: '#f0fff4', border: '1px solid #2AF527', borderRadius: 8, padding: '12px 16px', color: '#1a7a18', fontSize: 13, marginBottom: 16 }}>{success}</div>}
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="button" onClick={() => navigate('/dashboard')} style={{ padding: '12px 24px', border: '2px solid #e0e0e0', borderRadius: 8, background: '#fff', fontSize: 14, cursor: 'pointer', color: '#666' }}>Cancelar</button>
            <button type="submit" disabled={loading} style={{ flex: 1, padding: '12px 24px', background: BLUE, color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Guardando...' : mode === 'edit' ? '💾 Actualizar Tutela' : '✅ Registrar Tutela'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
