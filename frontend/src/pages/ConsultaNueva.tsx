import { useEffect, useState } from 'react';
import { api } from '../api/client';

interface Usuario {
  id: number;
  nombrePersona: string;
  apellidoPersona: string;
}

interface Vuelo {
  id: number;
  fechaSalida: string;
  fechaLlegada: string;
  aerolinea?: { nombreAerolinea?: string };
  aeropuertos?: { nombreAeropuerto?: string; ciudad?: { nombreCiudad?: string } }[];
}

interface Reserva {
  id: number;
  usuario?: Usuario;
  vuelo?: Vuelo;
}

interface Consulta {
  id: number;
  usuario?: Usuario;
  vuelo?: Vuelo;
}

const formInicial = { usuarioId: '', vueloId: '' };

export default function ConsultaNueva() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [form, setForm] = useState(formInicial);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchConsultas = async () => {
    const data = await api.get<Consulta[]>('/consultas');
    setConsultas(data);
  };

  const fetchReservasByUsuario = async (usuarioId: number) => {
    try {
      const data = await api.get<Reserva[]>(`/reservas?usuarioId=${usuarioId}`);
      setReservas(data);
    } catch {
      setReservas([]);
    }
  };

  useEffect(() => {
    Promise.all([
      api.get<Usuario[]>('/usuarios'),
      fetchConsultas(),
    ])
      .then(([u]) => {
        setUsuarios(u);
      })
      .catch((err: unknown) =>
        setCatalogError(err instanceof Error ? err.message : 'Error al cargar datos')
      )
      .finally(() => setLoadingCatalogs(false));
  }, []);

  const vuelosDelUsuario = Array.from(
    new Map(
      reservas
        .filter((r) => r.vuelo)
        .map((r) => [r.vuelo!.id, r.vuelo!])
    ).values()
  );
  const consultasOrdenadas = [...consultas].sort((a, b) => b.id - a.id);
  const ultimaConsulta = consultasOrdenadas[0];
  const dateFormatter = new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const formatDate = (value?: string) => {
    if (!value) return '-';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
  };

  const formatRuta = (vuelo?: Vuelo) => {
    const aeropuertosVuelo = vuelo?.aeropuertos ?? [];
    if (aeropuertosVuelo.length < 2) return '-';
    const origen = aeropuertosVuelo[0]?.ciudad?.nombreCiudad ?? aeropuertosVuelo[0]?.nombreAeropuerto ?? '-';
    const destino =
      aeropuertosVuelo[aeropuertosVuelo.length - 1]?.ciudad?.nombreCiudad ??
      aeropuertosVuelo[aeropuertosVuelo.length - 1]?.nombreAeropuerto ??
      '-';
    return `${origen} → ${destino}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'usuarioId' && value) {
      fetchReservasByUsuario(Number(value));
      setForm({ usuarioId: value, vueloId: '' });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      await api.post('/consultas', {
        usuario: { id: Number(form.usuarioId) },
        vuelo: { id: Number(form.vueloId) },
      });
      setMsg({ ok: true, text: 'Consulta creada exitosamente.' });
      setForm(formInicial);
      await fetchConsultas();
    } catch (err: unknown) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : 'Error desconocido' });
    } finally {
      setLoading(false);
    }
  };

  if (loadingCatalogs) return <p>Cargando datos...</p>;
  if (catalogError) return <p style={{ color: 'red' }}>{catalogError}</p>;

  return (
    <div className="page-card">
      <h2 className="page-title">Nueva Consulta</h2>
      <p className="muted">Elegí un usuario y revisá los vuelos en los que tiene reservas.</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuario</label>
          <select name="usuarioId" value={form.usuarioId} onChange={handleChange} required>
            <option value="">-- Seleccionar --</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nombrePersona} {u.apellidoPersona}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Vuelo</label>
          <select
            name="vueloId"
            value={form.vueloId}
            onChange={handleChange}
            required
            disabled={!form.usuarioId || vuelosDelUsuario.length === 0}
          >
            <option value="">
              {!form.usuarioId
                ? '-- Seleccione usuario primero --'
                : vuelosDelUsuario.length === 0
                ? '-- No hay reservas para este usuario --'
                : '-- Seleccionar vuelo --'}
            </option>
            {vuelosDelUsuario.map((v) => (
              <option key={v.id} value={v.id}>
                #{v.id} — {v.aerolinea?.nombreAerolinea ?? '-'} — {v.fechaSalida}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={loading || !form.usuarioId || !form.vueloId}>
          {loading ? 'Guardando...' : 'Crear Consulta'}
        </button>
      </form>

      {msg && (
        <div
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1rem',
            borderRadius: 8,
            background: msg.ok ? '#e8f8ef' : '#fdecec',
            color: msg.ok ? '#166534' : '#991b1b',
            border: `1px solid ${msg.ok ? '#86efac' : '#f5c2c7'}`,
          }}
        >
          <strong>{msg.ok ? 'Éxito' : 'Error'}:</strong> {msg.text}
        </div>
      )}

      {ultimaConsulta && (
        <section
          style={{
            marginTop: '1rem',
            padding: '1rem',
            border: '1px solid #d9e2ec',
            borderRadius: 10,
            background: '#f8fafc',
          }}
        >
          <h3 style={{ marginTop: 0 }}>Última consulta registrada</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
            <div><strong>Usuario</strong><br />{ultimaConsulta.usuario ? `${ultimaConsulta.usuario.nombrePersona} ${ultimaConsulta.usuario.apellidoPersona}` : '-'}</div>
            <div><strong>Ruta</strong><br />{formatRuta(ultimaConsulta.vuelo)}</div>
            <div><strong>Vuelo</strong><br />#{ultimaConsulta.vuelo?.id ?? '-'}</div>
            <div><strong>Aerolínea</strong><br />{ultimaConsulta.vuelo?.aerolinea?.nombreAerolinea ?? '-'}</div>
            <div><strong>Salida</strong><br />{formatDate(ultimaConsulta.vuelo?.fechaSalida)}</div>
            <div><strong>Llegada</strong><br />{formatDate(ultimaConsulta.vuelo?.fechaLlegada)}</div>
          </div>
        </section>
      )}

      <h3>Consultas registradas</h3>
      {consultas.length === 0 ? (
        <p>No hay consultas.</p>
      ) : (
        <table border={1} cellPadding={6}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Ruta</th>
              <th>Vuelo</th>
              <th>Aerolínea</th>
              <th>Salida</th>
              <th>Llegada</th>
            </tr>
          </thead>
          <tbody>
            {consultasOrdenadas.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.usuario ? `${c.usuario.nombrePersona} ${c.usuario.apellidoPersona}` : '-'}</td>
                <td>{formatRuta(c.vuelo)}</td>
                <td>{c.vuelo ? `#${c.vuelo.id}` : '-'}</td>
                <td>{c.vuelo?.aerolinea?.nombreAerolinea ?? '-'}</td>
                <td>{formatDate(c.vuelo?.fechaSalida)}</td>
                <td>{formatDate(c.vuelo?.fechaLlegada)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
