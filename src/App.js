import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TutelaForm from './pages/TutelaForm';
import TutelaDetail from './pages/TutelaDetail';
import Usuarios from './pages/Usuarios';

function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Cargando...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.rol)) return <Navigate to="/dashboard" />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/tutela/:id" element={<PrivateRoute><TutelaDetail /></PrivateRoute>} />
          <Route path="/nueva-tutela" element={
            <PrivateRoute roles={['administrador', 'abogada']}>
              <TutelaForm mode="create" />
            </PrivateRoute>
          } />
          <Route path="/editar-tutela/:id" element={
            <PrivateRoute roles={['administrador', 'abogada']}>
              <TutelaForm mode="edit" />
            </PrivateRoute>
          } />
          <Route path="/usuarios" element={
            <PrivateRoute roles={['administrador']}>
              <Usuarios />
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
