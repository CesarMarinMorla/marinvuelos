import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import DashboardOperativo from './pages/DashboardOperativo';
import UsuarioNuevo from './pages/UsuarioNuevo';
import VuelosList from './pages/VuelosList';
import ReservaNueva from './pages/ReservaNueva';
import ConsultaNueva from './pages/ConsultaNueva';

function Nav() {
  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-badge">MV</span>
        <div>
          <h1>MarinVuelos</h1>
          <p>Panel operativo</p>
        </div>
      </div>
      <nav className="app-nav">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Inicio
        </NavLink>
        <NavLink to="/usuarios/nuevo" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Usuarios
        </NavLink>
        <NavLink to="/vuelos" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Vuelos
        </NavLink>
        <NavLink to="/reservas/nueva" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Reservas
        </NavLink>
        <NavLink to="/consultas" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Consultas
        </NavLink>
      </nav>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <main className="app-shell">
        <Routes>
          <Route path="/" element={<DashboardOperativo />} />
          <Route path="/usuarios/nuevo" element={<UsuarioNuevo />} />
          <Route path="/vuelos" element={<VuelosList />} />
          <Route path="/reservas/nueva" element={<ReservaNueva />} />
          <Route path="/consultas" element={<ConsultaNueva />} />
          <Route path="/consultas/nueva" element={<ConsultaNueva />} />
          <Route path="*" element={<p className="empty-state">Selecciona una opción del menú.</p>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
