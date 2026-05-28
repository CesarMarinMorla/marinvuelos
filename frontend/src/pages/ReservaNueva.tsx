import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { formatDate } from '../utils/date';

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
  tarifas?: Tarifa[];
}

interface Tarifa {
  id: number;
  claseTarifa?: 'BUSINESS' | 'TURISTA' | 'ECONOMY';
  precioTarifa?: number;
  impuestoTarifa?: number;
}

interface Reserva {
  id: number;
  usuario?: Usuario;
  vuelo?: Vuelo;
  tarifa?: Tarifa;
}

type FormState = {
  usuarioId: string;
  ciudadOrigenId: string;
  ciudadDestinoId: string;
  vueloId: string;
  tarifaId: string;
};

type FormErrors = Partial<Record<keyof FormState, string>> & { form?: string };

const formInicial: FormState = {
  usuarioId: '',
  ciudadOrigenId: '',
  ciudadDestinoId: '',
  vueloId: '',
  tarifaId: '',
};

export default function ReservaNueva() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [vuelos, setVuelos] = useState<Vuelo[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(formInicial);
  const [errors, setErrors] = useState<FormErrors>({});
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
      const aeropuertosVuelo = vuelo.aeropuertos ?? [];
      if (aeropuertosVuelo.length < 2) return false;

      const origen = aeropuertosVuelo[0]?.ciudad?.id;
      const destino = aeropuertosVuelo[aeropuertosVuelo.length - 1]?.ciudad?.id;

      return (
        String(origen) === form.ciudadOrigenId &&
        String(destino) === form.ciudadDestinoId
      );
    });
  }, [form.ciudadOrigenId, form.ciudadDestinoId, vuelos]);

  const vueloSeleccionado = vuelosFiltrados.find((v) => String(v.id) === form.vueloId);
  const tarifasVuelo = vueloSeleccionado?.tarifas ?? [];
  const tarifaSeleccionada = tarifasVuelo.find((t) => String(t.id) === form.tarifaId);
  const reservasOrdenadas = [...reservas].sort((a, b) => b.id - a.id);
  const ultimaReserva = reservasOrdenadas[0];

  const formatRuta = (vuelo?: Vuelo) => {
    const aeropuertosVuelo = vuelo?.aeropuertos ?? [];
    if (aeropuertosVuelo.length < 2) return '-';
    const origen = aeropuertosVuelo[0]?.ciudad?.nombreCiudad ?? aeropuertosVuelo[0]?.nombreAeropuerto ?? '-';
    const destino = aeropuertosVuelo[aeropuertosVuelo.length - 1]?.ciudad?.nombreCiudad ?? aeropuertosVuelo[aeropuertosVuelo.length - 1]?.nombreAeropuerto ?? '-';
    return `${origen} → ${destino}`;
  };

  const formatMonto = (tarifa?: Tarifa) => {
    if (!tarifa) return '-';
    const total = Number(tarifa.precioTarifa ?? 0) + Number(tarifa.impuestoTarifa ?? 0);
    return `$${total.toFixed(2)}`;
  };

  const validate = (current: FormState): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!current.usuarioId) nextErrors.usuarioId = 'Seleccione un usuario.';
    if (!current.ciudadOrigenId) nextErrors.ciudadOrigenId = 'Seleccione la ciudad de ida.';
    if (!current.ciudadDestinoId) nextErrors.ciudadDestinoId = 'Seleccione la ciudad de llegada.';
    if (current.ciudadOrigenId && current.ciudadDestinoId && current.ciudadOrigenId === current.ciudadDestinoId) {
      nextErrors.form = 'La ciudad de ida y la de llegada deben ser diferentes.';
    }
    if (!current.vueloId) nextErrors.vueloId = 'Seleccione un vuelo.';
    if (current.vueloId && !vueloSeleccionado) nextErrors.vueloId = 'El vuelo seleccionado no es válido para la ruta.';
    if (!current.tarifaId) nextErrors.tarifaId = 'Seleccione una tarifa.';
    if (current.tarifaId && !tarifaSeleccionada) nextErrors.tarifaId = 'La tarifa seleccionada no es válida para el vuelo.';

    return nextErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'ciudadOrigenId' || name === 'ciudadDestinoId' ? { vueloId: '', tarifaId: '' } : {}),
      ...(name === 'vueloId' ? { tarifaId: '' } : {}),
    }));

    setErrors((current) => ({ ...current, [name]: undefined, form: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const nextErrors = validate(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setLoading(false);
      return;
    }

    try {
      await api.post('/reservas', {
        usuario: { id: Number(form.usuarioId) },
        vuelo: { id: Number(form.vueloId) },
        tarifa: { id: Number(form.tarifaId) },
      });
      setMsg({ ok: true, text: 'Reserva creada exitosamente.' });
      setForm(formInicial);
      setErrors({});
      await fetchReservas();
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
      <h2 className="page-title">Nueva Reserva</h2>
      <p className="muted">Elegí usuario, ciudades, vuelo y tarifa disponible para registrar la reserva.</p>

      <form onSubmit={handleSubmit} noValidate>
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
          {errors.usuarioId && <small style={{ color: 'red' }}>{errors.usuarioId}</small>}
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
          {errors.ciudadOrigenId && <small style={{ color: 'red' }}>{errors.ciudadOrigenId}</small>}
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
          {errors.ciudadDestinoId && <small style={{ color: 'red' }}>{errors.ciudadDestinoId}</small>}
        </div>

        <div>
          <label>Vuelo</label>
          <select
            name="vueloId"
            value={form.vueloId}
            onChange={handleChange}
            required
            disabled={!form.ciudadOrigenId || !form.ciudadDestinoId}
          >
            <option value="">
              {!form.ciudadOrigenId || !form.ciudadDestinoId
                ? '-- Seleccione ciudades primero --'
                : '-- Seleccionar vuelo --'}
            </option>
            {vuelosFiltrados.map((v) => (
              <option key={v.id} value={v.id}>
                #{v.id} — {v.aerolinea?.nombreAerolinea ?? '-'} — {formatDate(v.fechaSalida)}
              </option>
            ))}
          </select>
          {errors.vueloId && <small style={{ color: 'red' }}>{errors.vueloId}</small>}
        </div>

        <div>
          <label>Tarifa</label>
          <select
            name="tarifaId"
            value={form.tarifaId}
            onChange={handleChange}
            required
            disabled={!vueloSeleccionado}
          >
            <option value="">
              {!vueloSeleccionado ? '-- Seleccione un vuelo primero --' : '-- Seleccionar tarifa --'}
            </option>
            {tarifasVuelo.map((t) => (
              <option key={t.id} value={t.id}>
                {t.claseTarifa} — ${t.precioTarifa?.toFixed(2) ?? '-'}
              </option>
            ))}
          </select>
          {errors.tarifaId && <small style={{ color: 'red' }}>{errors.tarifaId}</small>}
        </div>

        {errors.form && <p style={{ color: 'red' }}>{errors.form}</p>}

        <button type="submit" disabled={loading || !vueloSeleccionado}>
          {loading ? 'Guardando...' : 'Crear Reserva'}
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

      {ultimaReserva && (
        <section
          style={{
            marginTop: '1rem',
            padding: '1rem',
            border: '1px solid var(--grv-border)',
            borderRadius: 10,
            background: 'var(--grv-surface-alt)',
          }}
        >
          <h3 style={{ marginTop: 0 }}>Última reserva registrada</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
            <div><strong>Usuario</strong><br />{ultimaReserva.usuario ? `${ultimaReserva.usuario.nombrePersona} ${ultimaReserva.usuario.apellidoPersona}` : '-'}</div>
            <div><strong>Ruta</strong><br />{formatRuta(ultimaReserva.vuelo)}</div>
            <div><strong>Vuelo</strong><br />#{ultimaReserva.vuelo?.id ?? '-'}</div>
            <div><strong>Tarifa</strong><br />{ultimaReserva.tarifa?.claseTarifa ?? '-'}</div>
            <div><strong>Total</strong><br />{formatMonto(ultimaReserva.tarifa)}</div>
            <div><strong>Salida</strong><br />{formatDate(ultimaReserva.vuelo?.fechaSalida)}</div>
          </div>
        </section>
      )}

      {form.ciudadOrigenId && form.ciudadDestinoId && vuelosFiltrados.length === 0 && (
        <div
          style={{
            marginTop: '1rem',
            marginBottom: '1rem',
            padding: '0.75rem 1rem',
            borderRadius: 8,
            background: '#fffbeb',
            color: '#b45309',
            border: '1px solid #fde68a',
            fontSize: '0.9rem',
          }}
        >
          ⚠️ <strong>Aviso:</strong> No hay vuelos disponibles para esa combinación de ciudades.
        </div>
      )}
      {vueloSeleccionado && tarifasVuelo.length === 0 && <p>El vuelo seleccionado no tiene tarifas precargadas.</p>}

      <h3>Reservas registradas</h3>
      {reservas.length === 0 ? (
        <p>No hay reservas.</p>
      ) : (
        <table border={1} cellPadding={6}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Ruta</th>
              <th>Vuelo</th>
              <th>Tarifa</th>
              <th>Total</th>
              <th>Salida</th>
            </tr>
          </thead>
          <tbody>
            {reservasOrdenadas.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.usuario ? `${r.usuario.nombrePersona} ${r.usuario.apellidoPersona}` : '-'}</td>
                <td>{formatRuta(r.vuelo)}</td>
                <td>{r.vuelo ? `#${r.vuelo.id}` : '-'}</td>
                <td>{r.tarifa?.claseTarifa ?? '-'}</td>
                <td>{formatMonto(r.tarifa)}</td>
                <td>{formatDate(r.vuelo?.fechaSalida)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
