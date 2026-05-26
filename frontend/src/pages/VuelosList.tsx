import { useEffect, useState } from 'react';
import { api } from '../api/client';

interface Vuelo {
  id: number;
  fechaSalida: string;
  fechaLlegada: string;
  aerolinea?: { nombreAerolinea?: string };
  avion?: { modelo?: string };
  piloto?: { nombrePersona?: string; apellidoPersona?: string };
}

export default function VuelosList() {
  const [vuelos, setVuelos] = useState<Vuelo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVuelos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<Vuelo[]>('/vuelos');
      setVuelos(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar vuelos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVuelos(); }, []);

  return (
    <div>
      <h2>Lista de Vuelos</h2>
      <button onClick={fetchVuelos} disabled={loading}>Refrescar</button>
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
              <th>Avión</th>
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
                <td>{v.avion?.modelo ?? '-'}</td>
                <td>{v.piloto ? `${v.piloto.nombrePersona} ${v.piloto.apellidoPersona}` : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
