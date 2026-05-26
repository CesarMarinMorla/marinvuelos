package com.itu.MarinVuelos.services;

import com.itu.MarinVuelos.entities.actores.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UsuarioService extends BaseService<Usuario, Long> {
    Usuario findByCorreo(String correo);
}
