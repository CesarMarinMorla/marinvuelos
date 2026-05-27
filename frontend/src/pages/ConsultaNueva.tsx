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

interface Consulta {
  id: number;
  usuario?: Usuario;
  vuelo?: Vuelo;
}

const formInicial = { usuarioId: '', vueloId: '' };

export default function ConsultaNueva() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [vuelos, setVuelos] = useState<Vuelo[]>([]);
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

  useEffect(() => {
    Promise.all([
      api.get<Usuario[]>('/usuarios'),
      api.get<Vuelo[]>('/vuelos'),
      fetchConsultas(),
    ])
      .then(([u, v]) => {
        setUsuarios(u);
        setVuelos(v);
      })
      .catch((err: unknown) =>
        setCatalogError(err instanceof Error ? err.message : 'Error al cargar datos')
      )
      .finally(() => setLoadingCatalogs(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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
      <p className="muted">Registrá consultas sobre usuarios y vuelos existentes.</p>
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
          <select name="vueloId" value={form.vueloId} onChange={handleChange} required>
            <option value="">-- Seleccionar --</option>
            {vuelos.map((v) => (
              <option key={v.id} value={v.id}>
                #{v.id} — {v.aerolinea?.nombreAerolinea ?? '-'} — {v.fechaSalida}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={loading}>
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
