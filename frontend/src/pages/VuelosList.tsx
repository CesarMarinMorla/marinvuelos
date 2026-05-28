import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { formatDate } from '../utils/date';

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

interface PageResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
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

const PAGE_SIZE = 10;

export default function VuelosList() {
  const [pageData, setPageData] = useState<PageResponse<Vuelo> | null>(null);
  const [aerolineas, setAerolineas] = useState<Aerolinea[]>([]);
  const [aeropuertos, setAeropuertos] = useState<Aeropuerto[]>([]);
  const [filtros, setFiltros] = useState<Filtros>(filtrosIniciales);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  const buscar = async (nextPage = page, currentFilters = filtros) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      query.set('page', String(nextPage));
      query.set('size', String(PAGE_SIZE));
      if (currentFilters.fechaSalida) query.set('fechaSalida', currentFilters.fechaSalida);
      if (currentFilters.aerolineaId) query.set('aerolineaId', currentFilters.aerolineaId);
      if (currentFilters.aeropuertoOrigenId) {
        query.set('aeropuertoOrigenId', currentFilters.aeropuertoOrigenId);
      }
      if (currentFilters.aeropuertoDestinoId) {
        query.set('aeropuertoDestinoId', currentFilters.aeropuertoDestinoId);
      }

      const data = await api.get<PageResponse<Vuelo>>(`/vuelos/buscar?${query.toString()}`);
      setPageData(data);
      setPage(data.number);
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
      void buscar(0, filtrosIniciales);
    }
  }, [loadingCatalogs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFiltros({ ...filtros, [e.target.name]: e.target.value });

  const aplicarFiltros = async (e: React.FormEvent) => {
    e.preventDefault();
    await buscar(0, filtros);
  };

  const limpiar = async () => {
    setFiltros(filtrosIniciales);
    await buscar(0, filtrosIniciales);
  };

  const pageContent = pageData?.content ?? [];

  if (loadingCatalogs) return <p>Cargando catálogos...</p>;
  if (catalogError) return <p style={{ color: 'red' }}>{catalogError}</p>;

  return (
    <div className="page-card">
      <h2 className="page-title">Vuelos disponibles</h2>
      <p className="muted">Buscá por ruta, fecha y aerolínea; la tabla muestra solo una página a la vez.</p>

      <form onSubmit={aplicarFiltros} style={{ marginBottom: 16 }}>
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
          <button type="submit" disabled={loading}>
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
        <>
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
              {pageContent.map((v) => {
                const aeropuertosVuelo = v.aeropuertos ?? [];
                const origen = aeropuertosVuelo[0];
                const destino = aeropuertosVuelo[aeropuertosVuelo.length - 1];

                return (
                  <tr key={v.id}>
                    <td className="text-route">
                      {origen?.ciudad?.nombreCiudad ?? origen?.nombreAeropuerto ?? '-'} →{' '}
                      {destino?.ciudad?.nombreCiudad ?? destino?.nombreAeropuerto ?? '-'}
                    </td>
                    <td className="text-date">{formatDate(v.fechaSalida)}</td>
                    <td className="text-date">{formatDate(v.fechaLlegada)}</td>
                    <td>{v.aerolinea?.nombreAerolinea ?? '-'}</td>
                    <td className="text-name">{v.piloto ? `${v.piloto.nombrePersona} ${v.piloto.apellidoPersona}` : '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="action-bar" style={{ marginTop: 12 }}>
            <button type="button" onClick={() => void buscar(page - 1, filtros)} disabled={loading || !pageData || pageData.first}>
              Anterior
            </button>
            <button type="button" onClick={() => void buscar(page + 1, filtros)} disabled={loading || !pageData || pageData.last}>
              Siguiente
            </button>
            <span className="muted" style={{ alignSelf: 'center' }}>
              Página {pageData ? pageData.number + 1 : 1} de {pageData?.totalPages ?? 1} · {pageData?.totalElements ?? 0} resultados
            </span>
          </div>
        </>
      )}
    </div>
  );
}
