import { useEffect, useState } from 'react';
import { api } from '../api/client';

interface Aerolinea { id: number; nombreAerolinea?: string }
interface Avion { id: number; modelo?: string; marca?: string }
interface Piloto { id: number; nombrePersona?: string; apellidoPersona?: string }
interface Aeropuerto { id: number; nombreAeropuerto?: string }

export default function VueloNuevo() {
  const [aerolineas, setAerolineas] = useState<Aerolinea[]>([]);
  const [aviones, setAviones] = useState<Avion[]>([]);
  const [pilotos, setPilotos] = useState<Piloto[]>([]);
  const [aeropuertos, setAeropuertos] = useState<Aeropuerto[]>([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  const [form, setForm] = useState({
    fechaSalida: '',
    fechaLlegada: '',
    aerolineaId: '',
    avionId: '',
    pilotoId: '',
    aeropuertoIds: [] as number[],
  });
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get<Aerolinea[]>('/aerolineas'),
      api.get<Avion[]>('/aviones'),
      api.get<Piloto[]>('/pilotos'),
      api.get<Aeropuerto[]>('/aeropuertos'),
    ])
      .then(([a, av, p, ae]) => {
        setAerolineas(a);
        setAviones(av);
        setPilotos(p);
        setAeropuertos(ae);
      })
      .catch((err: unknown) =>
        setCatalogError(err instanceof Error ? err.message : 'Error al cargar catálogos')
      )
      .finally(() => setLoadingCatalogs(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const toggleAeropuerto = (id: number) => {
    setForm((prev) => ({
      ...prev,
      aeropuertoIds: prev.aeropuertoIds.includes(id)
        ? prev.aeropuertoIds.filter((x) => x !== id)
        : [...prev.aeropuertoIds, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.aeropuertoIds.length === 0) {
      setMsg({ ok: false, text: 'Seleccione al menos un aeropuerto.' });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      await api.post('/vuelos', {
        fechaSalida: form.fechaSalida,
        fechaLlegada: form.fechaLlegada,
        aerolinea: { id: Number(form.aerolineaId) },
        avion: { id: Number(form.avionId) },
        piloto: { id: Number(form.pilotoId) },
        aeropuertos: form.aeropuertoIds.map((id) => ({ id })),
      });
      setMsg({ ok: true, text: 'Vuelo creado exitosamente.' });
      setForm({ fechaSalida: '', fechaLlegada: '', aerolineaId: '', avionId: '', pilotoId: '', aeropuertoIds: [] });
    } catch (err: unknown) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : 'Error desconocido' });
    } finally {
      setLoading(false);
    }
  };

  if (loadingCatalogs) return <p>Cargando catálogos...</p>;
  if (catalogError) return <p style={{ color: 'red' }}>{catalogError}</p>;

  return (
    <div>
      <h2>Nuevo Vuelo</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Fecha Salida</label>
          <input type="datetime-local" name="fechaSalida" value={form.fechaSalida} onChange={handleChange} required />
        </div>
        <div>
          <label>Fecha Llegada</label>
          <input type="datetime-local" name="fechaLlegada" value={form.fechaLlegada} onChange={handleChange} required />
        </div>
        <div>
          <label>Aerolínea</label>
          <select name="aerolineaId" value={form.aerolineaId} onChange={handleChange} required>
            <option value="">-- Seleccionar --</option>
            {aerolineas.map((a) => <option key={a.id} value={a.id}>{a.nombreAerolinea}</option>)}
          </select>
        </div>
        <div>
          <label>Avión</label>
          <select name="avionId" value={form.avionId} onChange={handleChange} required>
            <option value="">-- Seleccionar --</option>
            {aviones.map((a) => <option key={a.id} value={a.id}>{a.marca} {a.modelo}</option>)}
          </select>
        </div>
        <div>
          <label>Piloto</label>
          <select name="pilotoId" value={form.pilotoId} onChange={handleChange} required>
            <option value="">-- Seleccionar --</option>
            {pilotos.map((p) => <option key={p.id} value={p.id}>{p.nombrePersona} {p.apellidoPersona}</option>)}
          </select>
        </div>
        <div>
          <label>Aeropuertos (seleccione al menos 1)</label>
          {aeropuertos.map((a) => (
            <label key={a.id} style={{ display: 'block' }}>
              <input
                type="checkbox"
                checked={form.aeropuertoIds.includes(a.id)}
                onChange={() => toggleAeropuerto(a.id)}
              />
              {a.nombreAeropuerto}
            </label>
          ))}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Crear Vuelo'}
        </button>
      </form>
      {msg && <p style={{ color: msg.ok ? 'green' : 'red' }}>{msg.text}</p>}
    </div>
  );
}
