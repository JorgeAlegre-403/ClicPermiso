import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import ToastContainer from './components/ui/ToastContainer';

import Login from './pages/Login';
import SolicitarDias from './pages/SolicitarDias';
import MisSolicitudes from './pages/MisSolicitudes';
import Perfil from './pages/Perfil';
import DashboardDirectivo from './pages/Dashboard';
import DashboardDocente from './pages/DashboardDocente';
import GestionSolicitudes from './pages/GestionSolicitudes';
import Profesores from './pages/Profesores';
import CalendarioGlobal from './pages/CalendarioGlobal';

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 bg-white/50 backdrop-blur-sm">
          <Header onToggleSidebar={() => setSidebarOpen(true)} />

          <div className="pb-10">
            <Routes>
              {/* Rutas comunes/docente (requieren autenticación) */}
              <Route path="/mi-panel" element={<ProtectedRoute><DashboardDocente /></ProtectedRoute>} />
              <Route path="/solicitar" element={<ProtectedRoute><SolicitarDias /></ProtectedRoute>} />
              <Route path="/mis-solicitudes" element={<ProtectedRoute><MisSolicitudes /></ProtectedRoute>} />
              <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />

              {/* Rutas directivo (requieren rol directivo) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requiredRole="directivo">
                    <DashboardDirectivo />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/calendario"
                element={
                  <ProtectedRoute requiredRole="directivo">
                    <CalendarioGlobal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/gestion-solicitudes"
                element={
                  <ProtectedRoute requiredRole="directivo">
                    <GestionSolicitudes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profesores"
                element={
                  <ProtectedRoute requiredRole="directivo">
                    <Profesores />
                  </ProtectedRoute>
                }
              />

              {/* Ruta por defecto */}
              <Route path="*" element={<Navigate to="/mi-panel" replace />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  const { initialize, initialized } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-linear-to-br from-indigo-950 via-indigo-900 to-purple-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-300/30 border-t-white rounded-full animate-spin" />
          <span className="text-indigo-200 text-sm font-medium">Cargando ClicPermiso...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
