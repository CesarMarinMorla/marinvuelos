import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

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
    <div>
      <h2>Panel operativo</h2>
      <p>Vista rápida para el empleado que gestiona usuarios, vuelos, reservas y consultas.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, margin: '16px 0' }}>
        <Card title="Usuarios" value={usuarios.length} />
        <Card title="Vuelos" value={vuelos.length} />
        <Card title="Vuelos de hoy" value={vuelosHoy.length} />
        <Card title="Reservas" value={reservas.length} />
        <Card title="Consultas" value={consultas.length} />
      </div>

      <section style={{ marginBottom: 24 }}>
        <h3>Acciones rápidas</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/usuarios/nuevo">Nuevo usuario</Link>
          <Link to="/reservas/nueva">Nueva reserva</Link>
          <Link to="/consultas">Nueva consulta</Link>
          <Link to="/vuelos">Buscar vuelos</Link>
        </div>
      </section>

      <Section title="Vuelos de hoy">
        {vuelosHoy.length === 0 ? (
          <p>No hay vuelos para hoy. Mostrando próximos vuelos.</p>
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
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, background: '#fafafa' }}>
      <div style={{ fontSize: 14, color: '#666' }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: 24 }}>
      <h3 style={{ marginBottom: 8 }}>{title}</h3>
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
            <td>{v.id}</td>
            <td>{v.fechaSalida}</td>
            <td>{v.fechaLlegada}</td>
            <td>{v.aerolinea?.nombreAerolinea ?? '-'}</td>
            <td>{v.aeropuertos?.map((a) => a.nombreAeropuerto).join(', ') ?? '-'}</td>
            <td>{v.piloto ? `${v.piloto.nombrePersona} ${v.piloto.apellidoPersona}` : '-'}</td>
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
