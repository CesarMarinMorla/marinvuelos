import { useEffect, useState } from 'react';
import { api } from '../api/client';

interface Usuario { id: number; nombre: string; apellido: string }
interface Vuelo { id: number; fechaSalida: string; fechaLlegada: string }

export default function ReservaNueva() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [vuelos, setVuelos] = useState<Vuelo[]>([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [form, setForm] = useState({ usuarioId: '', vueloId: '' });
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([api.get<Usuario[]>('/usuarios'), api.get<Vuelo[]>('/vuelos')])
      .then(([u, v]) => { setUsuarios(u); setVuelos(v); })
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
      await api.post('/reservas', {
        usuario: { id: Number(form.usuarioId) },
        vuelo: { id: Number(form.vueloId) },
      });
      setMsg({ ok: true, text: 'Reserva creada exitosamente.' });
      setForm({ usuarioId: '', vueloId: '' });
    } catch (err: unknown) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : 'Error desconocido' });
    } finally {
      setLoading(false);
    }
  };

  if (loadingCatalogs) return <p>Cargando datos...</p>;
  if (catalogError) return <p style={{ color: 'red' }}>{catalogError}</p>;

  return (
    <div>
      <h2>Nueva Reserva</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuario</label>
          <select name="usuarioId" value={form.usuarioId} onChange={handleChange} required>
            <option value="">-- Seleccionar --</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>{u.nombre} {u.apellido}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Vuelo</label>
          <select name="vueloId" value={form.vueloId} onChange={handleChange} required>
            <option value="">-- Seleccionar --</option>
            {vuelos.map((v) => (
              <option key={v.id} value={v.id}>#{v.id} — {v.fechaSalida} → {v.fechaLlegada}</option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Crear Reserva'}
        </button>
      </form>
      {msg && <p style={{ color: msg.ok ? 'green' : 'red' }}>{msg.text}</p>}
    </div>
  );
}
