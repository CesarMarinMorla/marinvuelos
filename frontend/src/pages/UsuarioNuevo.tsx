import { useEffect, useState } from 'react';
import { api } from '../api/client';

interface Usuario {
  id: number;
  dni: string;
  nombrePersona: string;
  apellidoPersona: string;
  correo: string;
}

const formInicial = {
  nombrePersona: '',
  apellidoPersona: '',
  dni: '',
  correo: '',
  password: '',
};

export default function UsuarioNuevo() {
  const [form, setForm] = useState(formInicial);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const fetchUsuarios = async () => {
    setLoadingList(true);
    setError(null);
    try {
      const data = await api.get<Usuario[]>('/usuarios');
      setUsuarios(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      await api.post('/usuarios', form);
      setMsg({ ok: true, text: 'Usuario creado exitosamente.' });
      setForm(formInicial);
      await fetchUsuarios();
    } catch (err: unknown) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : 'Error desconocido' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-card">
      <h2 className="page-title">Nuevo Usuario</h2>
      <p className="muted">Alta rápida del pasajero para que el empleado pueda operar reservas y consultas.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>
          <input name="nombrePersona" value={form.nombrePersona} onChange={handleChange} required />
        </div>
        <div>
          <label>Apellido</label>
          <input name="apellidoPersona" value={form.apellidoPersona} onChange={handleChange} required />
        </div>
        <div>
          <label>DNI</label>
          <input name="dni" value={form.dni} onChange={handleChange} required />
        </div>
        <div>
          <label>Correo</label>
          <input name="correo" type="email" value={form.correo} onChange={handleChange} required />
        </div>
        <div>
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Crear Usuario'}
        </button>
      </form>

      {msg && <p style={{ color: msg.ok ? 'green' : 'red' }}>{msg.text}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>Usuarios registrados</h3>
      {loadingList ? (
        <p>Cargando usuarios...</p>
      ) : usuarios.length === 0 ? (
        <p>No hay usuarios.</p>
      ) : (
        <table border={1} cellPadding={6}>
          <thead>
            <tr>
              <th>ID</th>
              <th>DNI</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Correo</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.dni}</td>
                <td>{u.nombrePersona}</td>
                <td>{u.apellidoPersona}</td>
                <td>{u.correo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
