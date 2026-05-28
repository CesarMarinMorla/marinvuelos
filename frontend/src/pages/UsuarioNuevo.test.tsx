import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import UsuarioNuevo from './UsuarioNuevo';
import { api } from '../api/client';

vi.mock('../api/client', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('UsuarioNuevo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.get).mockResolvedValue([]);
    vi.mocked(api.post).mockResolvedValue({} as never);
  });

  it('filtra caracteres no numéricos en número de tarjeta', async () => {
    render(<UsuarioNuevo />);

    const inputTarjeta = await screen.findByLabelText('Número de tarjeta');
    fireEvent.change(inputTarjeta, { target: { value: '1234-abcd-56' } });

    expect(inputTarjeta).toHaveValue('123456');
  });

  it('no envía el formulario si la tarjeta tiene menos de 13 dígitos', async () => {
    render(<UsuarioNuevo />);

    await waitFor(() => expect(api.get).toHaveBeenCalledWith('/usuarios'));

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana' } });
    fireEvent.change(screen.getByLabelText('Apellido'), { target: { value: 'Lopez' } });
    fireEvent.change(screen.getByLabelText('DNI'), { target: { value: '23456789' } });
    fireEvent.change(screen.getByLabelText('Correo'), { target: { value: 'ana@example.com' } });
    fireEvent.change(screen.getByLabelText('Número de tarjeta'), { target: { value: '123456789012' } });

    fireEvent.click(screen.getByRole('button', { name: 'Crear usuario' }));

    expect(await screen.findByText('El número de tarjeta debe tener entre 13 y 19 dígitos numéricos.')).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });
});
