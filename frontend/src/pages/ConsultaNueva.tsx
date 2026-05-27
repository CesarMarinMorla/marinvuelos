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

      {msg && <p style={{ color: msg.ok ? 'green' : 'red' }}>{msg.text}</p>}

      <h3>Consultas registradas</h3>
      {consultas.length === 0 ? (
        <p>No hay consultas.</p>
      ) : (
        <table border={1} cellPadding={6}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Vuelo</th>
            </tr>
          </thead>
          <tbody>
            {consultas.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.usuario ? `${c.usuario.nombrePersona} ${c.usuario.apellidoPersona}` : '-'}</td>
                <td>{c.vuelo ? `#${c.vuelo.id} — ${c.vuelo.fechaSalida}` : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
