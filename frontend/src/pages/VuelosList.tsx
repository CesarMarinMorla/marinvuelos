import { useEffect, useState } from 'react';
import { api } from '../api/client';

interface Aerolinea { id: number; nombreAerolinea: string }
interface Aeropuerto { id: number; nombreAeropuerto: string }
interface Piloto { id: number; nombrePersona?: string; apellidoPersona?: string }
interface Vuelo {
  id: number;
  fechaSalida: string;
  fechaLlegada: string;
  aerolinea?: { id?: number; nombreAerolinea?: string };
  aeropuertos?: { id?: number; nombreAeropuerto?: string }[];
  piloto?: { id?: number; nombrePersona?: string; apellidoPersona?: string };
}

type Filtros = {
  fechaSalida: string;
  aerolineaId: string;
  aeropuertoId: string;
  pilotoId: string;
};

const filtrosIniciales: Filtros = {
  fechaSalida: '',
  aerolineaId: '',
  aeropuertoId: '',
  pilotoId: '',
};

export default function VuelosList() {
  const [vuelos, setVuelos] = useState<Vuelo[]>([]);
  const [aerolineas, setAerolineas] = useState<Aerolinea[]>([]);
  const [aeropuertos, setAeropuertos] = useState<Aeropuerto[]>([]);
  const [pilotos, setPilotos] = useState<Piloto[]>([]);
  const [filtros, setFiltros] = useState<Filtros>(filtrosIniciales);
  const [loading, setLoading] = useState(false);
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  const buscar = async (params: Filtros = filtrosIniciales) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      if (params.fechaSalida) query.set('fechaSalida', params.fechaSalida);
      if (params.aerolineaId) query.set('aerolineaId', params.aerolineaId);
      if (params.aeropuertoId) query.set('aeropuertoId', params.aeropuertoId);
      if (params.pilotoId) query.set('pilotoId', params.pilotoId);

      const path = query.toString() ? `/vuelos/buscar?${query.toString()}` : '/vuelos/buscar';
      const data = await api.get<Vuelo[]>(path);
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
      api.get<Piloto[]>('/pilotos'),
    ])
      .then(([aerolineasData, aeropuertosData, pilotosData]) => {
        setAerolineas(aerolineasData);
        setAeropuertos(aeropuertosData);
        setPilotos(pilotosData);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await buscar(filtros);
  };

  const limpiar = async () => {
    setFiltros(filtrosIniciales);
    await buscar(filtrosIniciales);
  };

  if (loadingCatalogs) return <p>Cargando catálogos...</p>;
  if (catalogError) return <p style={{ color: 'red' }}>{catalogError}</p>;

  return (
    <div className="page-card">
      <h2 className="page-title">Vuelos disponibles</h2>
      <p className="muted">Filtrá por fecha y datos operativos para encontrar el vuelo correcto.</p>
      <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
        <div>
          <label>Fecha de salida</label>
          <input type="date" name="fechaSalida" value={filtros.fechaSalida} onChange={handleChange} />
        </div>
        <div>
          <label>Aerolínea</label>
          <select name="aerolineaId" value={filtros.aerolineaId} onChange={handleChange}>
            <option value="">Todas</option>
            {aerolineas.map((a) => (
              <option key={a.id} value={a.id}>{a.nombreAerolinea}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Aeropuerto</label>
          <select name="aeropuertoId" value={filtros.aeropuertoId} onChange={handleChange}>
            <option value="">Todos</option>
            {aeropuertos.map((a) => (
              <option key={a.id} value={a.id}>{a.nombreAeropuerto}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Piloto</label>
          <select name="pilotoId" value={filtros.pilotoId} onChange={handleChange}>
            <option value="">Todos</option>
            {pilotos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombrePersona} {p.apellidoPersona}
              </option>
            ))}
          </select>
        </div>
        <div className="action-bar">
          <button type="submit" disabled={loading}>Buscar</button>
          <button type="button" onClick={limpiar} disabled={loading} className="secondary-link">Limpiar</button>
        </div>
      </form>

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <table border={1} cellPadding={6}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Salida</th>
              <th>Llegada</th>
              <th>Aerolínea</th>
              <th>Aeropuerto(s)</th>
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
      )}
    </div>
  );
}
