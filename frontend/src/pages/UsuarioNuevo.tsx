import { useEffect, useState } from 'react';
import { api } from '../api/client';

interface Usuario {
  id: number;
  dni: string;
  nombrePersona: string;
  apellidoPersona: string;
  correo: string;
}

type FormState = {
  nombrePersona: string;
  apellidoPersona: string;
  dni: string;
  correo: string;
};

type FormErrors = Partial<Record<keyof FormState, string>> & { form?: string };

const formInicial: FormState = {
  nombrePersona: '',
  apellidoPersona: '',
  dni: '',
  correo: '',
};

const dniRegex = /^\d{7,8}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s'-]{2,}$/;

function validate(form: FormState, usuarios: Usuario[]): FormErrors {
  const errors: FormErrors = {};
  const nombre = form.nombrePersona.trim();
  const apellido = form.apellidoPersona.trim();
  const dni = form.dni.trim();
  const correo = form.correo.trim();

  if (!nameRegex.test(nombre)) {
    errors.nombrePersona = 'Ingrese un nombre válido (mínimo 2 letras).';
  }

  if (!nameRegex.test(apellido)) {
    errors.apellidoPersona = 'Ingrese un apellido válido (mínimo 2 letras).';
  }

  if (!dniRegex.test(dni)) {
    errors.dni = 'El DNI debe tener 7 u 8 dígitos numéricos.';
  } else if (usuarios.some((u) => u.dni === dni)) {
    errors.dni = 'Ya existe un usuario con ese DNI.';
  }

  if (!emailRegex.test(correo)) {
    errors.correo = 'Ingrese un correo válido.';
  } else if (usuarios.some((u) => u.correo.toLowerCase() === correo.toLowerCase())) {
    errors.correo = 'Ya existe un usuario con ese correo.';
  }

  return errors;
}

export default function UsuarioNuevo() {
  const [form, setForm] = useState(formInicial);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors((current) => ({ ...current, [name]: undefined, form: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const nextErrors = validate(form, usuarios);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setLoading(false);
      return;
    }

    const payload = {
      nombrePersona: form.nombrePersona.trim(),
      apellidoPersona: form.apellidoPersona.trim(),
      dni: form.dni.trim(),
      correo: form.correo.trim().toLowerCase(),
    };

    try {
      await api.post('/usuarios', payload);
      setMsg({ ok: true, text: 'Usuario creado exitosamente.' });
      setForm(formInicial);
      setErrors({});
      await fetchUsuarios();
    } catch (err: unknown) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : 'Error desconocido' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-card">
      <h2 className="page-title">Nuevo usuario</h2>
      <p className="muted">Alta rápida del pasajero para que el empleado pueda operar reservas y consultas.</p>
      <p className="muted">La contraseña inicial será el DNI del usuario.</p>

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label>Nombre</label>
          <input name="nombrePersona" value={form.nombrePersona} onChange={handleChange} autoComplete="given-name" required />
          {errors.nombrePersona && <small style={{ color: 'red' }}>{errors.nombrePersona}</small>}
        </div>
        <div>
          <label>Apellido</label>
          <input name="apellidoPersona" value={form.apellidoPersona} onChange={handleChange} autoComplete="family-name" required />
          {errors.apellidoPersona && <small style={{ color: 'red' }}>{errors.apellidoPersona}</small>}
        </div>
        <div>
          <label>DNI</label>
          <input name="dni" value={form.dni} onChange={handleChange} inputMode="numeric" autoComplete="off" required />
          {errors.dni && <small style={{ color: 'red' }}>{errors.dni}</small>}
        </div>
        <div>
          <label>Correo</label>
          <input name="correo" type="email" value={form.correo} onChange={handleChange} autoComplete="email" required />
          {errors.correo && <small style={{ color: 'red' }}>{errors.correo}</small>}
        </div>
        {errors.form && <p style={{ color: 'red' }}>{errors.form}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Crear usuario'}
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
