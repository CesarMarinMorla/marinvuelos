import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { formatDate } from '../utils/date';

interface Vuelo {
  id: number;
  fechaSalida: string;
  fechaLlegada: string;
  aerolinea?: { nombreAerolinea?: string };
  aeropuertos?: { nombreAeropuerto?: string }[];
  piloto?: { nombrePersona?: string; apellidoPersona?: string };
}

interface Reserva {
  id: number;
  usuario?: { nombrePersona?: string; apellidoPersona?: string };
  vuelo?: Vuelo;
}

interface Consulta {
  id: number;
  usuario?: { nombrePersona?: string; apellidoPersona?: string };
  vuelo?: Vuelo;
}

interface Usuario {
  id: number;
}

function getDateKey(value: string) {
  return value.slice(0, 10);
}

export default function DashboardOperativo() {
  const [vuelos, setVuelos] = useState<Vuelo[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.get<Vuelo[]>('/vuelos'),
      api.get<Reserva[]>('/reservas'),
      api.get<Consulta[]>('/consultas'),
      api.get<Usuario[]>('/usuarios'),
    ])
      .then(([v, r, c, u]) => {
        setVuelos(v);
        setReservas(r);
        setConsultas(c);
        setUsuarios(u);
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Error al cargar dashboard')
      )
      .finally(() => setLoading(false));
  }, []);

  const hoyKey = new Date().toISOString().slice(0, 10);

  const vuelosHoy = useMemo(
    () => vuelos.filter((vuelo) => getDateKey(vuelo.fechaSalida) === hoyKey),
    [vuelos, hoyKey]
  );

  const proximosVuelos = useMemo(
    () =>
      [...vuelos]
        .filter((vuelo) => getDateKey(vuelo.fechaSalida) >= hoyKey)
        .sort((a, b) => a.fechaSalida.localeCompare(b.fechaSalida))
        .slice(0, 5),
    [vuelos, hoyKey]
  );

  const reservasRecientes = useMemo(
    () => [...reservas].sort((a, b) => b.id - a.id).slice(0, 5),
    [reservas]
  );

  const consultasRecientes = useMemo(
    () => [...consultas].sort((a, b) => b.id - a.id).slice(0, 5),
    [consultas]
  );

  if (loading) return <p>Cargando dashboard...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="page-card">
      <h2 className="page-title">Panel operativo</h2>
      <p className="muted">Vista rápida para el empleado que gestiona usuarios, vuelos, reservas y consultas.</p>

      <div className="metric-grid">
        <Card title="Usuarios" value={usuarios.length} />
        <Card title="Vuelos" value={vuelos.length} />
        <Card title="Vuelos de hoy" value={vuelosHoy.length} />
        <Card title="Reservas" value={reservas.length} />
        <Card title="Consultas" value={consultas.length} />
      </div>

      <section className="section-block">
        <h3>Acciones rápidas</h3>
        <div className="action-bar">
          <Link className="action-link" to="/usuarios/nuevo">Nuevo usuario</Link>
          <Link className="action-link" to="/reservas/nueva">Nueva reserva</Link>
          <Link className="action-link secondary-link" to="/consultas">Nueva consulta</Link>
          <Link className="action-link secondary-link" to="/vuelos">Buscar vuelos</Link>
        </div>
      </section>

      <Section title="Vuelos de hoy">
        {vuelosHoy.length === 0 ? (
          <p className="muted">No hay vuelos para hoy. Mostrando próximos vuelos.</p>
        ) : (
          <FlightTable vuelos={vuelosHoy} />
        )}
      </Section>

      <Section title="Próximos vuelos">
        <FlightTable vuelos={proximosVuelos} />
      </Section>

      <Section title="Reservas recientes">
        <SimpleList
          items={reservasRecientes.map((r) => (
            <span key={r.id}>
              Reserva #{r.id} — {r.usuario ? `${r.usuario.nombrePersona} ${r.usuario.apellidoPersona}` : 'Sin usuario'} —
              {' '}
              {r.vuelo ? `Vuelo #${r.vuelo.id}` : 'Sin vuelo'}
            </span>
          ))}
        />
      </Section>

      <Section title="Consultas recientes">
        <SimpleList
          items={consultasRecientes.map((c) => (
            <span key={c.id}>
              Consulta #{c.id} — {c.usuario ? `${c.usuario.nombrePersona} ${c.usuario.apellidoPersona}` : 'Sin usuario'} —
              {' '}
              {c.vuelo ? `Vuelo #${c.vuelo.id}` : 'Sin vuelo'}
            </span>
          ))}
        />
      </Section>
    </div>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="metric-card">
      <div className="metric-card__label">{title}</div>
      <div className="metric-card__value text-value">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="section-block">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function FlightTable({ vuelos }: { vuelos: Vuelo[] }) {
  if (vuelos.length === 0) return <p>No hay registros.</p>;

  return (
    <table border={1} cellPadding={6}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Salida</th>
          <th>Llegada</th>
          <th>Aerolínea</th>
          <th>Aeropuertos</th>
          <th>Piloto</th>
        </tr>
      </thead>
      <tbody>
        {vuelos.map((v) => (
          <tr key={v.id}>
            <td className="text-id">{v.id}</td>
            <td className="text-date">{formatDate(v.fechaSalida)}</td>
            <td className="text-date">{formatDate(v.fechaLlegada)}</td>
            <td>{v.aerolinea?.nombreAerolinea ?? '-'}</td>
            <td className="text-route">{v.aeropuertos?.map((a) => a.nombreAeropuerto).join(', ') ?? '-'}</td>
            <td className="text-name">{v.piloto ? `${v.piloto.nombrePersona} ${v.piloto.apellidoPersona}` : '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SimpleList({ items }: { items: ReactNode[] }) {
  if (items.length === 0) return <p>No hay registros.</p>;
  return (
    <ul style={{ paddingLeft: 18 }}>
      {items.map((item, index) => (
        <li key={index} style={{ marginBottom: 6 }}>
          {item}
        </li>
      ))}
    </ul>
  );
}
