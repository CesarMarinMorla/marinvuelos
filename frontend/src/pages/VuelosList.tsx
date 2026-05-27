import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';

interface Aerolinea { id: number; nombreAerolinea: string }
interface Ciudad { id: number; nombreCiudad: string }
interface Aeropuerto {
  id: number;
  nombreAeropuerto: string;
  ciudad?: Ciudad;
}
interface Vuelo {
  id: number;
  fechaSalida: string;
  fechaLlegada: string;
  aerolinea?: { id?: number; nombreAerolinea?: string };
  aeropuertos?: Aeropuerto[];
  piloto?: { id?: number; nombrePersona?: string; apellidoPersona?: string };
}

type Filtros = {
  fechaSalida: string;
  aerolineaId: string;
  aeropuertoOrigenId: string;
  aeropuertoDestinoId: string;
};

const filtrosIniciales: Filtros = {
  fechaSalida: '',
  aerolineaId: '',
  aeropuertoOrigenId: '',
  aeropuertoDestinoId: '',
};

export default function VuelosList() {
  const [vuelos, setVuelos] = useState<Vuelo[]>([]);
  const [aerolineas, setAerolineas] = useState<Aerolinea[]>([]);
  const [aeropuertos, setAeropuertos] = useState<Aeropuerto[]>([]);
  const [filtros, setFiltros] = useState<Filtros>(filtrosIniciales);
  const [loading, setLoading] = useState(false);
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  const buscar = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<Vuelo[]>('/vuelos/buscar');
      setVuelos(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar vuelos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([
      api.get<Aerolinea[]>('/aerolineas'),
      api.get<Aeropuerto[]>('/aeropuertos'),
    ])
      .then(([aerolineasData, aeropuertosData]) => {
        setAerolineas(aerolineasData);
        setAeropuertos(aeropuertosData);
      })
      .catch((err: unknown) =>
        setCatalogError(err instanceof Error ? err.message : 'Error al cargar catálogos')
      )
      .finally(() => setLoadingCatalogs(false));
  }, []);

  useEffect(() => {
    if (!loadingCatalogs) {
      buscar();
    }
  }, [loadingCatalogs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFiltros({ ...filtros, [e.target.name]: e.target.value });

  const vuelosFiltrados = useMemo(() => {
    return vuelos.filter((vuelo) => {
      const aeropuertosVuelo = vuelo.aeropuertos ?? [];
      const origen = aeropuertosVuelo[0];
      const destino = aeropuertosVuelo[aeropuertosVuelo.length - 1];

      const coincideFecha =
        !filtros.fechaSalida || vuelo.fechaSalida.slice(0, 10) === filtros.fechaSalida;
      const coincideAerolinea =
        !filtros.aerolineaId || String(vuelo.aerolinea?.id) === filtros.aerolineaId;
      const coincideOrigen =
        !filtros.aeropuertoOrigenId || String(origen?.id) === filtros.aeropuertoOrigenId;
      const coincideDestino =
        !filtros.aeropuertoDestinoId || String(destino?.id) === filtros.aeropuertoDestinoId;

      return coincideFecha && coincideAerolinea && coincideOrigen && coincideDestino;
    });
  }, [filtros, vuelos]);

  const limpiar = async () => {
    setFiltros(filtrosIniciales);
    await buscar();
  };

  if (loadingCatalogs) return <p>Cargando catálogos...</p>;
  if (catalogError) return <p style={{ color: 'red' }}>{catalogError}</p>;

  return (
    <div className="page-card">
      <h2 className="page-title">Vuelos disponibles</h2>
      <p className="muted">Buscá por ruta, fecha y aerolínea sin exponer IDs al empleado.</p>

      <form onSubmit={(e) => e.preventDefault()} style={{ marginBottom: 16 }}>
        <div className="inline-grid">
          <label>Fecha</label>
          <input type="date" name="fechaSalida" value={filtros.fechaSalida} onChange={handleChange} />
        </div>

        <div className="inline-grid">
          <label>Aerolínea</label>
          <select name="aerolineaId" value={filtros.aerolineaId} onChange={handleChange}>
            <option value="">Todas</option>
            {aerolineas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombreAerolinea}
              </option>
            ))}
          </select>
        </div>

        <div className="inline-grid">
          <label>Aeropuerto de salida</label>
          <select name="aeropuertoOrigenId" value={filtros.aeropuertoOrigenId} onChange={handleChange}>
            <option value="">Todos</option>
            {aeropuertos.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombreAeropuerto} — {a.ciudad?.nombreCiudad ?? 'Sin ciudad'}
              </option>
            ))}
          </select>
        </div>

        <div className="inline-grid">
          <label>Aeropuerto de llegada</label>
          <select name="aeropuertoDestinoId" value={filtros.aeropuertoDestinoId} onChange={handleChange}>
            <option value="">Todos</option>
            {aeropuertos.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombreAeropuerto} — {a.ciudad?.nombreCiudad ?? 'Sin ciudad'}
              </option>
            ))}
          </select>
        </div>

        <div className="action-bar">
          <button type="button" onClick={() => void buscar()} disabled={loading}>
            Buscar
          </button>
          <button type="button" onClick={() => void limpiar()} disabled={loading} className="secondary-link">
            Limpiar
          </button>
        </div>
      </form>

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <table border={1} cellPadding={6}>
          <thead>
            <tr>
              <th>Ruta</th>
              <th>Salida</th>
              <th>Llegada</th>
              <th>Aerolínea</th>
              <th>Piloto</th>
            </tr>
          </thead>
          <tbody>
            {vuelosFiltrados.map((v) => {
              const aeropuertosVuelo = v.aeropuertos ?? [];
              const origen = aeropuertosVuelo[0];
              const destino = aeropuertosVuelo[aeropuertosVuelo.length - 1];

              return (
                <tr key={v.id}>
                  <td>
                    {origen?.ciudad?.nombreCiudad ?? origen?.nombreAeropuerto ?? '-'} →{' '}
                    {destino?.ciudad?.nombreCiudad ?? destino?.nombreAeropuerto ?? '-'}
                  </td>
                  <td>{v.fechaSalida}</td>
                  <td>{v.fechaLlegada}</td>
                  <td>{v.aerolinea?.nombreAerolinea ?? '-'}</td>
                  <td>{v.piloto ? `${v.piloto.nombrePersona} ${v.piloto.apellidoPersona}` : '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
