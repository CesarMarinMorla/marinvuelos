package com.itu.MarinVuelos.repositories;

import com.itu.MarinVuelos.entities.actores.Usuario;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends BaseRepository<Usuario, Long> {
}
