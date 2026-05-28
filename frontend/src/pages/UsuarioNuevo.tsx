import { useEffect, useState } from 'react';
import { api } from '../api/client';

interface Usuario {
  id: number;
  dni: string;
  nombrePersona: string;
  apellidoPersona: string;
  correo: string;
}

type TipoTarjeta = 'CREDITO' | 'DEBITO';

type FormState = {
  nombrePersona: string;
  apellidoPersona: string;
  dni: string;
  correo: string;
  numeroTarjeta: string;
  tipoTarjeta: TipoTarjeta;
};

type FormErrors = Partial<Record<keyof FormState, string>> & { form?: string };

const formInicial: FormState = {
  nombrePersona: '',
  apellidoPersona: '',
  dni: '',
  correo: '',
  numeroTarjeta: '',
  tipoTarjeta: 'CREDITO',
};

const dniRegex = /^\d{7,8}$/;
const tarjetaRegex = /^\d{13,19}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s'-]{2,}$/;

function validate(form: FormState, usuarios: Usuario[]): FormErrors {
  const errors: FormErrors = {};
  const nombre = form.nombrePersona.trim();
  const apellido = form.apellidoPersona.trim();
  const dni = form.dni.trim();
  const correo = form.correo.trim();
  const numeroTarjeta = form.numeroTarjeta.trim();

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

  if (!tarjetaRegex.test(numeroTarjeta)) {
    errors.numeroTarjeta = 'El número de tarjeta debe tener entre 13 y 19 dígitos numéricos.';
  }

  return errors;
}

function validateEdit(editForm: { nombrePersona: string; apellidoPersona: string; correo: string; dni: string }, usuarios: Usuario[], currentId: number): string | null {
  const nombre = editForm.nombrePersona.trim();
  const apellido = editForm.apellidoPersona.trim();
  const dni = editForm.dni.trim();
  const correo = editForm.correo.trim();

  if (!nameRegex.test(nombre)) {
    return 'Ingrese un nombre válido (mínimo 2 letras).';
  }

  if (!nameRegex.test(apellido)) {
    return 'Ingrese un apellido válido (mínimo 2 letras).';
  }

  if (!dniRegex.test(dni)) {
    return 'El DNI debe tener 7 u 8 dígitos numéricos.';
  } else if (usuarios.some((u) => u.dni === dni && u.id !== currentId)) {
    return 'Ya existe un usuario con ese DNI.';
  }

  if (!emailRegex.test(correo)) {
    return 'Ingrese un correo válido.';
  } else if (usuarios.some((u) => u.correo.toLowerCase() === correo.toLowerCase() && u.id !== currentId)) {
    return 'Ya existe un usuario con ese correo.';
  }

  return null;
}

