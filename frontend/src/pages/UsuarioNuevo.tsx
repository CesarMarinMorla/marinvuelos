import { useState } from 'react';
import { api } from '../api/client';

export default function UsuarioNuevo() {
  const [form, setForm] = useState({ nombre: '', apellido: '', dni: '', correo: '', password: '' });
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      await api.post('/usuarios', form);
      setMsg({ ok: true, text: 'Usuario creado exitosamente.' });
      setForm({ nombre: '', apellido: '', dni: '', correo: '', password: '' });
    } catch (err: unknown) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : 'Error desconocido' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Nuevo Usuario</h2>
      <form onSubmit={handleSubmit}>
        {(['nombre', 'apellido', 'dni', 'correo', 'password'] as const).map((field) => (
          <div key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              name={field}
              type={field === 'password' ? 'password' : 'text'}
              value={form[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Crear Usuario'}
        </button>
      </form>
      {msg && <p style={{ color: msg.ok ? 'green' : 'red' }}>{msg.text}</p>}
    </div>
  );
}
