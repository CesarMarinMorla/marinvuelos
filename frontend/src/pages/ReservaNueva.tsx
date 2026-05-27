import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';

interface Usuario {
  id: number;
  nombrePersona: string;
  apellidoPersona: string;
}

interface Ciudad {
  id: number;
  nombreCiudad: string;
}

interface Aeropuerto {
  id: number;
  nombreAeropuerto: string;
  ciudad?: Ciudad;
}

interface Vuelo {
  id: number;
  fechaSalida: string;
  fechaLlegada: string;
  aerolinea?: { nombreAerolinea?: string };
  aeropuertos?: Aeropuerto[];
}

interface Reserva {
  id: number;
  usuario?: Usuario;
  vuelo?: Vuelo;
}

const formInicial = {
  usuarioId: '',
  ciudadOrigenId: '',
  ciudadDestinoId: '',
  vueloId: '',
};

export default function ReservaNueva() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [vuelos, setVuelos] = useState<Vuelo[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [form, setForm] = useState(formInicial);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchReservas = async () => {
    const data = await api.get<Reserva[]>('/reservas');
    setReservas(data);
  };

  useEffect(() => {
    Promise.all([
      api.get<Usuario[]>('/usuarios'),
      api.get<Ciudad[]>('/ciudades'),
      api.get<Vuelo[]>('/vuelos'),
      fetchReservas(),
    ])
      .then(([u, c, v]) => {
        setUsuarios(u);
        setCiudades(c);
        setVuelos(v);
      })
      .catch((err: unknown) =>
        setCatalogError(err instanceof Error ? err.message : 'Error al cargar datos')
      )
      .finally(() => setLoadingCatalogs(false));
  }, []);

  const vuelosFiltrados = useMemo(() => {
    if (!form.ciudadOrigenId || !form.ciudadDestinoId) return [];

    return vuelos.filter((vuelo) => {
      const aeropuertos = vuelo.aeropuertos ?? [];
      if (aeropuertos.length < 2) return false;

      const origen = aeropuertos[0]?.ciudad?.id;
      const destino = aeropuertos[aeropuertos.length - 1]?.ciudad?.id;

      return (
        String(origen) === form.ciudadOrigenId &&
        String(destino) === form.ciudadDestinoId
      );
    });
  }, [form.ciudadOrigenId, form.ciudadDestinoId, vuelos]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'ciudadOrigenId' || name === 'ciudadDestinoId' ? { vueloId: '' } : {}),
    }));
  };

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
      setForm(formInicial);
      await fetchReservas();
    } catch (err: unknown) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : 'Error desconocido' });
    } finally {
      setLoading(false);
    }
  };

  if (loadingCatalogs) return <p>Cargando datos...</p>;
  if (catalogError) return <p style={{ color: 'red' }}>{catalogError}</p>;

  const vueloSeleccionado = vuelosFiltrados.find((v) => String(v.id) === form.vueloId);

  return (
    <div>
      <h2>Nueva Reserva</h2>
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
          <label>Ciudad de ida</label>
          <select name="ciudadOrigenId" value={form.ciudadOrigenId} onChange={handleChange} required>
            <option value="">-- Seleccionar --</option>
            {ciudades.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombreCiudad}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Ciudad de llegada</label>
          <select name="ciudadDestinoId" value={form.ciudadDestinoId} onChange={handleChange} required>
            <option value="">-- Seleccionar --</option>
            {ciudades.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombreCiudad}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Vuelo</label>
          <select name="vueloId" value={form.vueloId} onChange={handleChange} required disabled={!form.ciudadOrigenId || !form.ciudadDestinoId}>
            <option value="">
              {!form.ciudadOrigenId || !form.ciudadDestinoId
                ? '-- Seleccione ciudades primero --'
                : '-- Seleccionar vuelo --'}
            </option>
            {vuelosFiltrados.map((v) => (
              <option key={v.id} value={v.id}>
                #{v.id} — {v.aerolinea?.nombreAerolinea ?? '-'} — {v.fechaSalida}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading || !vueloSeleccionado}>
          {loading ? 'Guardando...' : 'Crear Reserva'}
        </button>
      </form>

      {msg && <p style={{ color: msg.ok ? 'green' : 'red' }}>{msg.text}</p>}

      {form.ciudadOrigenId && form.ciudadDestinoId && vuelosFiltrados.length === 0 && (
        <p>No hay vuelos para esa combinación de ciudades.</p>
      )}

      <h3>Reservas registradas</h3>
      {reservas.length === 0 ? (
        <p>No hay reservas.</p>
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
            {reservas.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.usuario ? `${r.usuario.nombrePersona} ${r.usuario.apellidoPersona}` : '-'}</td>
                <td>{r.vuelo ? `#${r.vuelo.id} — ${r.vuelo.fechaSalida}` : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