export default function UsuarioNuevo() {
  const [form, setForm] = useState(formInicial);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Pick<Usuario, 'nombrePersona' | 'apellidoPersona' | 'correo' | 'dni'>>({ nombrePersona: '', apellidoPersona: '', correo: '', dni: '' });

  const fetchUsuarios = async ({ showLoading = true, clearError = true } = {}) => {
    if (showLoading) setLoadingList(true);
    if (clearError) setError(null);
    try {
      const data = await api.get<Usuario[]>('/usuarios');
      setUsuarios(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
    } finally {
      if (showLoading) setLoadingList(false);
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await api.get<Usuario[]>('/usuarios');
        if (active) setUsuarios(data);
      } catch (err: unknown) {
        if (active) setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
      } finally {
        if (active) setLoadingList(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const nextValue = name === 'numeroTarjeta' ? value.replace(/\D/g, '') : value;
    setForm({ ...form, [name]: nextValue });
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
      tarjetas: [
        {
          numeroTarjeta: form.numeroTarjeta.trim(),
          tipoTarjeta: form.tipoTarjeta,
          cantidad: 0,
        },
      ],
    };

    try {
      await api.post('/usuarios', payload);
      setMsg({ ok: true, text: 'Usuario y tarjeta creados exitosamente.' });
      setForm(formInicial);
      setErrors({});
      await fetchUsuarios();
    } catch (err: unknown) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : 'Error desconocido' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, nombre: string) => {
    if (!confirm(`¿Eliminar a ${nombre}? Se eliminarán sus tarjetas y reservas.`)) return;
    try {
      await api.delete(`/usuarios/${id}`);
      await fetchUsuarios({ showLoading: false });
    } catch (err: unknown) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : 'Error al eliminar' });
    }
  };

  const startEdit = (u: Usuario) => {
    setEditId(u.id);
    setEditForm({ nombrePersona: u.nombrePersona, apellidoPersona: u.apellidoPersona, correo: u.correo, dni: u.dni });
  };

  const handleEditSave = async (id: number) => {
    const trimmedForm = {
      nombrePersona: editForm.nombrePersona.trim(),
      apellidoPersona: editForm.apellidoPersona.trim(),
      correo: editForm.correo.trim().toLowerCase(),
      dni: editForm.dni.trim(),
    };

    const errorMsg = validateEdit(trimmedForm, usuarios, id);
    if (errorMsg) {
      setMsg({ ok: false, text: errorMsg });
      return;
    }
    setMsg(null);
    try {
      await api.put(`/usuarios/${id}`, trimmedForm);
      setEditId(null);
      await fetchUsuarios({ showLoading: false });
    } catch (err: unknown) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : 'Error al actualizar' });
    }
  };

  return (
    <div className="page-card">
      <h2 className="page-title">Nuevo usuario</h2>
      <p className="muted">Alta rápida del pasajero para que el empleado pueda operar reservas y consultas.</p>
      <p className="muted">La contraseña inicial será el DNI del usuario.</p>

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="nombrePersona">Nombre</label>
          <input id="nombrePersona" name="nombrePersona" value={form.nombrePersona} onChange={handleChange} autoComplete="given-name" required />
          {errors.nombrePersona && <small style={{ color: 'red' }}>{errors.nombrePersona}</small>}
        </div>
        <div>
          <label htmlFor="apellidoPersona">Apellido</label>
          <input id="apellidoPersona" name="apellidoPersona" value={form.apellidoPersona} onChange={handleChange} autoComplete="family-name" required />
          {errors.apellidoPersona && <small style={{ color: 'red' }}>{errors.apellidoPersona}</small>}
        </div>
        <div>
          <label htmlFor="dni">DNI</label>
          <input id="dni" name="dni" value={form.dni} onChange={handleChange} inputMode="numeric" autoComplete="off" required />
          {errors.dni && <small style={{ color: 'red' }}>{errors.dni}</small>}
        </div>
        <div>
          <label htmlFor="correo">Correo</label>
          <input id="correo" name="correo" type="email" value={form.correo} onChange={handleChange} autoComplete="email" required />
          {errors.correo && <small style={{ color: 'red' }}>{errors.correo}</small>}
        </div>
        <div>
          <label htmlFor="numeroTarjeta">Número de tarjeta</label>
          <input
            id="numeroTarjeta"
            name="numeroTarjeta"
            value={form.numeroTarjeta}
            onChange={handleChange}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            autoComplete="off"
            minLength={13}
            maxLength={19}
            required
          />
          {errors.numeroTarjeta && <small style={{ color: 'red' }}>{errors.numeroTarjeta}</small>}
        </div>
        <div>
          <label htmlFor="tipoTarjeta">Tipo de tarjeta</label>
          <select id="tipoTarjeta" name="tipoTarjeta" value={form.tipoTarjeta} onChange={handleChange}>
            <option value="CREDITO">Crédito</option>
            <option value="DEBITO">Débito</option>
          </select>
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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td className="text-id">{u.id}</td>
                {editId === u.id ? (
                  <>
                    <td><input value={editForm.dni} onChange={e => setEditForm({ ...editForm, dni: e.target.value.replace(/\D/g, '') })} /></td>
                    <td><input value={editForm.nombrePersona} onChange={e => setEditForm({ ...editForm, nombrePersona: e.target.value })} /></td>
                    <td><input value={editForm.apellidoPersona} onChange={e => setEditForm({ ...editForm, apellidoPersona: e.target.value })} /></td>
                    <td><input value={editForm.correo} onChange={e => setEditForm({ ...editForm, correo: e.target.value })} /></td>
                    <td style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                      <button type="button" className="btn-table" onClick={() => handleEditSave(u.id)}>Guardar</button>
                      <button type="button" className="btn-table secondary-link" onClick={() => setEditId(null)}>Cancelar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{u.dni}</td>
                    <td className="text-name">{u.nombrePersona}</td>
                    <td className="text-name">{u.apellidoPersona}</td>
                    <td>{u.correo}</td>
                    <td style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                      <button type="button" className="btn-table" onClick={() => startEdit(u)}>Editar</button>
                      <button type="button" className="btn-table" onClick={() => handleDelete(u.id, u.nombrePersona)} style={{ background: 'var(--grv-red)' }}>Eliminar</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
