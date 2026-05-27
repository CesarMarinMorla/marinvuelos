import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import DashboardOperativo from './pages/DashboardOperativo';
import UsuarioNuevo from './pages/UsuarioNuevo';
import VuelosList from './pages/VuelosList';
import ReservaNueva from './pages/ReservaNueva';
import ConsultaNueva from './pages/ConsultaNueva';

function Nav() {
  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
      <Link to="/">Inicio</Link>{' | '}
      <Link to="/usuarios/nuevo">Nuevo Usuario</Link>{' | '}
      <Link to="/vuelos">Vuelos</Link>{' | '}
      <Link to="/reservas/nueva">Nueva Reserva</Link>{' | '}
      <Link to="/consultas">Consultas</Link>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <div style={{ padding: '0 20px' }}>
        <Routes>
          <Route path="/" element={<DashboardOperativo />} />
          <Route path="/usuarios/nuevo" element={<UsuarioNuevo />} />
          <Route path="/vuelos" element={<VuelosList />} />
          <Route path="/reservas/nueva" element={<ReservaNueva />} />
          <Route path="/consultas" element={<ConsultaNueva />} />
          <Route path="/consultas/nueva" element={<ConsultaNueva />} />
          <Route path="*" element={<p>Selecciona una opción del menú.</p>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
